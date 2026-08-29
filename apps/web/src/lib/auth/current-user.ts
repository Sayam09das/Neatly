import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import {
  AUTH_ADMIN_HOME_PATH,
  AUTH_ADMIN_LOGIN_PATH,
  AUTH_CUSTOMER_HOME_PATH,
  AUTH_SESSION_COOKIE_NAME,
} from "@/config/auth";
import { CLEANER_LOGIN_PATH } from "@/config/cleaner";
import { CUSTOMER_LOGIN_PATH } from "@/config/customer";
import { isAdminOperatorRole, requireRole } from "@/lib/auth/authorization";
import { createClearedSessionCookie } from "@/lib/auth/cookies";
import { AUTH_ERROR_MESSAGES, AuthError } from "@/lib/auth/errors";
import { getAuthService } from "@/lib/auth/runtime";
import { toAuthSession } from "@/lib/auth/session-state";
import { loadCleanerSession } from "@/lib/cleaner/session";
import type { AuthSession, AuthUser, AuthUserRole } from "@/types/auth";
import type { CleanerProfile } from "@/types/cleaner";

export { requireRole } from "@/lib/auth/authorization";

async function readSessionToken(): Promise<string | undefined> {
  const jar = await cookies();
  const sessionToken = jar.get(AUTH_SESSION_COOKIE_NAME)?.value;

  if (sessionToken === undefined || sessionToken.trim() === "") {
    return undefined;
  }

  return sessionToken;
}

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const sessionToken = await readSessionToken();

  if (sessionToken === undefined) {
    return null;
  }

  return getAuthService().resolveSession(sessionToken);
});

export async function getSession(): Promise<AuthSession> {
  const user = await getCurrentUser();
  return toAuthSession(user);
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (user === null) {
    throw new AuthError("UNAUTHORIZED", AUTH_ERROR_MESSAGES.UNAUTHORIZED);
  }

  return user;
}

export async function requireAdminPage(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (user === null) {
    redirect(AUTH_ADMIN_LOGIN_PATH);
  }

  if (!isAdminOperatorRole(user.role)) {
    redirect(AUTH_CUSTOMER_HOME_PATH);
  }

  return user;
}

export async function requireCustomerPage(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (user === null) {
    redirect(CUSTOMER_LOGIN_PATH);
  }

  return user;
}

export async function requireCleanerPage(): Promise<CleanerProfile> {
  const user = await getCurrentUser();

  if (user === null) {
    redirect(CLEANER_LOGIN_PATH);
  }

  if (isAdminOperatorRole(user.role)) {
    redirect(AUTH_ADMIN_HOME_PATH);
  }

  const session = await loadCleanerSession(await readSessionToken());

  if (!session.ok && session.unauthorized) {
    redirect(CLEANER_LOGIN_PATH);
  }

  if (!session.ok && session.forbidden) {
    redirect(AUTH_CUSTOMER_HOME_PATH);
  }

  if (!session.ok) {
    throw new Error("Unable to verify cleaner access.");
  }

  return session.profile;
}

export async function redirectAuthenticatedAdmin(): Promise<void> {
  const user = await getCurrentUser();

  if (user === null) {
    return;
  }

  if (isAdminOperatorRole(user.role)) {
    redirect(AUTH_ADMIN_HOME_PATH);
    return;
  }

  redirect(AUTH_CUSTOMER_HOME_PATH);
}

export async function requirePermission(role: AuthUserRole): Promise<AuthUser> {
  const user = await requireAuth();
  return requireRole(user, role);
}

export async function logoutCurrentSession(): Promise<void> {
  const jar = await cookies();
  const sessionToken = jar.get(AUTH_SESSION_COOKIE_NAME)?.value;
  await getAuthService().logout(sessionToken);
  jar.set(createClearedSessionCookie());
}
