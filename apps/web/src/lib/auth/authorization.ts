import { AUTH_ERROR_MESSAGES, AuthError } from "@/lib/auth/errors";
import type { AuthUser, AuthUserRole } from "@/types/auth";

export function requireRole(user: AuthUser, role: AuthUserRole): AuthUser {
  if (user.role === "SUPER_ADMIN" || user.role === role) {
    return user;
  }

  throw new AuthError("FORBIDDEN", AUTH_ERROR_MESSAGES.FORBIDDEN);
}
