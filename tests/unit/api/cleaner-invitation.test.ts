import { beforeEach, describe, expect, it, vi } from "vitest";
import { HTTP_STATUS } from "../../../apps/server/src/config/constants.ts";
import { API_PATHS } from "../../../apps/server/src/contracts/v1.ts";
import { getAuthService } from "../../../apps/server/src/lib/auth/runtime.ts";
import { getDomainServices } from "../../../apps/server/src/lib/domain/runtime.ts";
import {
  createDomainHarness,
  InMemoryCleanerInvitationGateway,
} from "../domain/in-memory-domain.ts";
import { dispatchApi, parseJsonBody } from "./http-harness";

vi.mock("../../../apps/server/src/lib/auth/runtime.ts", () => ({
  getAuthService: vi.fn(),
}));

vi.mock("../../../apps/server/src/lib/domain/runtime.ts", () => ({
  getDomainServices: vi.fn(),
}));

const mockedAuth = vi.mocked(getAuthService);
const mockedDomain = vi.mocked(getDomainServices);

const adminUser = {
  email: "admin@neatly.example",
  id: "cladmin000000000000000001",
  lastLoginAt: null,
  name: "Neatly Admin",
  role: "ADMIN" as const,
  status: "ACTIVE" as const,
};

const cleanerUser = {
  email: "mia@neatly.example",
  id: "cleaner-a",
  lastLoginAt: null,
  name: "Mia",
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

describe("Cleaner invitation APIs", (): void => {
  beforeEach((): void => {
    mockedAuth.mockReset();
    mockedDomain.mockReset();
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(adminUser),
    } as never);
    mockedDomain.mockReturnValue(createDomainHarness() as never);
  });

  it("lets an admin create a cleaner invitation and blocks non-admins", async (): Promise<void> => {
    const created = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          email: "mia@neatly.example",
          name: "Mia Cleaner",
          phone: "555-0100",
        }),
        method: "POST",
        url: API_PATHS.adminCleaners,
      }),
    );
    const createdBody = parseJsonBody(created.body) as Envelope<{
      cleaner: { accountState: string; email: string; status: string };
      invitationSent: boolean;
    }>;
    expect(created.statusCode).toBe(HTTP_STATUS.CREATED);
    expect(createdBody.data.cleaner.email).toBe("mia@neatly.example");
    expect(createdBody.data.cleaner.accountState).toBe("INVITED");
    expect(createdBody.data.invitationSent).toBe(true);
    expect(JSON.stringify(createdBody.data)).not.toContain("password");
    expect(JSON.stringify(createdBody.data)).not.toContain("tokenHash");

    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(cleanerUser),
    } as never);
    const forbidden = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          email: "other@neatly.example",
          name: "Other",
          phone: "555-0101",
        }),
        method: "POST",
        url: API_PATHS.adminCleaners,
      }),
    );
    expect(forbidden.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
  });

  it("inspects and activates a public invitation without trusting cleanerId", async (): Promise<void> => {
    const invitations = new InMemoryCleanerInvitationGateway();
    const harness = createDomainHarness(undefined, invitations);
    mockedDomain.mockReturnValue(harness as never);
    mockedAuth.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(adminUser),
    } as never);

    const created = await dispatchApi(
      withAuth({
        body: JSON.stringify({
          email: "mia@neatly.example",
          name: "Mia Cleaner",
          phone: "555-0100",
        }),
        method: "POST",
        url: API_PATHS.adminCleaners,
      }),
    );
    expect(created.statusCode).toBe(HTTP_STATUS.CREATED);

    const token = [...invitations.tokens.keys()][0] ?? "";
    const inspect = await dispatchApi({
      method: "GET",
      url: `${API_PATHS.cleanerActivate}?token=${token}`,
    });
    const inspectBody = parseJsonBody(inspect.body) as Envelope<{
      invitation: { email?: string; status: string };
    }>;
    expect(inspect.statusCode).toBe(HTTP_STATUS.OK);
    expect(inspectBody.data.invitation.status).toBe("valid");
    expect(inspectBody.data.invitation.email).toBe("mia@neatly.example");

    const activated = await dispatchApi({
      body: JSON.stringify({
        password: "correct-horse-battery-staple",
        token,
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.cleanerActivate,
    });
    const activatedBody = parseJsonBody(activated.body) as Envelope<{
      sessionToken: string;
      user: { status: string };
    }>;
    expect(activated.statusCode).toBe(HTTP_STATUS.OK);
    expect(activatedBody.data.user.status).toBe("ACTIVE");
    expect(activatedBody.data.sessionToken).toBeTruthy();

    const reused = await dispatchApi({
      body: JSON.stringify({
        password: "correct-horse-battery-staple",
        token,
      }),
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.cleanerActivate,
    });
    expect(reused.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
  });
});
