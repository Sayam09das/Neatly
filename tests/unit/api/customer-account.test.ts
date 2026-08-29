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
const changeOwnPassword = vi.fn().mockResolvedValue(undefined);

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

describe("Customer profile and account APIs", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    changeOwnPassword.mockClear();
    mockedAuth.mockReturnValue({
      changeOwnPassword,
      getAccountSecurity: vi.fn().mockResolvedValue({
        email: sessionUser.email,
        emailVerified: true,
        sessions: [
          {
            createdAt: "2026-08-29T10:00:00.000Z",
            current: true,
            expiresAt: "2026-09-05T10:00:00.000Z",
            id: "session-current",
          },
        ],
        status: "ACTIVE",
      }),
      logoutAllOwnSessions: vi.fn().mockResolvedValue(undefined),
      requestOwnEmailVerification: vi.fn().mockResolvedValue({
        message:
          "If an account exists for this email, instructions have been sent.",
      }),
      resolveSession: vi.fn().mockResolvedValue(sessionUser),
      revokeOwnSession: vi.fn().mockResolvedValue(undefined),
    } as never);
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("returns and updates only session-owned profile fields", async (): Promise<void> => {
    const harness = createDomainHarness();
    const now = new Date();
    harness.store.users.set(sessionUser.id, {
      createdAt: now,
      email: sessionUser.email,
      emailVerifiedAt: now,
      id: sessionUser.id,
      lastLoginAt: null,
      name: sessionUser.name,
      role: "STAFF",
      status: "ACTIVE",
      updatedAt: now,
    });
    mockedDomain.mockReturnValue(harness as never);

    const get = await dispatchApi(
      withAuth({ method: "GET", url: API_PATHS.customerMe }),
    );
    const getBody = parseJsonBody(get.body) as Envelope<{
      profile: { email: string; name: string };
    }>;
    expect(get.statusCode).toBe(HTTP_STATUS.OK);
    expect(getBody.data.profile.email).toBe(sessionUser.email);
    expect(get.body).not.toContain("userId");
    expect(get.body).not.toContain("passwordHash");

    const rejected = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          customerId: "other",
          email: "hijack@neatly.example",
          name: "Ada King",
          role: "ADMIN",
          status: "INACTIVE",
        }),
        method: "PATCH",
        url: API_PATHS.customerMe,
      }),
    );
    expect(rejected.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);

    const updated = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          name: "Ada King",
          phone: "5551234567",
        }),
        method: "PATCH",
        url: API_PATHS.customerMe,
      }),
    );
    const updatedBody = parseJsonBody(updated.body) as Envelope<{
      profile: { name: string; phone: string | null };
    }>;
    expect(updated.statusCode).toBe(HTTP_STATUS.OK);
    expect(updatedBody.data.profile.name).toBe("Ada King");
    expect(updatedBody.data.profile.phone).toBe("5551234567");
  });

  it("keeps password and session mutations on the authenticated user", async (): Promise<void> => {
    const account = await dispatchApi(
      withAuth({ method: "GET", url: API_PATHS.customerAccount }),
    );
    const accountBody = parseJsonBody(account.body) as Envelope<{
      account: { email: string; sessions: Array<{ id: string }> };
    }>;
    expect(account.statusCode).toBe(HTTP_STATUS.OK);
    expect(accountBody.data.account.email).toBe(sessionUser.email);
    expect(account.body).not.toContain("tokenHash");
    expect(account.body).not.toContain("session-token-value");

    const password = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          currentPassword: "current-password-12",
          password: "replacement-password-12",
        }),
        method: "POST",
        url: API_PATHS.customerAccountPassword,
      }),
    );
    expect(password.statusCode).toBe(HTTP_STATUS.OK);
    expect(changeOwnPassword).toHaveBeenCalledWith(
      sessionUser.id,
      "session-token-value",
      {
        currentPassword: "current-password-12",
        password: "replacement-password-12",
      },
      expect.objectContaining({ ip: expect.any(String) }),
    );
  });
});
