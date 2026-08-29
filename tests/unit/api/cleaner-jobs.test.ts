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

const cleanerUser = {
  email: "mia@neatly.example",
  id: "cleaner-a",
  lastLoginAt: null,
  name: "Mia",
  role: "STAFF" as const,
  status: "ACTIVE" as const,
};

const otherCleanerUser = {
  email: "lee@neatly.example",
  id: "cleaner-b",
  lastLoginAt: null,
  name: "Lee",
  role: "STAFF" as const,
  status: "ACTIVE" as const,
};

const adminUser = {
  email: "ada@neatly.example",
  id: "admin-a",
  lastLoginAt: null,
  name: "Ada",
  role: "ADMIN" as const,
  status: "ACTIVE" as const,
};

const customerUser = {
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
  user:
    | typeof cleanerUser
    | typeof otherCleanerUser
    | typeof adminUser
    | typeof customerUser,
  input: Parameters<typeof dispatchApi>[0] = {},
): Parameters<typeof dispatchApi>[0] {
  mockedAuth.mockReturnValue({
    resolveSession: vi.fn().mockResolvedValue(user),
  } as never);

  return {
    ...input,
    headers: {
      "content-type": "application/json",
      "x-session-token": "session-token-value",
      ...input.headers,
    },
  };
}

describe("Cleaner jobs API", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("returns session-scoped jobs and hides other cleaners and customer contact", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);
    const admin = { id: "admin-1", role: "ADMIN" as const };
    const customer = await harness.customers.create(admin, {
      email: "ada@neatly.example",
      name: "Ada",
      userId: customerUser.id,
    });
    const cleaner = await harness.cleaners.create(admin, {
      email: cleanerUser.email,
      name: "Mia Cleaner",
      userId: cleanerUser.id,
    });
    const other = await harness.cleaners.create(admin, {
      email: otherCleanerUser.email,
      name: "Lee Cleaner",
      userId: otherCleanerUser.id,
    });
    const offering = await harness.catalog.create(admin, {
      fullDescription: "Full clean",
      name: "Home Refresh",
      shortDescription: "Weekly tidy",
    });
    const own = await harness.bookings.create(admin, {
      cleanerId: cleaner.id,
      customerId: customer.id,
      scheduledAt: new Date("2026-09-04T10:00:00.000Z"),
      serviceAddress: "12 Harbour Street",
      serviceId: offering.id,
    });
    await harness.bookings.create(admin, {
      cleanerId: other.id,
      customerId: customer.id,
      scheduledAt: new Date("2026-09-05T10:00:00.000Z"),
      serviceAddress: "99 Other Lane",
      serviceId: offering.id,
    });

    const listed = await dispatchApi(
      withAuth(cleanerUser, { method: "GET", url: API_PATHS.cleanerJobs }),
    );
    const listBody = parseJsonBody(listed.body) as Envelope<{
      items: { id: string; customerName: string | null }[];
    }>;

    expect(listed.statusCode).toBe(HTTP_STATUS.OK);
    expect(listBody.data.items.map((item) => item.id)).toEqual([own.id]);
    expect(listBody.data.items[0]?.customerName).toBe("Ada");
    expect(listed.body).not.toContain("ada@neatly.example");
    expect(listed.body).not.toContain("customerId");

    const overview = await dispatchApi(
      withAuth(cleanerUser, {
        method: "GET",
        url: API_PATHS.cleanerDashboard,
      }),
    );
    const overviewBody = parseJsonBody(overview.body) as Envelope<{
      overview: { nextJob: { id: string } | null };
    }>;
    expect(overview.statusCode).toBe(HTTP_STATUS.OK);
    expect(overviewBody.data.overview.nextJob?.id).toBe(own.id);

    const detail = await dispatchApi(
      withAuth(cleanerUser, {
        method: "GET",
        url: API_PATHS.cleanerJob.replace(":id", own.id),
      }),
    );
    expect(detail.statusCode).toBe(HTTP_STATUS.OK);

    const stranger = await dispatchApi(
      withAuth(otherCleanerUser, {
        method: "GET",
        url: API_PATHS.cleanerJob.replace(":id", own.id),
      }),
    );
    expect(stranger.statusCode).toBe(HTTP_STATUS.NOT_FOUND);

    const customerDenied = await dispatchApi(
      withAuth(customerUser, { method: "GET", url: API_PATHS.cleanerJobs }),
    );
    expect(customerDenied.statusCode).toBe(HTTP_STATUS.FORBIDDEN);

    const adminDenied = await dispatchApi(
      withAuth(adminUser, { method: "GET", url: API_PATHS.cleanerDashboard }),
    );
    expect(adminDenied.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
  });

  it("starts and completes only the assigned cleaner's valid jobs", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);
    const admin = { id: "admin-1", role: "ADMIN" as const };
    const customer = await harness.customers.create(admin, {
      email: "ada@neatly.example",
      name: "Ada",
      userId: customerUser.id,
    });
    const cleaner = await harness.cleaners.create(admin, {
      email: cleanerUser.email,
      name: "Mia Cleaner",
      userId: cleanerUser.id,
    });
    const other = await harness.cleaners.create(admin, {
      email: otherCleanerUser.email,
      name: "Lee Cleaner",
      userId: otherCleanerUser.id,
    });
    const offering = await harness.catalog.create(admin, {
      fullDescription: "Full clean",
      name: "Home Refresh",
      shortDescription: "Weekly tidy",
    });
    const assigned = await harness.bookings.create(admin, {
      cleanerId: cleaner.id,
      customerId: customer.id,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      serviceId: offering.id,
    });
    const cancelled = await harness.bookings.create(admin, {
      cleanerId: cleaner.id,
      customerId: customer.id,
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      serviceId: offering.id,
    });
    await harness.bookings.cancel(admin, cancelled.id);

    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);
    const guest = await dispatchApi({
      method: "POST",
      url: API_PATHS.cleanerJobStart.replace(":id", assigned.id),
    });
    expect(guest.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    const customerDenied = await dispatchApi(
      withAuth(customerUser, {
        method: "POST",
        url: API_PATHS.cleanerJobStart.replace(":id", assigned.id),
      }),
    );
    expect(customerDenied.statusCode).toBe(HTTP_STATUS.FORBIDDEN);

    const stranger = await dispatchApi(
      withAuth(otherCleanerUser, {
        method: "POST",
        url: API_PATHS.cleanerJobStart.replace(":id", assigned.id),
      }),
    );
    expect(stranger.statusCode).toBe(HTTP_STATUS.NOT_FOUND);

    const invalidComplete = await dispatchApi(
      withAuth(cleanerUser, {
        method: "POST",
        url: API_PATHS.cleanerJobComplete.replace(":id", assigned.id),
      }),
    );
    expect(invalidComplete.statusCode).toBe(HTTP_STATUS.CONFLICT);

    const cancelledStart = await dispatchApi(
      withAuth(cleanerUser, {
        method: "POST",
        url: API_PATHS.cleanerJobStart.replace(":id", cancelled.id),
      }),
    );
    expect(cancelledStart.statusCode).toBe(HTTP_STATUS.CONFLICT);

    const started = await dispatchApi(
      withAuth(cleanerUser, {
        method: "POST",
        url: API_PATHS.cleanerJobStart.replace(":id", assigned.id),
      }),
    );
    const startedBody = parseJsonBody(started.body) as Envelope<{
      job: {
        actions: { canComplete: boolean; canStart: boolean };
        status: string;
      };
    }>;
    expect(started.statusCode).toBe(HTTP_STATUS.OK);
    expect(startedBody.data.job.status).toBe("IN_PROGRESS");
    expect(startedBody.data.job.actions.canStart).toBe(false);
    expect(startedBody.data.job.actions.canComplete).toBe(true);

    const completed = await dispatchApi(
      withAuth(cleanerUser, {
        method: "POST",
        url: API_PATHS.cleanerJobComplete.replace(":id", assigned.id),
      }),
    );
    const completedBody = parseJsonBody(completed.body) as Envelope<{
      job: { status: string };
    }>;
    expect(completed.statusCode).toBe(HTTP_STATUS.OK);
    expect(completedBody.data.job.status).toBe("COMPLETED");

    const again = await dispatchApi(
      withAuth(cleanerUser, {
        method: "POST",
        url: API_PATHS.cleanerJobComplete.replace(":id", assigned.id),
      }),
    );
    expect(again.statusCode).toBe(HTTP_STATUS.CONFLICT);
    expect(other.id).not.toBe(cleaner.id);
  });

  it("returns a date-scoped schedule for the session cleaner only", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);
    const admin = { id: "admin-1", role: "ADMIN" as const };
    const customer = await harness.customers.create(admin, {
      email: "ada@neatly.example",
      name: "Ada",
      userId: customerUser.id,
    });
    const cleaner = await harness.cleaners.create(admin, {
      email: cleanerUser.email,
      name: "Mia Cleaner",
      userId: cleanerUser.id,
    });
    const other = await harness.cleaners.create(admin, {
      email: otherCleanerUser.email,
      name: "Lee Cleaner",
      userId: otherCleanerUser.id,
    });
    const offering = await harness.catalog.create(admin, {
      fullDescription: "Full clean",
      name: "Home Refresh",
      shortDescription: "Weekly tidy",
    });
    const scheduledAt = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
    const date = scheduledAt.toISOString().slice(0, 10);
    const own = await harness.bookings.create(admin, {
      cleanerId: cleaner.id,
      customerId: customer.id,
      scheduledAt,
      serviceId: offering.id,
    });
    await harness.bookings.create(admin, {
      cleanerId: other.id,
      customerId: customer.id,
      scheduledAt: new Date(scheduledAt.getTime() + 60 * 60 * 1000),
      serviceId: offering.id,
    });

    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);
    const unauthenticated = await dispatchApi({
      method: "GET",
      url: `${API_PATHS.cleanerSchedule}?date=${date}`,
    });
    expect(unauthenticated.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    const listed = await dispatchApi(
      withAuth(cleanerUser, {
        method: "GET",
        url: `${API_PATHS.cleanerSchedule}?date=${date}`,
      }),
    );
    const body = parseJsonBody(listed.body) as Envelope<{
      schedule: { date: string; jobs: { id: string }[] };
    }>;
    expect(listed.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.data.schedule.date).toBe(date);
    expect(body.data.schedule.jobs.map((job) => job.id)).toEqual([own.id]);
    expect(listed.body).not.toContain("ada@neatly.example");
  });
});
