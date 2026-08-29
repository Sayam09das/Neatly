import { describe, expect, it } from "vitest";
import { CUSTOMER_PATHS } from "@/config/customer";
import {
  customerBookingsHasFilters,
  customerBookingsHref,
  parseCustomerBookingsSearchParams,
} from "@/lib/customer/booking";

describe("customer booking list query", (): void => {
  it("parses only the allowed filter whitelist", (): void => {
    const query = parseCustomerBookingsSearchParams({
      customerId: "injected",
      page: "2",
      q: "Home",
      status: "CONFIRMED",
      userId: "also-injected",
      window: "upcoming",
    });

    expect(query).toEqual({
      page: 2,
      q: "Home",
      status: "CONFIRMED",
      window: "upcoming",
    });
    expect(customerBookingsHasFilters(query)).toBe(true);
    expect(customerBookingsHref(query)).toBe(
      `${CUSTOMER_PATHS.bookings}?q=Home&status=CONFIRMED&window=upcoming&page=2`,
    );
  });

  it("drops unknown statuses and keeps the unfiltered href clean", (): void => {
    const query = parseCustomerBookingsSearchParams({
      page: "0",
      status: "DELETED",
      window: "later",
    });

    expect(query).toEqual({
      page: 1,
      q: "",
      status: "",
      window: "",
    });
    expect(customerBookingsHasFilters(query)).toBe(false);
    expect(customerBookingsHref(query)).toBe(CUSTOMER_PATHS.bookings);
  });
});
