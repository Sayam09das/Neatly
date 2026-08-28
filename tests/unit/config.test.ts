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
  NEATLY_API_URL: "http://127.0.0.1:4000",
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

    expect(env).toEqual({
      NEATLY_API_URL: validServerSource.NEATLY_API_URL,
      NEXT_PUBLIC_SITE_URL: validServerSource.NEXT_PUBLIC_SITE_URL,
    });
    expect(env).not.toHaveProperty("DATABASE_URL");
    expect(env).not.toHaveProperty("SESSION_SECRET");
  });

  it("ignores backend secrets present in the source", (): void => {
    const env = loadServerEnv({
      ...validServerSource,
      DATABASE_URL: "postgresql://neatly:neatly@localhost:5432/neatly",
      SESSION_SECRET: "local-development-session-secret-value",
    });

    expect(Object.keys(env).sort()).toEqual([
      "NEATLY_API_URL",
      "NEXT_PUBLIC_SITE_URL",
    ]);
  });

  it("fails when a required server variable is missing", (): void => {
    try {
      loadServerEnv({
        ...validServerSource,
        NEATLY_API_URL: undefined,
      });
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(EnvValidationError);
      if (!(error instanceof EnvValidationError)) {
        return;
      }
      expect(error.message).toContain("NEATLY_API_URL is required");
      expect(error.variableNames).toContain("NEATLY_API_URL");
    }
  });

  it("fails when NEATLY_API_URL is invalid without echoing the value", (): void => {
    const invalidValue = "not-a-url";

    try {
      loadServerEnv({
        ...validServerSource,
        NEATLY_API_URL: invalidValue,
      });
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(EnvValidationError);
      if (!(error instanceof EnvValidationError)) {
        return;
      }
      expect(error.message).toContain("NEATLY_API_URL is invalid");
      expect(error.message).not.toContain(invalidValue);
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
