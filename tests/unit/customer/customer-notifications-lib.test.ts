import { describe, expect, it } from "vitest";
import { CUSTOMER_API_PATHS, CUSTOMER_PATHS } from "@/config/customer";
import {
  customerNotificationsHref,
  isCustomerSafeNotificationHref,
  parseCustomerNotificationsSearchParams,
} from "@/lib/customer/notifications";

describe("customer notifications helpers", (): void => {
  it("parses page from the URL without identity query keys", (): void => {
    expect(parseCustomerNotificationsSearchParams({})).toEqual({ page: 1 });
    expect(parseCustomerNotificationsSearchParams({ page: "2" })).toEqual({
      page: 2,
    });
    expect(parseCustomerNotificationsSearchParams({ page: "0" })).toEqual({
      page: 1,
    });
    expect(customerNotificationsHref({ page: 1 })).toBe(
      CUSTOMER_PATHS.notifications,
    );
    expect(customerNotificationsHref({ page: 3 })).toBe(
      `${CUSTOMER_PATHS.notifications}?page=3`,
    );
    expect(CUSTOMER_API_PATHS.notificationsUnreadCount).toBe(
      "/api/v1/customer/notifications/unread-count",
    );
    expect(CUSTOMER_API_PATHS.notificationsStream).toBe(
      "/api/v1/customer/notifications/stream",
    );
    expect(JSON.stringify(CUSTOMER_API_PATHS)).not.toContain("recipientId");
  });

  it("allows only dashboard-relative notification links", (): void => {
    expect(
      isCustomerSafeNotificationHref("/dashboard/bookings/booking_1"),
    ).toBe(true);
    expect(isCustomerSafeNotificationHref("/admin/bookings")).toBe(false);
    expect(
      isCustomerSafeNotificationHref("https://example.com/dashboard"),
    ).toBe(false);
    expect(isCustomerSafeNotificationHref("/dashboard/../admin")).toBe(false);
    expect(isCustomerSafeNotificationHref(null)).toBe(false);
  });
});
