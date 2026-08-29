import { AUTH_LOGIN_ALIAS_PATH } from "@/config/auth";
import { CUSTOMER_LOGIN_PATH } from "@/config/customer";
import { requestAdminLogout } from "@/lib/api/admin-request";
import type { JsonApiFailure } from "@/lib/api/envelope";
import { isSafeCustomerNextPath } from "@/lib/auth/paths";
import { clearCustomerCache } from "@/lib/customer/cache";

export function redirectToCustomerLogin(): void {
  if (typeof window === "undefined") {
    return;
  }

  const nextPath = window.location.pathname;
  const loginUrl = new URL(CUSTOMER_LOGIN_PATH, window.location.origin);

  if (isSafeCustomerNextPath(nextPath)) {
    loginUrl.searchParams.set("next", nextPath);
  }

  window.location.assign(loginUrl.toString());
}

export function handleCustomerApiFailure(failure: JsonApiFailure): void {
  if (failure.unauthorized) {
    clearCustomerCache();
    redirectToCustomerLogin();
  }
}

export async function signOutCustomer(): Promise<void> {
  await requestAdminLogout();
  clearCustomerCache();

  if (typeof window === "undefined") {
    return;
  }

  window.location.assign(AUTH_LOGIN_ALIAS_PATH);
}
