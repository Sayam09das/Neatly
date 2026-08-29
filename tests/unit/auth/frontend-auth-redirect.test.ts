import { describe, expect, it } from "vitest";
import { AUTH_ADMIN_HOME_PATH, AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";
import { getFrontendAuthRedirect } from "@/lib/auth/navigation";
import { isAuthEntryPath } from "@/lib/auth/paths";

describe("isAuthEntryPath", (): void => {
  it("identifies canonical admin auth routes and their aliases", (): void => {
    expect(isAuthEntryPath("/admin/login")).toBe(true);
    expect(isAuthEntryPath("/admin/register")).toBe(true);
    expect(isAuthEntryPath("/admin/verify-email")).toBe(true);
    expect(isAuthEntryPath("/admin/forgot-password")).toBe(true);
    expect(isAuthEntryPath("/admin/reset-password")).toBe(true);
    expect(isAuthEntryPath("/login")).toBe(true);
    expect(isAuthEntryPath("/register")).toBe(true);
    expect(isAuthEntryPath("/admin/quotes")).toBe(false);
  });
});

describe("getFrontendAuthRedirect", (): void => {
  it("waits while auth status is unknown", (): void => {
    expect(
      getFrontendAuthRedirect({ pathname: "/admin", status: "unknown" }),
    ).toEqual({ type: "wait" });
    expect(
      getFrontendAuthRedirect({
        pathname: "/admin/login",
        status: "unknown",
      }),
    ).toEqual({ type: "wait" });
  });

  it("sends unauthenticated visitors on protected admin routes to login once", (): void => {
    expect(
      getFrontendAuthRedirect({
        pathname: "/admin",
        status: "unauthenticated",
      }),
    ).toEqual({ type: "redirect", to: AUTH_ADMIN_LOGIN_PATH });
    expect(
      getFrontendAuthRedirect({
        pathname: "/admin/login",
        status: "unauthenticated",
      }),
    ).toEqual({ type: "allow" });
    expect(
      getFrontendAuthRedirect({
        pathname: "/admin/forgot-password",
        status: "unauthenticated",
      }),
    ).toEqual({ type: "allow" });
    expect(
      getFrontendAuthRedirect({
        pathname: "/admin/register",
        status: "unauthenticated",
      }),
    ).toEqual({ type: "allow" });
  });

  it("sends authenticated visitors away from auth entry routes once", (): void => {
    expect(
      getFrontendAuthRedirect({
        pathname: "/admin/login",
        status: "authenticated",
      }),
    ).toEqual({ type: "redirect", to: AUTH_ADMIN_HOME_PATH });
    expect(
      getFrontendAuthRedirect({
        pathname: "/admin/register",
        status: "authenticated",
      }),
    ).toEqual({ type: "redirect", to: AUTH_ADMIN_HOME_PATH });
    expect(
      getFrontendAuthRedirect({
        pathname: "/admin/reset-password",
        status: "authenticated",
      }),
    ).toEqual({ type: "redirect", to: AUTH_ADMIN_HOME_PATH });
    expect(
      getFrontendAuthRedirect({
        pathname: "/admin",
        status: "authenticated",
      }),
    ).toEqual({ type: "allow" });
    expect(
      getFrontendAuthRedirect({
        pathname: "/dashboard",
        status: "unauthenticated",
      }),
    ).toEqual({ type: "redirect", to: AUTH_ADMIN_LOGIN_PATH });
  });
});
