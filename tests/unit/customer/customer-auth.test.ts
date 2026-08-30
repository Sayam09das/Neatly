import { describe, expect, it } from "vitest";
import { AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";
import { CUSTOMER_LOGIN_PATH, CUSTOMER_PATHS } from "@/config/customer";
import {
  getCustomerNavigationDecision,
  getFrontendAuthRedirect,
} from "@/lib/auth/navigation";
import {
  getEdgeAuthDecision,
  isProtectedCustomerPath,
  isSafeCustomerNextPath,
} from "@/lib/auth/paths";
import type { AuthUser } from "@/types/auth";

const sessionUser: AuthUser = {
  email: "ada@neatly.example",
  id: "user_customer",
  lastLoginAt: null,
  name: "Ada",
  role: "STAFF",
  status: "ACTIVE",
};

describe("customer route protection", (): void => {
  it("treats the account area as protected and public marketing routes as open", (): void => {
    expect(isProtectedCustomerPath("/dashboard")).toBe(true);
    expect(isProtectedCustomerPath("/dashboard/bookings/123")).toBe(true);
    expect(isProtectedCustomerPath("/quote")).toBe(false);
    expect(isProtectedCustomerPath("/services")).toBe(false);
    expect(isProtectedCustomerPath("/services/deep-cleaning")).toBe(false);
    expect(isProtectedCustomerPath("/services/deep-cleaning/apply")).toBe(true);
    expect(isProtectedCustomerPath("/booking")).toBe(true);
    expect(isProtectedCustomerPath("/booking/confirmation/abc")).toBe(true);
    expect(isSafeCustomerNextPath("/dashboard/profile")).toBe(true);
    expect(isSafeCustomerNextPath("/booking")).toBe(true);
    expect(
      isSafeCustomerNextPath("/booking?quoteId=cmtfonlc8000srpwvi60xgw1r"),
    ).toBe(true);
    expect(isSafeCustomerNextPath("/booking/confirmation/abc")).toBe(true);
    expect(isSafeCustomerNextPath("/services/deep-cleaning/apply")).toBe(true);
    expect(
      isSafeCustomerNextPath("/dashboard/services/deep-cleaning/apply"),
    ).toBe(true);
    expect(isSafeCustomerNextPath("/quote?service=deep-cleaning")).toBe(true);
    expect(isSafeCustomerNextPath("https://evil.example")).toBe(false);
    expect(isSafeCustomerNextPath("/dashboard/../admin")).toBe(false);
    expect(isSafeCustomerNextPath("/services/../admin/apply")).toBe(false);
    expect(
      isSafeCustomerNextPath("https://evil.example/services/x/apply"),
    ).toBe(false);
  });

  it("redirects unauthenticated dashboard requests to login with a safe next path", (): void => {
    expect(
      getEdgeAuthDecision({
        hasSession: false,
        pathname: "/dashboard/bookings",
      }),
    ).toEqual({
      next: "/dashboard/bookings",
      pathname: CUSTOMER_LOGIN_PATH,
      type: "redirect",
    });
    expect(
      getEdgeAuthDecision({
        hasSession: true,
        pathname: "/dashboard",
      }),
    ).toEqual({ type: "next" });
    expect(
      getEdgeAuthDecision({
        hasSession: false,
        pathname: "/services",
      }),
    ).toEqual({ type: "next" });
    expect(
      getEdgeAuthDecision({
        hasSession: false,
        pathname: "/services/deep-cleaning",
      }),
    ).toEqual({ type: "next" });
    expect(
      getEdgeAuthDecision({
        hasSession: false,
        pathname: "/services/deep-cleaning/apply",
      }),
    ).toEqual({
      next: "/dashboard/services/deep-cleaning/apply",
      pathname: CUSTOMER_LOGIN_PATH,
      type: "redirect",
    });
    expect(
      getEdgeAuthDecision({
        hasSession: true,
        pathname: "/services/deep-cleaning/apply",
      }),
    ).toEqual({ type: "next" });
    expect(
      getEdgeAuthDecision({
        hasSession: false,
        pathname: "/dashboard/services/deep-cleaning/apply",
      }),
    ).toEqual({
      next: "/dashboard/services/deep-cleaning/apply",
      pathname: CUSTOMER_LOGIN_PATH,
      type: "redirect",
    });
    expect(
      getEdgeAuthDecision({
        hasSession: true,
        pathname: "/dashboard/services/deep-cleaning/apply",
      }),
    ).toEqual({ type: "next" });
    expect(
      getEdgeAuthDecision({
        hasSession: false,
        pathname: "/admin/bookings",
      }),
    ).toEqual({
      pathname: AUTH_ADMIN_LOGIN_PATH,
      type: "redirect",
    });
  });

  it("keeps frontend navigation decisions aligned with the session gate", (): void => {
    expect(
      getCustomerNavigationDecision({
        pathname: "/dashboard",
        user: null,
      }),
    ).toEqual({ type: "redirect", to: CUSTOMER_LOGIN_PATH });
    expect(
      getCustomerNavigationDecision({
        pathname: CUSTOMER_PATHS.services,
        user: null,
      }),
    ).toEqual({ type: "allow" });
    expect(
      getCustomerNavigationDecision({
        pathname: "/services/deep-cleaning/apply",
        user: null,
      }),
    ).toEqual({ type: "redirect", to: CUSTOMER_LOGIN_PATH });
    expect(
      getCustomerNavigationDecision({
        pathname: "/dashboard/help",
        user: sessionUser,
      }),
    ).toEqual({ type: "allow" });
    expect(
      getFrontendAuthRedirect({
        pathname: CUSTOMER_PATHS.dashboard,
        status: "unauthenticated",
      }),
    ).toEqual({ type: "redirect", to: CUSTOMER_LOGIN_PATH });
    expect(
      getFrontendAuthRedirect({
        pathname: CUSTOMER_PATHS.dashboard,
        status: "authenticated",
      }),
    ).toEqual({ type: "allow" });
  });
});
