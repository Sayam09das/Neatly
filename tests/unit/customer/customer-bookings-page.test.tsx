/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CustomerBookings } from "@/components/customer/bookings/customer-bookings";
import {
  CUSTOMER_PATHS,
  customerBookingDetailPath,
  customerBookingsCopy,
  customerDashboardCopy,
  customerEmptyCopy,
} from "@/config/customer";
import type { CustomerBookingsQuery } from "@/lib/customer/booking";
import type { CustomerBookingList } from "@/types/customer";

const emptyQuery: CustomerBookingsQuery = {
  page: 1,
  q: "",
  status: "",
  window: "",
};

const booking = {
  actions: { canCancel: true, canUpdate: true },
  id: "booking_own_1",
  linkedToQuote: false,
  notes: null,
  scheduledAt: "2026-09-04T10:00:00.000Z",
  service: { id: "service_1", name: "Home Refresh" },
  serviceAddress: "12 Harbour Street",
  status: "CONFIRMED" as const,
};

describe("CustomerBookings", (): void => {
  it("shows the empty state with a real services action", (): void => {
    render(
      <CustomerBookings
        list={{
          items: [],
          pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
        }}
        query={emptyQuery}
      />,
    );

    expect(
      screen.getByRole("heading", { name: customerEmptyCopy.bookings.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: customerDashboardCopy.servicesAction }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.dashboardServices);
    expect(screen.queryByText("booking_#")).not.toBeInTheDocument();
  });

  it("shows a filtered empty state instead of the global empty copy", (): void => {
    render(
      <CustomerBookings
        list={{
          items: [],
          pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
        }}
        query={{ ...emptyQuery, status: "COMPLETED" }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: customerBookingsCopy.filteredEmptyTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: customerBookingsCopy.clearFilters }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.bookings);
    expect(
      screen.queryByRole("heading", { name: customerEmptyCopy.bookings.title }),
    ).not.toBeInTheDocument();
  });

  it("lists a customer booking with status, service, and a detail link", (): void => {
    const list: CustomerBookingList = {
      items: [booking],
      pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
    };

    render(<CustomerBookings list={list} query={emptyQuery} />);

    expect(screen.getAllByText("Home Refresh").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Confirmed").length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", {
        name: customerBookingsCopy.viewBooking,
      })[0],
    ).toHaveAttribute("href", customerBookingDetailPath(booking.id));
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    expect(
      screen.getByLabelText(customerBookingsCopy.searchLabel),
    ).toBeInTheDocument();
  });
});
