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

async function completeOwnedBooking() {
  const harness = createDomainHarness();
  const customer = await harness.customers.create(admin, {
    email: sessionUser.email,
    name: sessionUser.name,
    userId: sessionUser.id,
  });
  const offering = await harness.catalog.create(admin, {
    fullDescription: "Home",
    name: "Home Refresh",
    shortDescription: "Weekly",
  });
  const booking = await harness.bookings.create(admin, {
    customerId: customer.id,
    serviceId: offering.id,
  });
  await harness.bookings.changeStatus(admin, booking.id, "CONFIRMED");
  const cleaner = await harness.cleaners.create(admin, {
    email: "mia@neatly.example",
    name: "Mia",
  });
  await harness.bookings.assignCleaner(admin, booking.id, cleaner.id);
  await harness.bookings.changeStatus(admin, booking.id, "IN_PROGRESS");
  await harness.bookings.complete(admin, booking.id);
  return { booking, harness };
}

describe("Customer review APIs", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(sessionUser),
    } as never);
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("requires a session and rejects client-owned moderation fields", async (): Promise<void> => {
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);
    const unauthenticated = await dispatchApi({
      method: "GET",
      url: API_PATHS.customerReviews,
    });
    expect(unauthenticated.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(sessionUser),
    } as never);
    const { booking, harness } = await completeOwnedBooking();
    mockedDomain.mockReturnValue(harness as never);

    const rejected = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          bookingId: booking.id,
          content: "The team was careful and on time.",
          customerId: "clother000000000000000001",
          isActive: true,
          rating: 5,
          status: "published",
        }),
        method: "POST",
        url: API_PATHS.customerReviews,
      }),
    );
    expect(rejected.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
  });

  it("creates and lists only the session customer's reviews", async (): Promise<void> => {
    const { booking, harness } = await completeOwnedBooking();
    mockedDomain.mockReturnValue(harness as never);

    const created = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          bookingId: booking.id,
          content: "The team was careful and on time.",
          rating: 5,
        }),
        method: "POST",
        url: API_PATHS.customerReviews,
      }),
    );
    const createdBody = parseJsonBody(created.body) as Envelope<{
      review: { bookingId: string; status: string };
    }>;
    expect(created.statusCode).toBe(HTTP_STATUS.CREATED);
    expect(createdBody.data.review.bookingId).toBe(booking.id);
    expect(createdBody.data.review.status).toBe("pending");
    expect(created.body).not.toContain("passwordHash");
    expect(created.body).not.toContain("customerId");

    const duplicate = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          bookingId: booking.id,
          content: "A second review should not save.",
          rating: 4,
        }),
        method: "POST",
        url: API_PATHS.customerReviews,
      }),
    );
    expect(duplicate.statusCode).toBe(HTTP_STATUS.CONFLICT);

    const list = await dispatchApi(
      withAuth({ method: "GET", url: API_PATHS.customerReviews }),
    );
    const listBody = parseJsonBody(list.body) as Envelope<{
      reviews: Array<{ bookingId: string }>;
    }>;
    expect(list.statusCode).toBe(HTTP_STATUS.OK);
    expect(listBody.data.reviews).toEqual([
      expect.objectContaining({ bookingId: booking.id }),
    ]);
  });
});
