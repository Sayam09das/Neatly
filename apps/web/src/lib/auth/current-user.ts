import { cookies } from "next/headers";
import { AUTH_SESSION_COOKIE_NAME } from "@/config/auth";
import { requireRole } from "@/lib/auth/authorization";
import { AUTH_ERROR_MESSAGES, AuthError } from "@/lib/auth/errors";
import { getAuthService } from "@/lib/auth/runtime";
import type { AuthUser, AuthUserRole } from "@/types/auth";

export { requireRole } from "@/lib/auth/authorization";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const jar = await cookies();
  const sessionToken = jar.get(AUTH_SESSION_COOKIE_NAME)?.value;

  return getAuthService().resolveSession(sessionToken);
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (user === null) {
    throw new AuthError("UNAUTHORIZED", AUTH_ERROR_MESSAGES.UNAUTHORIZED);
  }

  return user;
}

export async function requirePermission(role: AuthUserRole): Promise<AuthUser> {
  const user = await requireAuth();
  return requireRole(user, role);
}
