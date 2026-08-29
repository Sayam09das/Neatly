import { beforeEach, describe, expect, it, vi } from "vitest";
import { HTTP_STATUS } from "../../../apps/server/src/config/constants.ts";
import { API_PATHS } from "../../../apps/server/src/contracts/v1.ts";
import { getAuthService } from "../../../apps/server/src/lib/auth/runtime.ts";
import { getDomainServices } from "../../../apps/server/src/lib/domain/runtime.ts";
import { createDomainHarness } from "../domain/in-memory-domain.ts";
import { dispatchApi, parseJsonBody } from "./http-harness";

vi.mock("../../../apps/server/src/lib/auth/runtime.ts", () => ({
  getAuthService: vi.fn(),
}));

vi.mock("../../../apps/server/src/lib/domain/runtime.ts", () => ({
  getDomainServices: vi.fn(),
}));

const mockedAuth = vi.mocked(getAuthService);
const mockedDomain = vi.mocked(getDomainServices);

const sessionUser = {
  email: "ada@neatly.example",
  id: "customer-a",
  lastLoginAt: null,
  name: "Ada",
  role: "STAFF" as const,
  status: "ACTIVE" as const,
};

interface Envelope<T> {
  data: T;
  error: { code: string; message: string } | null;
  success: boolean;
}

function withAuth(
  input: Parameters<typeof dispatchApi>[0] = {},
): Parameters<typeof dispatchApi>[0] {
  return {
    ...input,
    headers: {
      "content-type": "application/json",
      "x-session-token": "session-token-value",
      ...input.headers,
    },
  };
}

describe("Customer notification APIs", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(sessionUser),
    } as never);
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("requires a session and ignores recipientId query ownership", async (): Promise<void> => {
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);

    const unauthenticated = await dispatchApi({
      method: "GET",
      url: API_PATHS.customerNotifications,
    });
    expect(unauthenticated.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(sessionUser),
    } as never);

    const injected = await dispatchApi(
      withAuth({
        method: "GET",
        url: `${API_PATHS.customerNotifications}?recipientId=clother000000000000000001`,
      }),
    );
    expect(injected.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it("returns only the session inbox and hides another customer's notification", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);
    const own = await harness.notifications.record({
      message: "Your booking request was received.",
      recipientId: sessionUser.id,
      relatedHref: "/dashboard/bookings/clbooking0000000000000001",
      relatedLabel: "View booking",
      title: "Booking requested",
    });
    const other = await harness.notifications.record({
      message: "Other inbox",
      recipientId: "customer-b",
      relatedHref: "/admin/bookings",
      relatedLabel: "View bookings",
      title: "New booking",
    });

    const list = await dispatchApi(
      withAuth({ method: "GET", url: API_PATHS.customerNotifications }),
    );
    const listBody = parseJsonBody(list.body) as Envelope<{
      items: Array<{ id: string; relatedHref: string | null; title: string }>;
    }>;
    expect(list.statusCode).toBe(HTTP_STATUS.OK);
    expect(list.headers["cache-control"]).toBe("no-store");
    expect(listBody.data.items).toEqual([
      expect.objectContaining({
        id: own.id,
        relatedHref: "/dashboard/bookings/clbooking0000000000000001",
        title: "Booking requested",
      }),
    ]);
    expect(list.body).not.toContain("recipientId");
    expect(list.body).not.toContain("Other inbox");
    expect(list.body).not.toContain("/admin/");

    const unread = await dispatchApi(
      withAuth({
        method: "GET",
        url: API_PATHS.customerNotificationsUnreadCount,
      }),
    );
    const unreadBody = parseJsonBody(unread.body) as Envelope<{
      count: number;
    }>;
    expect(unread.statusCode).toBe(HTTP_STATUS.OK);
    expect(unreadBody.data.count).toBe(1);

    const stolen = await dispatchApi(
      withAuth({
        method: "GET",
        url: `${API_PATHS.customerNotifications}/${other.id}`,
      }),
    );
    expect(stolen.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
    expect(stolen.body).not.toContain("Other inbox");

    const read = await dispatchApi(
      withAuth({
        method: "PATCH",
        url: `${API_PATHS.customerNotifications}/${own.id}/read`,
      }),
    );
    const readBody = parseJsonBody(read.body) as Envelope<{
      notification: { isRead: boolean };
    }>;
    expect(read.statusCode).toBe(HTTP_STATUS.OK);
    expect(readBody.data.notification.isRead).toBe(true);

    const second = await harness.notifications.record({
      message: "Review submitted.",
      recipientId: sessionUser.id,
      relatedHref: "/dashboard/reviews",
      relatedLabel: "View reviews",
      title: "Review submitted",
    });
    const readAll = await dispatchApi(
      withAuth({
        method: "POST",
        url: API_PATHS.customerNotificationsReadAll,
      }),
    );
    const readAllBody = parseJsonBody(readAll.body) as Envelope<{
      updated: number;
    }>;
    expect(readAll.statusCode).toBe(HTTP_STATUS.OK);
    expect(readAllBody.data.updated).toBe(1);

    const after = await dispatchApi(
      withAuth({
        method: "GET",
        url: API_PATHS.customerNotificationsUnreadCount,
      }),
    );
    expect(
      (parseJsonBody(after.body) as Envelope<{ count: number }>).data.count,
    ).toBe(0);
    expect(second.recipientId).toBe(sessionUser.id);
  });
});
