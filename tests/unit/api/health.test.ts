import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  API_DEFAULT_PORT,
  API_ERROR_CODES,
  API_SERVICE_NAME,
  DATABASE_HEALTH_STATUS,
  HTTP_STATUS,
} from "../../../apps/server/src/config/constants.ts";
import {
  assertProductionConfig,
  loadApiEnv,
  loadAuthEnv,
  loadStorageEnv,
} from "../../../apps/server/src/config/env.ts";
import { API_PATHS } from "../../../apps/server/src/contracts/v1.ts";
import { checkDatabaseConnection } from "../../../apps/server/src/lib/database-health.ts";
import { dispatchApi, parseJsonBody } from "./http-harness";

vi.mock("../../../apps/server/src/lib/database-health.ts", () => ({
  checkDatabaseConnection: vi.fn(),
}));

const pingDatabase = vi.mocked(checkDatabaseConnection);

interface Envelope<T> {
  data: T;
  error: { code: string; message: string; requestId?: string } | null;
  success: boolean;
}

describe("GET /", (): void => {
  it("returns a root status payload for GET /", async (): Promise<void> => {
    const response = await dispatchApi({ method: "GET", url: "/" });
    const body = parseJsonBody(response.body) as Envelope<{
      name: string;
      service: string;
      status: string;
    }>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(body.success).toBe(true);
    expect(body.error).toBeNull();
    expect(body.data.service).toBe(API_SERVICE_NAME);
    expect(body.data.status).toBe("ok");
  });
});

describe("GET /health", (): void => {
  it("returns liveness without querying the database", async (): Promise<void> => {
    const response = await dispatchApi({
      method: "GET",
      url: API_PATHS.health,
    });
    const body = parseJsonBody(response.body) as Envelope<{
      service: string;
      status: string;
    }>;

    expect(pingDatabase).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(HTTP_STATUS.OK);
    expect(response.headers["content-type"]).toContain("application/json");
    expect(response.headers["x-request-id"]).toMatch(/^[0-9a-f-]{36}$/i);
    expect(body.success).toBe(true);
    expect(body.data).toEqual({
      service: API_SERVICE_NAME,
      status: "ok",
    });
  });
});

describe("GET /ready", (): void => {
  beforeEach((): void => {
    pingDatabase.mockReset();
  });

  it("returns a connected payload when the database responds", async (): Promise<void> => {
    pingDatabase.mockResolvedValue(true);

    const response = await dispatchApi({ method: "GET", url: API_PATHS.ready });
    const body = parseJsonBody(response.body) as Envelope<{
      database: string;
      service: string;
      status: string;
    }>;

    expect(response.statusCode).toBe(HTTP_STATUS.OK);
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

    const response = await dispatchApi({ method: "GET", url: API_PATHS.ready });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(response.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect(body.success).toBe(false);
    expect(body.data).toBeNull();
    expect(body.error?.code).toBe(API_ERROR_CODES.DATABASE_UNAVAILABLE);
    expect(body.error?.message).toBe("The database is unavailable.");
    expect(body.error?.message.toLowerCase()).not.toContain("postgres");
    expect(body.error?.message.toLowerCase()).not.toContain("database_url");
  });
});

describe("routing", (): void => {
  it("returns a consistent not-found envelope for unknown routes", async (): Promise<void> => {
    const response = await dispatchApi({
      method: "GET",
      url: "/does-not-exist",
    });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(response.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe(API_ERROR_CODES.ROUTE_NOT_FOUND);
    expect(body.error?.requestId).toBe(response.headers["x-request-id"]);
  });

  it("rejects unsupported methods on /health", async (): Promise<void> => {
    const response = await dispatchApi({
      method: "POST",
      url: API_PATHS.health,
    });
    const body = parseJsonBody(response.body) as Envelope<null>;

    expect(response.statusCode).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
    expect(body.error?.code).toBe(API_ERROR_CODES.METHOD_NOT_ALLOWED);
  });

  it("registers versioned authentication routes", async (): Promise<void> => {
    const login = await dispatchApi({
      headers: { "content-type": "application/json" },
      method: "POST",
      url: API_PATHS.authLogin,
    });

    expect(login.statusCode).not.toBe(HTTP_STATUS.NOT_FOUND);
    expect(login.statusCode).not.toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
  });
});

describe("loadApiEnv", (): void => {
  it("defaults host and port without requiring database secrets", (): void => {
    const env = loadApiEnv({});

    expect(env.port).toBe(API_DEFAULT_PORT);
    expect(env.host).toBe("0.0.0.0");
    expect(env.nodeEnv).toBe("development");
    expect(env.corsOrigin).toBeNull();
  });

  it("rejects an invalid PORT without echoing secrets", (): void => {
    expect((): void => {
      loadApiEnv({ PORT: "not-a-port" });
    }).toThrow(/PORT is invalid/);
  });
});

describe("loadStorageEnv", (): void => {
  it("defaults the service thumbnail bucket to Services_Thumb", (): void => {
    const env = loadStorageEnv({
      SUPABASE_SECRET_KEY: "service-role-test-key",
      SUPABASE_URL: "https://example.supabase.co",
    });

    expect(env).toEqual({
      serviceRoleKey: "service-role-test-key",
      servicesThumbBucket: "Services_Thumb",
      supabaseUrl: "https://example.supabase.co",
    });
  });

  it("returns null when Supabase credentials are missing", (): void => {
    expect(loadStorageEnv({})).toBeNull();
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
    expect(env.email).toBeNull();
  });

  it("loads SMTP settings when every mail variable is present", (): void => {
    const env = loadAuthEnv({
      SESSION_SECRET: "local-development-session-secret-value",
      SITE_URL: "https://neatly.example",
      SMTP_FROM_EMAIL: "hello@neatly.example",
      SMTP_FROM_NAME: "Neatly",
      SMTP_HOST: "smtp-relay.brevo.com",
      SMTP_PASSWORD: "xsmtpsib-test-password",
      SMTP_PORT: "587",
      SMTP_USER: "hello@neatly.example",
    });

    expect(env.email).toEqual({
      fromEmail: "hello@neatly.example",
      fromName: "Neatly",
      host: "smtp-relay.brevo.com",
      password: "xsmtpsib-test-password",
      port: 587,
      user: "hello@neatly.example",
    });
  });

  it("strips wrapping quotes from SMTP environment values", (): void => {
    const env = loadAuthEnv({
      SESSION_SECRET: "local-development-session-secret-value",
      SITE_URL: "https://neatly.example",
      SMTP_FROM_EMAIL: "'hello@neatly.example'",
      SMTP_FROM_NAME: '"Neatly"',
      SMTP_HOST: '"smtp-relay.brevo.com"',
      SMTP_PASSWORD: '"xsmtpsib-test-password"',
      SMTP_USER: "'hello@neatly.example'",
    });

    expect(env.email).toEqual({
      fromEmail: "hello@neatly.example",
      fromName: "Neatly",
      host: "smtp-relay.brevo.com",
      password: "xsmtpsib-test-password",
      port: 587,
      user: "hello@neatly.example",
    });
  });

  it("does not take down auth when SMTP is incomplete or only HTTP API vars exist", (): void => {
    const incomplete = loadAuthEnv({
      SESSION_SECRET: "local-development-session-secret-value",
      SITE_URL: "https://neatly.example",
      SMTP_PASSWORD: "xsmtpsib-test-password",
    });
    const httpApiOnly = loadAuthEnv({
      BREVO_API_KEY: "xkeysib-test-key",
      BREVO_FROM_EMAIL: "hello@neatly.example",
      BREVO_FROM_NAME: "Neatly",
      SESSION_SECRET: "local-development-session-secret-value",
      SITE_URL: "https://neatly.example",
    });

    expect(incomplete.email).toBeNull();
    expect(httpApiOnly.email).toBeNull();
  });

  it("rejects incomplete SMTP configuration in production startup", (): void => {
    expect((): void => {
      assertProductionConfig({
        BREVO_API_KEY: "xkeysib-test-key",
        DATABASE_URL: "postgresql://neatly:secret@localhost:5432/neatly",
        NODE_ENV: "production",
        SESSION_SECRET: "local-development-session-secret-value",
        SITE_URL: "https://neatly.example",
      });
    }).toThrow("SMTP_HOST is missing");
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

describe("assertProductionConfig", (): void => {
  it("does not require production secrets in development", (): void => {
    expect((): void => {
      assertProductionConfig({ NODE_ENV: "development" });
    }).not.toThrow();
  });

  it("requires DATABASE_URL in production without echoing it", (): void => {
    const databaseUrl = "postgresql://neatly:secret@localhost:5432/neatly";

    expect((): void => {
      assertProductionConfig({
        NODE_ENV: "production",
        SESSION_SECRET: "local-development-session-secret-value",
        SITE_URL: "https://neatly.example",
      });
    }).toThrow(/DATABASE_URL is required/);

    expect((): void => {
      assertProductionConfig({
        DATABASE_URL: databaseUrl,
        NODE_ENV: "production",
        SESSION_SECRET: "local-development-session-secret-value",
        SITE_URL: "https://neatly.example",
      });
    }).toThrow("SMTP_HOST is missing");

    try {
      assertProductionConfig({
        DATABASE_URL: databaseUrl,
        NODE_ENV: "production",
        SESSION_SECRET: "short",
        SITE_URL: "https://neatly.example",
      });
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      if (!(error instanceof Error)) {
        return;
      }
      expect(error.message).not.toContain(databaseUrl);
    }
  });

  it("accepts a complete production email configuration", (): void => {
    expect((): void => {
      assertProductionConfig({
        DATABASE_URL: "postgresql://neatly:secret@localhost:5432/neatly",
        NODE_ENV: "production",
        SESSION_SECRET: "local-development-session-secret-value",
        SITE_URL: "https://neatly.example",
        SMTP_FROM_EMAIL: "hello@neatly.example",
        SMTP_FROM_NAME: "Neatly",
        SMTP_HOST: "smtp-relay.brevo.com",
        SMTP_PASSWORD: "xsmtpsib-test-password",
        SMTP_USER: "hello@neatly.example",
      });
    }).not.toThrow();
  });
});
