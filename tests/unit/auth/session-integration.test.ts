import { describe, expect, it } from "vitest";
import { AUTH_ADMIN_HOME_PATH, AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";
import { parseAdminApiResponse } from "@/lib/api/admin-request";
import { getAdminNavigationDecision } from "@/lib/auth/navigation";
import {
  AUTH_USER_PUBLIC_FIELDS,
  exposesSensitiveAuthFields,
  toAuthSession,
} from "@/lib/auth/session-state";
import type { AuthUser } from "@/types/auth";

const adminUser: AuthUser = {
  id: "user_1",
  name: "Neatly Admin",
  email: "admin@neatly.example",
  role: "ADMIN",
  status: "ACTIVE",
  lastLoginAt: null,
};

describe("toAuthSession", (): void => {
  it("returns an unauthenticated session when no user is present", (): void => {
    expect(toAuthSession(null)).toEqual({
      status: "unauthenticated",
      user: null,
    });
  });

  it("returns an authenticated session with a safe user object", (): void => {
    const session = toAuthSession(adminUser);

    expect(session).toEqual({
      status: "authenticated",
      user: adminUser,
    });
    expect(Object.keys(adminUser).sort()).toEqual(
      [...AUTH_USER_PUBLIC_FIELDS].sort(),
    );
    expect(exposesSensitiveAuthFields(adminUser)).toBe(false);
    expect(
      exposesSensitiveAuthFields({
        ...adminUser,
        passwordHash: "should-not-be-present",
      }),
    ).toBe(true);
  });
});

describe("getAdminNavigationDecision", (): void => {
  it("allows public marketing routes without authentication", (): void => {
    expect(getAdminNavigationDecision({ pathname: "/", user: null })).toEqual({
      type: "allow",
    });
    expect(
      getAdminNavigationDecision({ pathname: "/about", user: null }),
    ).toEqual({ type: "allow" });
  });

  it("sends unauthenticated visitors on protected admin routes to login", (): void => {
    expect(
      getAdminNavigationDecision({ pathname: "/admin", user: null }),
    ).toEqual({ type: "redirect", to: AUTH_ADMIN_LOGIN_PATH });
    expect(
      getAdminNavigationDecision({ pathname: "/admin/quotes", user: null }),
    ).toEqual({ type: "redirect", to: AUTH_ADMIN_LOGIN_PATH });
  });

  it("allows unauthenticated visitors on admin session routes", (): void => {
    expect(
      getAdminNavigationDecision({ pathname: "/admin/login", user: null }),
    ).toEqual({ type: "allow" });
    expect(
      getAdminNavigationDecision({
        pathname: "/admin/forgot-password",
        user: null,
      }),
    ).toEqual({ type: "allow" });
  });

  it("sends authenticated visitors away from login to the admin home", (): void => {
    expect(
      getAdminNavigationDecision({
        pathname: "/admin/login",
        user: adminUser,
      }),
    ).toEqual({ type: "redirect", to: AUTH_ADMIN_HOME_PATH });
  });

  it("allows authenticated admins into protected admin routes", (): void => {
    expect(
      getAdminNavigationDecision({
        pathname: "/admin",
        user: adminUser,
      }),
    ).toEqual({ type: "allow" });
  });
});

describe("parseAdminApiResponse", (): void => {
  it("returns data for authenticated success payloads", (): void => {
    const result = parseAdminApiResponse<{ signedOut: true }>(200, {
      success: true,
      data: { signedOut: true },
      error: null,
    });

    expect(result).toEqual({
      ok: true,
      status: 200,
      data: { signedOut: true },
    });
  });

  it("classifies 401 as unauthorized without treating it as forbidden", (): void => {
    const result = parseAdminApiResponse(401, {
      success: false,
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication is required.",
      },
    });

    expect(result).toEqual({
      ok: false,
      status: 401,
      code: "UNAUTHORIZED",
      message: "Authentication is required.",
      unauthorized: true,
      forbidden: false,
    });
  });

  it("classifies 403 as forbidden without logging the user out", (): void => {
    const result = parseAdminApiResponse(403, {
      success: false,
      data: null,
      error: {
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
      },
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.unauthorized).toBe(false);
    expect(result.forbidden).toBe(true);
    expect(result.code).toBe("FORBIDDEN");
  });

  it("does not retry or refresh on unauthorized responses", (): void => {
    const result = parseAdminApiResponse(401, null);

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.unauthorized).toBe(true);
    expect(result.code).toBe("UNAUTHORIZED");
  });
});
