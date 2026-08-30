import { describe, expect, it } from "vitest";
import { AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";
import {
  CLEANER_ACTIVATE_PATH,
  CLEANER_HOME_PATH,
  CLEANER_LOGIN_PATH,
} from "@/config/cleaner";
import { CUSTOMER_LOGIN_PATH } from "@/config/customer";
import {
  getCleanerNavigationDecision,
  getFrontendAuthRedirect,
} from "@/lib/auth/navigation";
import {
  getEdgeAuthDecision,
  isProtectedCleanerPath,
  isProtectedCustomerPath,
  isSafeCleanerNextPath,
} from "@/lib/auth/paths";
import type { AuthUser } from "@/types/auth";

const sessionUser: AuthUser = {
  email: "mia@neatly.example",
  id: "user_cleaner",
  lastLoginAt: null,
  name: "Mia",
  role: "STAFF",
  status: "ACTIVE",
};

describe("cleaner route protection", (): void => {
  it("protects the cleaner area without overlapping customer or admin routes", (): void => {
    expect(isProtectedCleanerPath("/cleaner")).toBe(true);
    expect(isProtectedCleanerPath("/cleaner/jobs")).toBe(true);
    expect(isProtectedCleanerPath(CLEANER_ACTIVATE_PATH)).toBe(false);
    expect(isSafeCleanerNextPath(CLEANER_ACTIVATE_PATH)).toBe(false);
    expect(isProtectedCustomerPath("/cleaner")).toBe(false);
    expect(isProtectedCleanerPath("/dashboard")).toBe(false);
    expect(isProtectedCleanerPath("/admin")).toBe(false);
    expect(isSafeCleanerNextPath("/cleaner")).toBe(true);
    expect(isSafeCleanerNextPath("/cleaner/jobs")).toBe(true);
    expect(isSafeCleanerNextPath("https://evil.example")).toBe(false);
    expect(isSafeCleanerNextPath("/cleaner/../admin")).toBe(false);
  });

  it("redirects unauthenticated cleaner requests to login with a safe next path", (): void => {
    expect(
      getEdgeAuthDecision({
        hasSession: false,
        pathname: "/cleaner",
      }),
    ).toEqual({
      next: "/cleaner",
      pathname: CLEANER_LOGIN_PATH,
      type: "redirect",
    });
    expect(
      getEdgeAuthDecision({
        hasSession: false,
        pathname: CLEANER_ACTIVATE_PATH,
      }),
    ).toEqual({ type: "next" });
    expect(
      getEdgeAuthDecision({
        hasSession: true,
        pathname: "/cleaner/jobs",
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
      getCleanerNavigationDecision({
        pathname: CLEANER_HOME_PATH,
        user: null,
      }),
    ).toEqual({ type: "redirect", to: CLEANER_LOGIN_PATH });
    expect(
      getCleanerNavigationDecision({
        pathname: CLEANER_HOME_PATH,
        user: sessionUser,
      }),
    ).toEqual({ type: "allow" });
    expect(
      getFrontendAuthRedirect({
        pathname: CLEANER_HOME_PATH,
        status: "unauthenticated",
      }),
    ).toEqual({ type: "redirect", to: CUSTOMER_LOGIN_PATH });
  });
});
