import { describe, expect, it } from "vitest";
import {
  AUTH_ADMIN_FORGOT_PASSWORD_PATH,
  AUTH_ADMIN_RESET_PASSWORD_PATH,
  AUTH_ADMIN_VERIFY_EMAIL_PATH,
  AUTH_LOGIN_ALIAS_PATH,
  AUTH_REGISTER_ALIAS_PATH,
  AUTH_ROUTES,
} from "@/config/auth";
import { authFormPaths } from "@/config/auth-ui";
import { isPublicAdminPath } from "@/lib/auth/paths";

describe("canonical admin auth routes", (): void => {
  it("keeps login and register under /admin", (): void => {
    expect(AUTH_ROUTES.login).toBe("/admin/login");
    expect(AUTH_ROUTES.register).toBe("/admin/register");
    expect(authFormPaths.login).toBe(AUTH_LOGIN_ALIAS_PATH);
    expect(authFormPaths.register).toBe(AUTH_REGISTER_ALIAS_PATH);
    expect(authFormPaths.forgotPassword).toBe(AUTH_ADMIN_FORGOT_PASSWORD_PATH);
    expect(authFormPaths.resetPassword).toBe(AUTH_ADMIN_RESET_PASSWORD_PATH);
    expect(authFormPaths.verifyEmail).toBe(AUTH_ADMIN_VERIFY_EMAIL_PATH);
  });

  it("treats admin auth entry pages as public", (): void => {
    expect(isPublicAdminPath("/admin/login")).toBe(true);
    expect(isPublicAdminPath("/admin/register")).toBe(true);
    expect(isPublicAdminPath("/admin/forgot-password")).toBe(true);
    expect(isPublicAdminPath("/admin/reset-password")).toBe(true);
    expect(isPublicAdminPath("/admin/verify-email")).toBe(true);
    expect(isPublicAdminPath("/admin/quotes")).toBe(false);
  });
});
