import { beforeEach, describe, expect, it, vi } from "vitest";
import { HTTP_STATUS } from "../../../apps/server/src/config/constants.ts";
import { API_PATHS } from "../../../apps/server/src/contracts/v1.ts";
import { getAuthService } from "../../../apps/server/src/lib/auth/runtime.ts";
import type { Actor } from "../../../apps/server/src/lib/domain/actor.ts";
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
const admin: Actor = { id: "admin-1", role: "ADMIN" };

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
  error: { code: string; message: string; requestId?: string } | null;
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

describe("Customer booking read APIs", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(sessionUser),
    } as never);
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("rejects unauthenticated overview and list access", async (): Promise<void> => {
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);

    const overview = await dispatchApi({
      method: "GET",
      url: API_PATHS.customerDashboard,
    });
    expect(overview.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    const list = await dispatchApi({
      method: "GET",
      url: API_PATHS.customerBookings,
    });
    expect(list.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
  });

  it("rejects customerId query injection on the list endpoint", async (): Promise<void> => {
    const response = await dispatchApi(
      withAuth({
        method: "GET",
        url: `${API_PATHS.customerBookings}?customerId=clother000000000000000001`,
      }),
    );
    expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it("returns only the session customer's bookings and overview", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);
    const offering = await harness.catalog.create(admin, {
      fullDescription: "Home",
      name: "Home Refresh",
      shortDescription: "Weekly",
    });
    const created = await harness.bookings.createForCustomer(
      { id: sessionUser.id, role: "CUSTOMER" },
      {
        email: sessionUser.email,
        id: sessionUser.id,
        name: sessionUser.name,
      },
      {
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        serviceAddress: "12 Harbour Street",
        serviceId: offering.id,
      },
    );

    const list = await dispatchApi(
      withAuth({
        method: "GET",
        url: API_PATHS.customerBookings,
      }),
    );
    const listBody = parseJsonBody(list.body) as Envelope<{
      items: Array<{ id: string; status: string }>;
      pagination: { total: number };
    }>;

    expect(list.statusCode).toBe(HTTP_STATUS.OK);
    expect(listBody.data.items.map((item) => item.id)).toEqual([created.id]);
    expect(listBody.data.pagination.total).toBe(1);
    expect(list.body).not.toContain("customerId");
    expect(list.body).not.toContain("cleanerId");

    const overview = await dispatchApi(
      withAuth({
        method: "GET",
        url: API_PATHS.customerDashboard,
      }),
    );
    const overviewBody = parseJsonBody(overview.body) as Envelope<{
      overview: {
        summary: { pending: number; total: number; upcoming: number };
        upcomingBooking: { id: string } | null;
      };
    }>;

    expect(overview.statusCode).toBe(HTTP_STATUS.OK);
    expect(overviewBody.data.overview.upcomingBooking?.id).toBe(created.id);
    expect(overviewBody.data.overview.summary.total).toBe(1);
    expect(overviewBody.data.overview.summary.pending).toBe(1);
  });
});
