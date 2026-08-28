import type { IncomingMessage, ServerResponse } from "node:http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  API_ERROR_CODES,
  API_REQUEST_ID_HEADER,
  HTTP_STATUS,
} from "../../../apps/server/src/config/constants.ts";
import { API_PATHS } from "../../../apps/server/src/contracts/v1.ts";
import { requireOwnership } from "../../../apps/server/src/lib/auth/authorization.ts";
import { getAuthService } from "../../../apps/server/src/lib/auth/runtime.ts";
import { AppError } from "../../../apps/server/src/lib/errors.ts";
import { createRequestContext } from "../../../apps/server/src/lib/request-context.ts";
import { requireRole } from "../../../apps/server/src/middleware/auth.ts";
import { dispatchApi, parseJsonBody } from "./http-harness";

vi.mock("../../../apps/server/src/lib/auth/runtime.ts", () => ({
  getAuthService: vi.fn(),
}));

const authService = vi.mocked(getAuthService);

interface Envelope<T> {
  data: T;
  error: { code: string; message: string; requestId?: string } | null;
  success: boolean;
}

const adminUser = {
  email: "admin@neatly.example",
  id: "user_1",
  lastLoginAt: null,
  name: "Neatly Admin",
  role: "ADMIN" as const,
  status: "ACTIVE" as const,
};

describe("API foundation", (): void => {
  beforeEach((): void => {
    authService.mockReset();
    vi.unstubAllEnvs();
  });

  it("echoes a trusted request ID and generates one otherwise", async (): Promise<void> => {
    const trusted = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
    const withHeader = await dispatchApi({
      headers: { [API_REQUEST_ID_HEADER]: trusted },
      method: "GET",
      url: API_PATHS.health,
    });
    const generated = await dispatchApi({
      headers: { [API_REQUEST_ID_HEADER]: "not-a-uuid" },
      method: "GET",
      url: API_PATHS.health,
    });

    expect(withHeader.headers[API_REQUEST_ID_HEADER]).toBe(trusted);
    expect(generated.headers[API_REQUEST_ID_HEADER]).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(generated.headers[API_REQUEST_ID_HEADER]).not.toBe("not-a-uuid");
  });

  it("returns the v1 namespace without inventing business endpoints", async (): Promise<void> => {
    const response = await dispatchApi({ method: "GET", url: API_PATHS.v1 });
    const body = parseJsonBody(response.body) as Envelope<{
      admin: string;
      auth: string;
      version: string;
    }>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.success).toBe(true);
    expect(body.data).toEqual({
      admin: API_PATHS.admin,
      auth: `${API_PATHS.v1}/auth`,
      version: "v1",
    });
  });

  it("rejects non-JSON bodies on JSON endpoints", async (): Promise<void> => {
    const response = await dispatchApi({
      body: "email=admin",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      method: "POST",
      url: API_PATHS.authLogin,
    });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(response.statusCode).toBe(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe(API_ERROR_CODES.UNSUPPORTED_MEDIA_TYPE);
    expect(body.error?.requestId).toBeDefined();
  });

  it("requires authentication for the admin namespace", async (): Promise<void> => {
    authService.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(null),
    } as never);

    const response = await dispatchApi({
      method: "GET",
      url: API_PATHS.admin,
    });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(response.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(body.error?.code).toBe(API_ERROR_CODES.UNAUTHORIZED);
  });

  it("allows an authenticated admin into the admin namespace", async (): Promise<void> => {
    authService.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue(adminUser),
    } as never);

    const response = await dispatchApi({
      headers: { "x-session-token": "session-token-value" },
      method: "GET",
      url: API_PATHS.admin,
    });
    const body = parseJsonBody(response.body) as Envelope<{
      namespace: string;
      status: string;
    }>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.success).toBe(true);
    expect(body.data.namespace).toBe("admin");
    expect(body.data.status).toBe("ok");
  });

  it("forbids authenticated users without an admin role", async (): Promise<void> => {
    authService.mockReturnValue({
      resolveSession: vi.fn().mockResolvedValue({
        ...adminUser,
        role: "CUSTOMER",
      }),
    } as never);

    const response = await dispatchApi({
      headers: { "x-session-token": "session-token-value" },
      method: "GET",
      url: API_PATHS.admin,
    });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(response.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
    expect(body.error?.code).toBe(API_ERROR_CODES.FORBIDDEN);
  });

  it("allows a configured frontend origin and rejects others", async (): Promise<void> => {
    vi.stubEnv("CORS_ORIGIN", "https://neatly.example");

    const allowed = await dispatchApi({
      headers: { origin: "https://neatly.example" },
      method: "OPTIONS",
      url: API_PATHS.v1,
    });
    const rejected = await dispatchApi({
      headers: { origin: "https://evil.example" },
      method: "GET",
      url: API_PATHS.health,
    });
    const rejectedBody = parseJsonBody(rejected.body) as Envelope<null>;

    expect(allowed.statusCode).toBe(HTTP_STATUS.NO_CONTENT);
    expect(allowed.headers["access-control-allow-origin"]).toBe(
      "https://neatly.example",
    );
    expect(allowed.headers["access-control-allow-credentials"]).toBe("true");
    expect(rejected.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
    expect(rejectedBody.error?.code).toBe(API_ERROR_CODES.FORBIDDEN);
  });

  it("requireRole allows matching roles and rejects others", (): void => {
    const context = createRequestContext({
      ip: "127.0.0.1",
      method: "GET",
      path: API_PATHS.admin,
    });
    const req = {} as IncomingMessage;
    const res = {} as ServerResponse;
    const requireAdminRole = requireRole("ADMIN");

    context.user = adminUser;
    expect((): void => {
      requireAdminRole(req, res, context);
    }).not.toThrow();

    context.user = { ...adminUser, role: "STAFF" };
    try {
      requireAdminRole(req, res, context);
      throw new Error("expected requireRole to reject STAFF");
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe(API_ERROR_CODES.FORBIDDEN);
      expect((error as AppError).statusCode).toBe(HTTP_STATUS.FORBIDDEN);
    }
  });

  it("requireOwnership compares the authenticated user id", (): void => {
    expect(requireOwnership(adminUser, "user_1")).toEqual(adminUser);
    expect((): void => {
      requireOwnership(adminUser, "user_other");
    }).toThrow();
  });
});
