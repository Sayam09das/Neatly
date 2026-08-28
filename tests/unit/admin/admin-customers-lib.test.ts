import { describe, expect, it } from "vitest";
import {
  adminCustomerCopy,
  defaultAdminCustomerFilters,
} from "@/config/admin-customers";
import {
  filterCustomers,
  formatCustomerJoinedDate,
  getCustomerBookingCountLabel,
  getCustomerInitials,
  hasActiveCustomerFilters,
  shouldRenderCustomerPagination,
} from "@/lib/admin/customers";
import type { AdminCustomer } from "@/types/admin-customer";

const CUSTOMER: AdminCustomer = {
  avatarUrl: null,
  bookingCount: null,
  email: "alpha@test.local",
  id: "customer_alpha",
  joinedAt: "2026-03-12T10:00:00.000Z",
  name: "Alpha Beta",
  phone: null,
  statusLabel: null,
};

describe("filterCustomers", (): void => {
  it("filters supplied customers only and never invents rows", (): void => {
    expect(filterCustomers([], defaultAdminCustomerFilters)).toEqual([]);
    expect(
      filterCustomers([CUSTOMER], {
        ...defaultAdminCustomerFilters,
        query: "missing",
      }),
    ).toEqual([]);
    expect(
      filterCustomers([CUSTOMER], {
        ...defaultAdminCustomerFilters,
        query: "customer_alpha",
      }),
    ).toEqual([CUSTOMER]);
    expect(
      filterCustomers([CUSTOMER], {
        ...defaultAdminCustomerFilters,
        joinedFrom: "2026-03-12",
        joinedTo: "2026-03-12",
      }),
    ).toEqual([CUSTOMER]);
  });
});

describe("customer presentation helpers", (): void => {
  it("formats supplied dates and keeps empty values neutral", (): void => {
    expect(formatCustomerJoinedDate(null)).toBe(adminCustomerCopy.emptyValue);
    expect(formatCustomerJoinedDate("not-a-date")).toBe(
      adminCustomerCopy.emptyValue,
    );
    expect(formatCustomerJoinedDate(CUSTOMER.joinedAt)).not.toBe(
      adminCustomerCopy.emptyValue,
    );
    expect(getCustomerBookingCountLabel(null)).toBe(
      adminCustomerCopy.emptyValue,
    );
    expect(getCustomerBookingCountLabel(0)).toBe("0");
  });

  it("builds initials only from a supplied name", (): void => {
    expect(getCustomerInitials(null)).toBeNull();
    expect(getCustomerInitials("   ")).toBeNull();
    expect(getCustomerInitials("Alpha")).toBe("AL");
    expect(getCustomerInitials("Alpha Beta")).toBe("AB");
  });

  it("detects active filters and hides pagination without data", (): void => {
    expect(hasActiveCustomerFilters(defaultAdminCustomerFilters)).toBe(false);
    expect(
      hasActiveCustomerFilters({
        ...defaultAdminCustomerFilters,
        query: "customer_alpha",
      }),
    ).toBe(true);
    expect(shouldRenderCustomerPagination(undefined, 0)).toBe(false);
    expect(
      shouldRenderCustomerPagination(
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
      shouldRenderCustomerPagination(
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
