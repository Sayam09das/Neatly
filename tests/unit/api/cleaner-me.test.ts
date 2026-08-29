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
  user: typeof cleanerUser | typeof adminUser | typeof customerUser,
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

describe("Cleaner session API", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("returns the linked active cleaner and hides userId", async (): Promise<void> => {
    const harness = createDomainHarness();
    mockedDomain.mockReturnValue(harness as never);
    await harness.cleaners.create(
      { id: "admin-1", role: "ADMIN" },
      {
        email: "mia@neatly.example",
        name: "Mia Cleaner",
        userId: cleanerUser.id,
      },
    );

    const response = await dispatchApi(
      withAuth(cleanerUser, { method: "GET", url: API_PATHS.cleanerMe }),
    );
    const body = parseJsonBody(response.body) as Envelope<{
      profile: { id: string; name: string };
    }>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.success).toBe(true);
    expect(body.data.profile.name).toBe("Mia Cleaner");
    expect(response.body).not.toContain("userId");
  });

  it("rejects unauthenticated, customer, and admin operator access", async (): Promise<void> => {
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);
    const unauthenticated = await dispatchApi({
      method: "GET",
      url: API_PATHS.cleanerMe,
    });
    expect(unauthenticated.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);

    const customer = await dispatchApi(
      withAuth(customerUser, { method: "GET", url: API_PATHS.cleanerMe }),
    );
    expect(customer.statusCode).toBe(HTTP_STATUS.FORBIDDEN);

    const admin = await dispatchApi(
      withAuth(adminUser, { method: "GET", url: API_PATHS.cleanerMe }),
    );
    expect(admin.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
  });
});
