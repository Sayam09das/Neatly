import { describe, expect, it } from "vitest";
import {
  CUSTOMER_API_PATHS,
  CUSTOMER_API_PREFIX,
  CUSTOMER_PATHS,
  customerBookingDetailPath,
  customerPaths,
  customerServicePath,
  withCustomerApiId,
} from "@/config/customer";
import {
  customerAccountMenuItems,
  customerFooterAccountLinks,
  customerHeaderNavigation,
  customerNavigation,
  getCustomerNavItems,
  getCustomerPageTitle,
  isCustomerNavItemActive,
} from "@/config/customer-nav";

describe("customer paths", (): void => {
  it("centralizes customer and public foundation routes", (): void => {
    expect(customerPaths).toEqual(CUSTOMER_PATHS);
    expect(CUSTOMER_PATHS.dashboard).toBe("/dashboard");
    expect(CUSTOMER_PATHS.bookings).toBe("/dashboard/bookings");
    expect(CUSTOMER_PATHS.profile).toBe("/dashboard/profile");
    expect(CUSTOMER_PATHS.settings).toBe("/dashboard/settings");
    expect(CUSTOMER_PATHS.notifications).toBe("/dashboard/notifications");
    expect(CUSTOMER_PATHS.reviews).toBe("/dashboard/reviews");
    expect(CUSTOMER_PATHS.help).toBe("/dashboard/help");
    expect(CUSTOMER_PATHS.quote).toBe("/quote");
    expect(CUSTOMER_PATHS.booking).toBe("/booking");
    expect(CUSTOMER_PATHS.bookingConfirmation).toBe("/booking/confirmation");
    expect(CUSTOMER_PATHS.services).toBe("/services");
  });

  it("encodes resource ids in path segments instead of identity query params", (): void => {
    expect(customerBookingDetailPath("booking_1")).toBe(
      "/dashboard/bookings/booking_1",
    );
    expect(customerServicePath("deep-clean")).toBe("/services/deep-clean");
    expect(withCustomerApiId(CUSTOMER_API_PATHS.booking, "booking_1")).toBe(
      `${CUSTOMER_API_PREFIX}/bookings/booking_1`,
    );
    expect(JSON.stringify(CUSTOMER_API_PATHS)).not.toContain("customerId");
    expect(JSON.stringify(CUSTOMER_API_PATHS)).not.toContain("userId=");
    expect(CUSTOMER_API_PREFIX).not.toContain("/admin");
  });
});

describe("customer navigation", (): void => {
  it("covers account sections without counts or dummy labels", (): void => {
    expect(getCustomerNavItems().map((item) => item.href)).toEqual([
      CUSTOMER_PATHS.dashboard,
      CUSTOMER_PATHS.bookings,
      CUSTOMER_PATHS.reviews,
      CUSTOMER_PATHS.notifications,
      CUSTOMER_PATHS.help,
      CUSTOMER_PATHS.services,
    ]);
    expect(customerNavigation.some((item) => /\d/.test(item.label))).toBe(
      false,
    );
    expect(customerHeaderNavigation.map((item) => item.href)).toEqual([
      CUSTOMER_PATHS.dashboard,
      CUSTOMER_PATHS.bookings,
    ]);
    expect(customerAccountMenuItems.map((item) => item.href)).toEqual([
      CUSTOMER_PATHS.profile,
      CUSTOMER_PATHS.settings,
    ]);
    expect(customerFooterAccountLinks.map((item) => item.href)).toEqual([
      CUSTOMER_PATHS.dashboard,
      CUSTOMER_PATHS.bookings,
      CUSTOMER_PATHS.help,
    ]);
  });

  it("treats the account home path as exact-only", (): void => {
    expect(
      isCustomerNavItemActive("/dashboard", CUSTOMER_PATHS.dashboard),
    ).toBe(true);
    expect(
      isCustomerNavItemActive("/dashboard/bookings", CUSTOMER_PATHS.dashboard),
    ).toBe(false);
    expect(
      isCustomerNavItemActive(
        "/dashboard/bookings/123",
        CUSTOMER_PATHS.bookings,
      ),
    ).toBe(true);
    expect(getCustomerPageTitle("/dashboard")).toBe("Overview");
    expect(getCustomerPageTitle("/dashboard/bookings/123")).toBe("Bookings");
    expect(isCustomerNavItemActive(null, CUSTOMER_PATHS.dashboard)).toBe(false);
  });
});
