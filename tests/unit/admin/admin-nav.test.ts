import { describe, expect, it } from "vitest";
import {
  ADMIN_PATHS,
  adminNavigation,
  getAdminNavItems,
  getAdminPageTitle,
  isAdminNavItemActive,
} from "@/config/admin-nav";

describe("getAdminPageTitle", (): void => {
  it("uses Dashboard on home and nested titles on operations routes", (): void => {
    expect(getAdminPageTitle(ADMIN_PATHS.home)).toBe("Dashboard");
    expect(getAdminPageTitle(ADMIN_PATHS.bookings)).toBe("Bookings");
    expect(getAdminPageTitle(`${ADMIN_PATHS.bookings}/booking_test`)).toBe(
      "Bookings",
    );
    expect(getAdminPageTitle(ADMIN_PATHS.customers)).toBe("Customers");
    expect(getAdminPageTitle(`${ADMIN_PATHS.customers}/customer_test`)).toBe(
      "Customers",
    );
    expect(getAdminPageTitle(ADMIN_PATHS.services)).toBe("Services");
    expect(getAdminPageTitle(`${ADMIN_PATHS.services}/service_test`)).toBe(
      "Services",
    );
    expect(getAdminPageTitle(ADMIN_PATHS.reviews)).toBe("Reviews");
    expect(getAdminPageTitle(`${ADMIN_PATHS.reviews}/review_test`)).toBe(
      "Reviews",
    );
    expect(getAdminPageTitle(ADMIN_PATHS.notifications)).toBe("Notifications");
    expect(getAdminPageTitle(ADMIN_PATHS.settings)).toBe("Settings");
  });
});

describe("isAdminNavItemActive", (): void => {
  it("treats the admin home path as exact-only", (): void => {
    expect(isAdminNavItemActive("/admin", ADMIN_PATHS.home)).toBe(true);
    expect(isAdminNavItemActive("/admin/quotes", ADMIN_PATHS.home)).toBe(false);
    expect(isAdminNavItemActive("/admin/quotes/123", ADMIN_PATHS.home)).toBe(
      false,
    );
  });

  it("keeps nested admin routes on the parent item", (): void => {
    expect(isAdminNavItemActive("/admin/quotes", ADMIN_PATHS.quotes)).toBe(
      true,
    );
    expect(isAdminNavItemActive("/admin/quotes/123", ADMIN_PATHS.quotes)).toBe(
      true,
    );
    expect(
      isAdminNavItemActive("/admin/quotes-archive", ADMIN_PATHS.quotes),
    ).toBe(false);
    expect(isAdminNavItemActive("/admin/contacts", ADMIN_PATHS.quotes)).toBe(
      false,
    );
    expect(isAdminNavItemActive("/admin/bookings", ADMIN_PATHS.bookings)).toBe(
      true,
    );
    expect(
      isAdminNavItemActive("/admin/bookings/123", ADMIN_PATHS.bookings),
    ).toBe(true);
    expect(
      isAdminNavItemActive("/admin/customers", ADMIN_PATHS.customers),
    ).toBe(true);
    expect(
      isAdminNavItemActive("/admin/customers/123", ADMIN_PATHS.customers),
    ).toBe(true);
    expect(isAdminNavItemActive("/admin/services", ADMIN_PATHS.services)).toBe(
      true,
    );
    expect(
      isAdminNavItemActive("/admin/services/123", ADMIN_PATHS.services),
    ).toBe(true);
    expect(isAdminNavItemActive("/admin/reviews", ADMIN_PATHS.reviews)).toBe(
      true,
    );
    expect(
      isAdminNavItemActive("/admin/reviews/123", ADMIN_PATHS.reviews),
    ).toBe(true);
    expect(
      isAdminNavItemActive("/admin/notifications", ADMIN_PATHS.notifications),
    ).toBe(true);
    expect(isAdminNavItemActive("/admin/settings", ADMIN_PATHS.settings)).toBe(
      true,
    );
  });
});

describe("adminNavigation", (): void => {
  it("covers admin sections without dummy counts", (): void => {
    const items = getAdminNavItems();
    const hrefs = items.map((item) => item.href);

    expect(adminNavigation.map((group) => group.id)).toEqual([
      "overview",
      "operations",
      "content",
      "system",
    ]);
    expect(hrefs).toEqual([
      ADMIN_PATHS.home,
      ADMIN_PATHS.bookings,
      ADMIN_PATHS.customers,
      ADMIN_PATHS.quotes,
      ADMIN_PATHS.contacts,
      ADMIN_PATHS.services,
      ADMIN_PATHS.portfolio,
      ADMIN_PATHS.reviews,
      ADMIN_PATHS.blog,
      ADMIN_PATHS.newsletter,
      ADMIN_PATHS.notifications,
      ADMIN_PATHS.settings,
    ]);
    expect(items.some((item) => /\d/.test(item.label))).toBe(false);
  });
});
