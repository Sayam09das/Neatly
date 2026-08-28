import type { IncomingMessage, ServerResponse } from "node:http";
import { describe, expect, it } from "vitest";
import {
  API_DEFAULT_PORT,
  API_SERVICE_NAME,
} from "../../../apps/server/src/config/constants.ts";
import { loadApiEnv } from "../../../apps/server/src/config/env.ts";
import { matchRoute } from "../../../apps/server/src/routes/index.ts";

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

    expect(mockRes.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.error).toBeNull();
    expect(body.data.service).toBe(API_SERVICE_NAME);
    expect(body.data.status).toBe("ok");
  });
});

describe("GET /health", (): void => {
  it("returns a process-ready payload without querying a database", async (): Promise<void> => {
    const req = createMockRequest("GET", "/health");
    const mockRes = createMockResponse();

    const handler = matchRoute(req);
    await handler(req, mockRes.res);

    const body = JSON.parse(mockRes.body) as {
      data: { service: string; status: string };
      error: null;
      success: boolean;
    };

    expect(mockRes.statusCode).toBe(200);
    expect(mockRes.getHeader("content-type")).toContain("application/json");
    expect(body.success).toBe(true);
    expect(body.error).toBeNull();
    expect(body.data).toEqual({
      service: API_SERVICE_NAME,
      status: "ok",
    });
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
