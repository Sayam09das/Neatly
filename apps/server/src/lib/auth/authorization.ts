import { AUTH_ADMIN_ROLES } from "../../config/auth.ts";
import { AUTH_ERROR_MESSAGES, AuthError } from "./errors.ts";
import type { AuthUser, AuthUserRole } from "./types.ts";

export function isAdminRole(role: AuthUserRole): boolean {
  return (AUTH_ADMIN_ROLES as readonly string[]).includes(role);
}

export function requireAdmin(user: AuthUser): AuthUser {
  if (!isAdminRole(user.role)) {
    throw new AuthError("FORBIDDEN", AUTH_ERROR_MESSAGES.FORBIDDEN);
  }

  return user;
}

export function requireRole(user: AuthUser, role: AuthUserRole): AuthUser {
  if (user.role === "SUPER_ADMIN" || user.role === role) {
    return user;
  }

  throw new AuthError("FORBIDDEN", AUTH_ERROR_MESSAGES.FORBIDDEN);
}
