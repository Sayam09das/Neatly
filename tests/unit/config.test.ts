import {
  APP_NAME,
  type ClientEnv,
  EnvValidationError,
  loadClientEnv,
} from "@neatly/config";
import { loadServerEnv, type ServerEnv } from "@neatly/config/server";
import { describe, expect, it, vi } from "vitest";

const validClientSource = {
  NEXT_PUBLIC_SITE_URL: "https://neatly.example",
} as const;

const validServerSource = {
  DATABASE_URL: "postgresql://neatly:neatly@localhost:5432/neatly",
  SESSION_SECRET: "local-development-session-secret-value",
  EMAIL_API_KEY: "local-email-key",
  STORAGE_API_KEY: "local-storage-key",
  NEXT_PUBLIC_SITE_URL: "https://neatly.example",
} as const;

describe("APP_NAME", (): void => {
  it("exports the Neatly product name", (): void => {
    expect(APP_NAME).toBe("Neatly");
  });
});

describe("loadClientEnv", (): void => {
  it("returns validated public configuration", (): void => {
    const env: ClientEnv = loadClientEnv(validClientSource);

    expect(env).toEqual({
      NEXT_PUBLIC_SITE_URL: "https://neatly.example",
    });
    expect(env).not.toHaveProperty("DATABASE_URL");
    expect(env).not.toHaveProperty("SESSION_SECRET");
  });

  it("ignores server-only keys present in the source", (): void => {
    const env = loadClientEnv({
      ...validClientSource,
      DATABASE_URL: "postgresql://neatly:neatly@localhost:5432/neatly",
      SESSION_SECRET: "local-development-session-secret-value",
    });

    expect(Object.keys(env)).toEqual(["NEXT_PUBLIC_SITE_URL"]);
  });

  it("fails when NEXT_PUBLIC_SITE_URL is missing", (): void => {
    try {
      loadClientEnv({});
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(EnvValidationError);
      if (!(error instanceof EnvValidationError)) {
        return;
      }
      expect(error.message).toContain("NEXT_PUBLIC_SITE_URL is required");
      expect(error.message).not.toMatch(/postgresql:\/\//i);
    }
  });

  it("fails when NEXT_PUBLIC_SITE_URL is not a URL", (): void => {
    const invalidValue = "not-a-url";

    try {
      loadClientEnv({ NEXT_PUBLIC_SITE_URL: invalidValue });
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(EnvValidationError);
      if (!(error instanceof EnvValidationError)) {
        return;
      }
      expect(error.message).toContain("NEXT_PUBLIC_SITE_URL is invalid");
      expect(error.message).not.toContain(invalidValue);
    }
  });
});

describe("loadServerEnv", (): void => {
  it("returns validated server configuration", (): void => {
    const env: ServerEnv = loadServerEnv(validServerSource);

    expect(env.DATABASE_URL).toBe(validServerSource.DATABASE_URL);
    expect(env.NEXT_PUBLIC_SITE_URL).toBe(
      validServerSource.NEXT_PUBLIC_SITE_URL,
    );
  });

  it("fails when a required server variable is missing", (): void => {
    try {
      loadServerEnv({
        ...validServerSource,
        DATABASE_URL: undefined,
      });
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(EnvValidationError);
      if (!(error instanceof EnvValidationError)) {
        return;
      }
      expect(error.message).toContain("DATABASE_URL is required");
      expect(error.variableNames).toContain("DATABASE_URL");
    }
  });

  it("fails when SESSION_SECRET is too short without echoing the value", (): void => {
    const shortSecret = "too-short";

    try {
      loadServerEnv({
        ...validServerSource,
        SESSION_SECRET: shortSecret,
      });
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(EnvValidationError);
      if (!(error instanceof EnvValidationError)) {
        return;
      }
      expect(error.message).toContain("SESSION_SECRET is invalid");
      expect(error.message).not.toContain(shortSecret);
    }
  });

  it("rejects use when a browser window is present", (): void => {
    vi.stubGlobal("window", {});

    try {
      expect(() => loadServerEnv(validServerSource)).toThrow(
        /cannot be imported in client code/i,
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
