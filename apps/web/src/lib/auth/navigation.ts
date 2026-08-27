import { AUTH_ADMIN_HOME_PATH, AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";
import { isProtectedAdminPath, isPublicAdminPath } from "@/lib/auth/paths";
import type { AuthUser } from "@/types/auth";

export type AdminNavigationDecision =
  | { type: "allow" }
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
