import { AUTH_ADMIN_HOME_PATH, AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";
import {
  isAuthEntryPath,
  isProtectedAdminPath,
  isPublicAdminPath,
} from "@/lib/auth/paths";
import type { AuthUser } from "@/types/auth";
import type { FrontendAuthStatus } from "@/types/auth-form";

export type AdminNavigationDecision =
  | { type: "allow" }
  | { type: "redirect"; to: string };

export type FrontendAuthRedirect =
  | { type: "allow" }
  | { type: "wait" }
  | { type: "redirect"; to: string };

export function getAdminNavigationDecision(input: {
  pathname: string;
  user: AuthUser | null;
}): AdminNavigationDecision {
  if (!isProtectedAdminPath(input.pathname)) {
    return { type: "allow" };
  }

  if (isPublicAdminPath(input.pathname)) {
    if (input.user !== null) {
      return { type: "redirect", to: AUTH_ADMIN_HOME_PATH };
    }

    return { type: "allow" };
  }

  if (input.user === null) {
    return { type: "redirect", to: AUTH_ADMIN_LOGIN_PATH };
  }

  return { type: "allow" };
}

export function getFrontendAuthRedirect(input: {
  pathname: string;
  status: FrontendAuthStatus;
}): FrontendAuthRedirect {
  if (input.status === "unknown") {
    return { type: "wait" };
  }

  const isProtected =
    isProtectedAdminPath(input.pathname) && !isPublicAdminPath(input.pathname);
  const isEntry = isAuthEntryPath(input.pathname);

  if (input.status === "unauthenticated") {
    if (isProtected) {
      return { type: "redirect", to: AUTH_ADMIN_LOGIN_PATH };
    }

    return { type: "allow" };
  }

  if (isEntry) {
    return { type: "redirect", to: AUTH_ADMIN_HOME_PATH };
  }

  return { type: "allow" };
}
