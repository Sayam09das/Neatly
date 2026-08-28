import { describe, expect, it } from "vitest";
import { defaultAdminBookingFilters } from "@/config/admin-bookings";
import {
  filterBookings,
  formatBookingSchedule,
  hasActiveBookingFilters,
  shouldRenderBookingPagination,
} from "@/lib/admin/bookings";
import type { AdminBooking } from "@/types/admin-booking";

const BOOKING: AdminBooking = {
  cleanerId: "cleaner_test",
  cleanerName: null,
  customerId: "customer_test",
  customerName: null,
  id: "booking_alpha",
  scheduledAt: "2026-03-12T10:00:00.000Z",
  serviceId: "service_test",
  serviceName: null,
  status: "CONFIRMED",
};

describe("filterBookings", (): void => {
  it("filters supplied bookings only and never invents rows", (): void => {
    expect(filterBookings([], defaultAdminBookingFilters)).toEqual([]);
    expect(
      filterBookings([BOOKING], {
        ...defaultAdminBookingFilters,
        status: "PENDING",
      }),
    ).toEqual([]);
    expect(
      filterBookings([BOOKING], {
        ...defaultAdminBookingFilters,
        query: "booking_alpha",
      }),
    ).toEqual([BOOKING]);
    expect(
      filterBookings([BOOKING], {
        ...defaultAdminBookingFilters,
        scheduledFrom: "2026-03-12",
        scheduledTo: "2026-03-12",
      }),
    ).toEqual([BOOKING]);
  });
});

describe("booking presentation helpers", (): void => {
  it("formats supplied schedules and keeps empty values neutral", (): void => {
    expect(formatBookingSchedule(null)).toBe("—");
    expect(formatBookingSchedule("not-a-date")).toBe("—");
    expect(formatBookingSchedule(BOOKING.scheduledAt)).not.toBe("—");
  });

  it("detects active filters and hides pagination without data", (): void => {
    expect(hasActiveBookingFilters(defaultAdminBookingFilters)).toBe(false);
    expect(
      hasActiveBookingFilters({
        ...defaultAdminBookingFilters,
        query: "booking_alpha",
      }),
    ).toBe(true);
    expect(shouldRenderBookingPagination(undefined, 0)).toBe(false);
    expect(
      shouldRenderBookingPagination(
        {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
        0,
      ),
    ).toBe(false);
    expect(
      shouldRenderBookingPagination(
        {
          page: 1,
          pageSize: 10,
          total: 24,
          totalPages: 3,
        },
        10,
      ),
    ).toBe(true);
  });
});
