/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CustomerDashboardOverview } from "@/components/customer/dashboard/customer-dashboard-overview";
import {
  CUSTOMER_PATHS,
  customerBookingDetailPath,
  customerDashboardCopy,
} from "@/config/customer";
import type { CustomerOverview } from "@/types/customer";

const identity = {
  email: "ada@neatly.example",
  name: "Ada Lovelace",
};

const upcoming = {
  actions: { canCancel: true, canUpdate: true },
  id: "booking_own_1",
  linkedToQuote: false,
  notes: null,
  scheduledAt: "2026-09-04T10:00:00.000Z",
  service: { id: "service_1", name: "Home Refresh" },
  serviceAddress: "12 Harbour Street",
  status: "PENDING" as const,
};

describe("CustomerDashboardOverview", (): void => {
  it("shows a named greeting and empty upcoming state from real counts", (): void => {
    const overview: CustomerOverview = {
      recentBookings: [],
      summary: { completed: 0, pending: 0, total: 0, upcoming: 0 },
      upcomingBooking: null,
    };

    render(
      <CustomerDashboardOverview identity={identity} overview={overview} />,
    );

    expect(
      screen.getByRole("heading", { name: "Welcome, Ada" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(customerDashboardCopy.nextBookingEmptyTitle),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", {
        name: customerDashboardCopy.nextBookingEmptyAction,
      })[0],
    ).toHaveAttribute("href", CUSTOMER_PATHS.dashboardServices);
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText(/\$4,250/)).not.toBeInTheDocument();
  });

  it("renders the upcoming booking and pending attention from backend data", (): void => {
    const overview: CustomerOverview = {
      recentBookings: [upcoming],
      summary: { completed: 0, pending: 1, total: 1, upcoming: 1 },
      upcomingBooking: upcoming,
    };

    render(
      <CustomerDashboardOverview identity={identity} overview={overview} />,
    );

    expect(screen.getAllByText("Home Refresh").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", {
        name: customerDashboardCopy.viewBooking,
      })[0],
    ).toHaveAttribute("href", customerBookingDetailPath(upcoming.id));
    expect(
      screen.getByRole("heading", {
        name: customerDashboardCopy.attentionHeading,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    expect(screen.queryByText("Reschedule")).not.toBeInTheDocument();
  });
});
