import { beforeEach, describe, expect, it, vi } from "vitest";
import { HTTP_STATUS } from "../../../apps/server/src/config/constants.ts";
import { API_PATHS } from "../../../apps/server/src/contracts/v1.ts";
import { getAuthService } from "../../../apps/server/src/lib/auth/runtime.ts";
import { getDomainServices } from "../../../apps/server/src/lib/domain/runtime.ts";
import { CLEANER_WEEKDAYS } from "../../../apps/server/src/services/cleaners/cleaner.types.ts";
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
  user: typeof cleanerUser | typeof otherCleanerUser | typeof customerUser,
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

function emptyWeek(): {
  available: boolean;
  day: (typeof CLEANER_WEEKDAYS)[number];
  end: string | null;
  start: string | null;
}[] {
  return CLEANER_WEEKDAYS.map((day) => ({
    available: false,
    day,
    end: null,
    start: null,
  }));
}

describe("Cleaner availability API", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("reads and updates only the session cleaner's availability", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);
    const admin = { id: "admin-1", role: "ADMIN" as const };
    await harness.cleaners.create(admin, {
      email: cleanerUser.email,
      name: "Mia Cleaner",
      userId: cleanerUser.id,
    });
    await harness.cleaners.create(admin, {
      email: otherCleanerUser.email,
      name: "Lee Cleaner",
      userId: otherCleanerUser.id,
    });

    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);
    const guest = await dispatchApi({
      method: "GET",
      url: API_PATHS.cleanerAvailability,
    });
    expect(guest.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    const customerDenied = await dispatchApi(
      withAuth(customerUser, {
        method: "GET",
        url: API_PATHS.cleanerAvailability,
      }),
    );
    expect(customerDenied.statusCode).toBe(HTTP_STATUS.FORBIDDEN);

    const loaded = await dispatchApi(
      withAuth(cleanerUser, {
        method: "GET",
        url: `${API_PATHS.cleanerAvailability}?cleanerId=other`,
      }),
    );
    const loadedBody = parseJsonBody(loaded.body) as Envelope<{
      availability: { week: { available: boolean }[] };
    }>;
    expect(loaded.statusCode).toBe(HTTP_STATUS.OK);
    expect(
      loadedBody.data.availability.week.every((day) => !day.available),
    ).toBe(true);

    const invalid = await dispatchApi(
      withAuth(cleanerUser, {
        body: JSON.stringify({
          week: emptyWeek().map((day) =>
            day.day === "monday"
              ? { ...day, available: true, end: "09:00", start: "17:00" }
              : day,
          ),
        }),
        method: "PATCH",
        url: API_PATHS.cleanerAvailability,
      }),
    );
    expect(invalid.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);

    const saved = await dispatchApi(
      withAuth(cleanerUser, {
        body: JSON.stringify({
          week: emptyWeek().map((day) =>
            day.day === "monday"
              ? { ...day, available: true, end: "17:00", start: "09:00" }
              : day,
          ),
        }),
        method: "PATCH",
        url: API_PATHS.cleanerAvailability,
      }),
    );
    const savedBody = parseJsonBody(saved.body) as Envelope<{
      availability: { week: { available: boolean; day: string }[] };
    }>;
    expect(saved.statusCode).toBe(HTTP_STATUS.OK);
    expect(
      savedBody.data.availability.week.find((day) => day.day === "monday")
        ?.available,
    ).toBe(true);

    const other = await dispatchApi(
      withAuth(otherCleanerUser, {
        method: "GET",
        url: API_PATHS.cleanerAvailability,
      }),
    );
    const otherBody = parseJsonBody(other.body) as Envelope<{
      availability: { week: { available: boolean; day: string }[] };
    }>;
    expect(other.statusCode).toBe(HTTP_STATUS.OK);
    expect(
      otherBody.data.availability.week.find((day) => day.day === "monday")
        ?.available,
    ).toBe(false);
  });
});
