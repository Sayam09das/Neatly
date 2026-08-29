import {
  AUTH_ADMIN_LOGIN_PATH,
  AUTH_ENTRY_PATHS,
  AUTH_PUBLIC_ADMIN_PATHS,
} from "@/config/auth";
import {
  CUSTOMER_HOME_PATH,
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_PATHS,
} from "@/config/customer";

export function isPublicAdminPath(pathname: string): boolean {
  return AUTH_PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function isProtectedAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isProtectedCustomerPath(pathname: string): boolean {
  return (
    pathname === CUSTOMER_HOME_PATH ||
    pathname.startsWith(`${CUSTOMER_HOME_PATH}/`) ||
    pathname === CUSTOMER_PATHS.booking ||
    pathname.startsWith(`${CUSTOMER_PATHS.booking}/`)
  );
}

export function isAuthEntryPath(pathname: string): boolean {
  return AUTH_ENTRY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function isSafeCustomerNextPath(pathname: string): boolean {
  if (
    pathname.includes("://") ||
    pathname.includes("\\") ||
    pathname.includes("..")
  ) {
    return false;
  }

  if (pathname === CUSTOMER_HOME_PATH) {
    return true;
  }

  if (
    pathname.startsWith(`${CUSTOMER_HOME_PATH}/`) &&
    !pathname.includes("//")
  ) {
    return true;
  }

  if (pathname === CUSTOMER_PATHS.booking) {
    return true;
  }

  return (
    pathname.startsWith(`${CUSTOMER_PATHS.bookingConfirmation}/`) &&
    !pathname.includes("//")
  );
}

export type EdgeAuthDecision =
  | { type: "next" }
  | { next?: string; pathname: string; type: "redirect" };

export function getEdgeAuthDecision(input: {
  hasSession: boolean;
  pathname: string;
}): EdgeAuthDecision {
  if (isProtectedCustomerPath(input.pathname)) {
    if (input.hasSession) {
      return { type: "next" };
    }

    return {
      type: "redirect",
      pathname: CUSTOMER_LOGIN_PATH,
      ...(isSafeCustomerNextPath(input.pathname)
        ? { next: input.pathname }
        : {}),
    };
  }

  if (
    !isProtectedAdminPath(input.pathname) ||
    isPublicAdminPath(input.pathname)
  ) {
    return { type: "next" };
  }

  if (input.hasSession) {
    return { type: "next" };
  }

  return {
    type: "redirect",
    pathname: AUTH_ADMIN_LOGIN_PATH,
  };
}
