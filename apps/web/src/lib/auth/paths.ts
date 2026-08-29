import {
  AUTH_ADMIN_LOGIN_PATH,
  AUTH_ENTRY_PATHS,
  AUTH_PUBLIC_ADMIN_PATHS,
} from "@/config/auth";
import {
  CUSTOMER_HOME_PATH,
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_PATHS,
  CUSTOMER_QUOTE_SERVICE_PARAM,
  customerDashboardServiceApplyPath,
} from "@/config/customer";

const SERVICE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isPublicAdminPath(pathname: string): boolean {
  return AUTH_PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function isProtectedAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isSafeServiceSlug(slug: string): boolean {
  return SERVICE_SLUG_PATTERN.test(slug);
}

export function isCustomerServiceApplyPath(pathname: string): boolean {
  if (!pathname.startsWith(`${CUSTOMER_PATHS.services}/`)) {
    return false;
  }

  const remainder = pathname.slice(`${CUSTOMER_PATHS.services}/`.length);
  const segments = remainder.split("/");

  return (
    segments.length === 2 &&
    segments[1] === "apply" &&
    isSafeServiceSlug(segments[0] ?? "")
  );
}

export function isProtectedCustomerPath(pathname: string): boolean {
  return (
    pathname === CUSTOMER_HOME_PATH ||
    pathname.startsWith(`${CUSTOMER_HOME_PATH}/`) ||
    pathname === CUSTOMER_PATHS.booking ||
    pathname.startsWith(`${CUSTOMER_PATHS.booking}/`) ||
    isCustomerServiceApplyPath(pathname)
  );
}

export function isAuthEntryPath(pathname: string): boolean {
  return AUTH_ENTRY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function isSafeCustomerNextPath(candidate: string): boolean {
  if (
    !candidate.startsWith("/") ||
    candidate.includes("://") ||
    candidate.includes("\\") ||
    candidate.includes("..") ||
    candidate.includes("//")
  ) {
    return false;
  }

  const queryIndex = candidate.indexOf("?");
  const pathname =
    queryIndex === -1 ? candidate : candidate.slice(0, queryIndex);
  const search = queryIndex === -1 ? "" : candidate.slice(queryIndex + 1);

  if (isCustomerServiceApplyPath(pathname)) {
    return search === "";
  }

  if (pathname === CUSTOMER_PATHS.quote) {
    return isSafeQuoteNextSearch(search);
  }

  if (search !== "") {
    return false;
  }

  if (pathname === CUSTOMER_HOME_PATH) {
    return true;
  }

  if (pathname.startsWith(`${CUSTOMER_HOME_PATH}/`)) {
    return true;
  }

  if (pathname === CUSTOMER_PATHS.booking) {
    return true;
  }

  return pathname.startsWith(`${CUSTOMER_PATHS.bookingConfirmation}/`);
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

    const next = customerApplyLoginNextPath(input.pathname);

    return {
      type: "redirect",
      pathname: CUSTOMER_LOGIN_PATH,
      ...(isSafeCustomerNextPath(next) ? { next } : {}),
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

export function customerApplyLoginNextPath(pathname: string): string {
  if (!isCustomerServiceApplyPath(pathname)) {
    return pathname;
  }

  const remainder = pathname.slice(`${CUSTOMER_PATHS.services}/`.length);
  const slug = remainder.split("/")[0] ?? "";

  return customerDashboardServiceApplyPath(slug);
}

function isSafeQuoteNextSearch(search: string): boolean {
  if (search === "") {
    return true;
  }

  const params = new URLSearchParams(search);
  const keys = [...params.keys()];

  if (keys.length !== 1 || keys[0] !== CUSTOMER_QUOTE_SERVICE_PARAM) {
    return false;
  }

  return isSafeServiceSlug(params.get(CUSTOMER_QUOTE_SERVICE_PARAM) ?? "");
}
