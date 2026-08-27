import { describe, expect, it } from "vitest";
import {
  AUTH_SESSION_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE_SECONDS,
} from "@/config/auth";
import {
  createClearedSessionCookie,
  createSessionCookie,
} from "@/lib/auth/cookies";

describe("session cookies", (): void => {
  it("creates an HttpOnly Strict cookie that is Secure only in production", (): void => {
    const developmentCookie = createSessionCookie("token-value", "development");
    const productionCookie = createSessionCookie("token-value", "production");

    expect(developmentCookie.name).toBe(AUTH_SESSION_COOKIE_NAME);
    expect(developmentCookie.httpOnly).toBe(true);
    expect(developmentCookie.sameSite).toBe("strict");
    expect(developmentCookie.path).toBe("/");
    expect(developmentCookie.maxAge).toBe(AUTH_SESSION_MAX_AGE_SECONDS);
    expect(developmentCookie.secure).toBe(false);
    expect(productionCookie.secure).toBe(true);
  });

  it("clears the session cookie by setting maxAge to zero", (): void => {
    const cookie = createClearedSessionCookie("production");

    expect(cookie.value).toBe("");
    expect(cookie.maxAge).toBe(0);
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.secure).toBe(true);
  });
});
