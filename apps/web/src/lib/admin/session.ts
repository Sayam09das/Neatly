import { AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";
import type { AdminApiFailure } from "@/lib/api/admin-request";

export function redirectToAdminLogin(): void {
  if (typeof window === "undefined") {
    return;
  }

  const nextPath = `${window.location.pathname}${window.location.search}`;
  const loginUrl = new URL(AUTH_ADMIN_LOGIN_PATH, window.location.origin);

  if (nextPath !== AUTH_ADMIN_LOGIN_PATH && nextPath.startsWith("/admin")) {
    loginUrl.searchParams.set("next", nextPath);
  }

  window.location.assign(loginUrl.toString());
}

export function handleAdminApiFailure(failure: AdminApiFailure): void {
  if (failure.unauthorized) {
    redirectToAdminLogin();
  }
}
