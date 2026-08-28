import type { IncomingMessage, ServerResponse } from "node:http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  API_DEFAULT_PORT,
  API_ERROR_CODES,
  API_SERVICE_NAME,
  DATABASE_HEALTH_STATUS,
  HTTP_STATUS,
} from "../../../apps/server/src/config/constants.ts";
import {
  loadApiEnv,
  loadAuthEnv,
} from "../../../apps/server/src/config/env.ts";
import { checkDatabaseConnection } from "../../../apps/server/src/lib/database-health.ts";
import { matchRoute } from "../../../apps/server/src/routes/index.ts";

vi.mock("../../../apps/server/src/lib/database-health.ts", () => ({
  checkDatabaseConnection: vi.fn(),
}));

const pingDatabase = vi.mocked(checkDatabaseConnection);

function createMockRequest(method = "GET", url = "/"): IncomingMessage {
  return {
    headers: {},
    method,
    url,
  } as unknown as IncomingMessage;
}

function createMockResponse(): {
  body: string;
  getHeader: (name: string) => string | undefined;
  res: ServerResponse;
  statusCode: number;
} {
  const headers: Record<string, string> = {};
  let statusCode = 200;
  let body = "";

  const res = {
    end(data?: string): void {
      if (data !== undefined) {
        body = data;
      }
    },
    getHeader(name: string): string | undefined {
      return headers[name.toLowerCase()];
    },
    setHeader(name: string, value: string): void {
      headers[name.toLowerCase()] = value;
    },
    get statusCode(): number {
      return statusCode;
    },
    set statusCode(code: number) {
      statusCode = code;
    },
  } as unknown as ServerResponse;

  return {
    get body(): string {
      return body;
    },
    getHeader(name: string): string | undefined {
      return headers[name.toLowerCase()];
    },
    res,
    get statusCode(): number {
      return statusCode;
    },
  };
}

describe("GET /", (): void => {
  it("returns a root status payload for GET /", async (): Promise<void> => {
    const req = createMockRequest("GET", "/");
    const mockRes = createMockResponse();

    const handler = matchRoute(req);
    await handler(req, mockRes.res);

    const body = JSON.parse(mockRes.body) as {
      data: { name: string; service: string; status: string };
      error: null;
      success: boolean;
    };

    expect(mockRes.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.success).toBe(true);
    expect(body.error).toBeNull();
    expect(body.data.service).toBe(API_SERVICE_NAME);
    expect(body.data.status).toBe("ok");
  });
});

describe("GET /health", (): void => {
  beforeEach((): void => {
    pingDatabase.mockReset();
  });

  it("returns a connected payload when the database responds", async (): Promise<void> => {
    pingDatabase.mockResolvedValue(true);

    const req = createMockRequest("GET", "/health");
    const mockRes = createMockResponse();

    const handler = matchRoute(req);
    await handler(req, mockRes.res);

    const body = JSON.parse(mockRes.body) as {
      data: { database: string; service: string; status: string };
      error: null;
      success: boolean;
    };

    expect(mockRes.statusCode).toBe(HTTP_STATUS.OK);
    expect(mockRes.getHeader("content-type")).toContain("application/json");
    expect(body.success).toBe(true);
    expect(body.error).toBeNull();
    expect(body.data).toEqual({
      database: DATABASE_HEALTH_STATUS.CONNECTED,
      service: API_SERVICE_NAME,
      status: "ok",
    });
  });

  it("returns an unavailable envelope without internal details when the database is down", async (): Promise<void> => {
    pingDatabase.mockResolvedValue(false);

    const req = createMockRequest("GET", "/health");
    const mockRes = createMockResponse();

    const handler = matchRoute(req);
    await handler(req, mockRes.res);

    const body = JSON.parse(mockRes.body) as {
      data: null;
      error: { code: string; message: string };
      success: boolean;
    };

    expect(mockRes.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect(body.success).toBe(false);
    expect(body.data).toBeNull();
    expect(body.error.code).toBe(API_ERROR_CODES.DATABASE_UNAVAILABLE);
    expect(body.error.message).toBe("The database is unavailable.");
    expect(body.error.message.toLowerCase()).not.toContain("postgres");
    expect(body.error.message.toLowerCase()).not.toContain("database_url");
  });

  it("returns a consistent not-found envelope for unknown routes", (): void => {
    const req = createMockRequest("GET", "/does-not-exist");

    expect((): void => {
      matchRoute(req);
    }).toThrow();
  });

  it("rejects unsupported methods on /health", (): void => {
    const req = createMockRequest("POST", "/health");

    expect((): void => {
      matchRoute(req);
    }).toThrow();
  });

  it("registers backend-owned authentication routes", (): void => {
    expect(matchRoute(createMockRequest("POST", "/auth/login"))).toBeTypeOf(
      "function",
    );
    expect(matchRoute(createMockRequest("POST", "/auth/logout"))).toBeTypeOf(
      "function",
    );
    expect(matchRoute(createMockRequest("GET", "/auth/session"))).toBeTypeOf(
      "function",
    );
    expect(matchRoute(createMockRequest("POST", "/auth/register"))).toBeTypeOf(
      "function",
    );
    expect(
      matchRoute(createMockRequest("POST", "/auth/forgot-password")),
    ).toBeTypeOf("function");
    expect(
      matchRoute(createMockRequest("POST", "/auth/reset-password")),
    ).toBeTypeOf("function");
    expect(
      matchRoute(createMockRequest("POST", "/auth/verify-email")),
    ).toBeTypeOf("function");
    expect(
      matchRoute(createMockRequest("POST", "/auth/resend-verification")),
    ).toBeTypeOf("function");
  });
});

describe("loadApiEnv", (): void => {
  it("defaults host and port without requiring database secrets", (): void => {
    const env = loadApiEnv({});

    expect(env.port).toBe(API_DEFAULT_PORT);
    expect(env.host).toBe("0.0.0.0");
    expect(env.nodeEnv).toBe("development");
  });

  it("rejects an invalid PORT without echoing secrets", (): void => {
    expect((): void => {
      loadApiEnv({ PORT: "not-a-port" });
    }).toThrow(/PORT is invalid/);
  });
});

describe("loadAuthEnv", (): void => {
  it("loads a valid session secret and site URL", (): void => {
    const secret = "local-development-session-secret-value";
    const env = loadAuthEnv({
      SESSION_SECRET: secret,
      SITE_URL: "https://neatly.example/admin",
    });

    expect(env.sessionSecret).toBe(secret);
    expect(env.siteUrl).toBe("https://neatly.example");
    expect(env.smtp).toBeNull();
  });

  it("rejects a short SESSION_SECRET without echoing the value", (): void => {
    const shortSecret = "too-short";

    expect((): void => {
      loadAuthEnv({
        SESSION_SECRET: shortSecret,
        SITE_URL: "https://neatly.example",
      });
    }).toThrow(/SESSION_SECRET is invalid/);

    try {
      loadAuthEnv({
        SESSION_SECRET: shortSecret,
        SITE_URL: "https://neatly.example",
      });
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      if (!(error instanceof Error)) {
        return;
      }
      expect(error.message).not.toContain(shortSecret);
    }
  });
});
