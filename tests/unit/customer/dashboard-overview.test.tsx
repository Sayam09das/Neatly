/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CustomerDashboardOverview } from "@/components/customer/dashboard/customer-dashboard-overview";
import {
  CUSTOMER_PATHS,
  customerBookingDetailPath,
  customerDashboardCopy,
} from "@/config/customer";
import type { CustomerDashboardWorkspace } from "@/lib/customer/dashboard";
import type { CustomerOverview, CustomerQuoteView } from "@/types/customer";

vi.mock("@/lib/customer/refresh", () => ({
  useCustomerRefresh: (): (() => void) => (): void => undefined,
}));

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

const emptyOverview: CustomerOverview = {
  recentBookings: [],
  summary: { completed: 0, pending: 0, total: 0, upcoming: 0 },
  upcomingBooking: null,
};

const emptyQuotes = {
  items: [] as CustomerQuoteView[],
  pagination: { limit: 20, page: 1, total: 0, totalPages: 0 },
};

function workspaceFrom(
  overview: CustomerOverview | null,
  extras: Partial<CustomerDashboardWorkspace> = {},
): CustomerDashboardWorkspace {
  return {
    accountVerified: true,
    notifications: {
      data: { items: [], unreadCount: 0 },
      status: "ready",
    },
    overview,
    quotes: { data: emptyQuotes, status: "ready" },
    unauthorized: false,
    ...extras,
  };
}

describe("CustomerDashboardOverview", (): void => {
  it("shows a named greeting and empty start state without fake metrics", (): void => {
    render(
      <CustomerDashboardOverview
        identity={identity}
        workspace={workspaceFrom(emptyOverview)}
      />,
    );

    expect(screen.getByRole("heading", { name: /Ada/ })).toBeInTheDocument();
    expect(
      screen.getByText(customerDashboardCopy.emptyHeading),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", {
        name: customerDashboardCopy.exploreServices,
      })[0],
    ).toHaveAttribute("href", CUSTOMER_PATHS.dashboardServices);
    expect(
      screen.queryByText(customerDashboardCopy.summaryUpcoming),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText(/\$4,250/)).not.toBeInTheDocument();
  });

  it("renders upcoming booking, quotes, and pending attention from backend data", (): void => {
    const quote: CustomerQuoteView = {
      additionalNotes: null,
      approximateSize: "1,000-2,000 sq ft",
      bathrooms: 1,
      bedrooms: 2,
      createdAt: "2026-08-30T10:00:00.000Z",
      email: "ada@neatly.example",
      frequency: "ONE_TIME",
      fullName: "Ada Lovelace",
      id: "quote_own_1",
      phone: "9876543210",
      preferredDate: "2026-09-04T00:00:00.000Z",
      preferredTime: "Morning (8am-12pm)",
      propertyType: "APARTMENT",
      serviceAddress: "12 Harbour Street",
      serviceId: null,
      serviceType: "RESIDENTIAL",
      status: "NEW",
    };

    render(
      <CustomerDashboardOverview
        identity={identity}
        workspace={workspaceFrom(
          {
            recentBookings: [upcoming],
            summary: { completed: 0, pending: 1, total: 1, upcoming: 1 },
            upcomingBooking: upcoming,
          },
          {
            quotes: {
              data: {
                items: [quote],
                pagination: { limit: 20, page: 1, total: 1, totalPages: 1 },
              },
              status: "ready",
            },
          },
        )}
      />,
    );

    expect(screen.getAllByText("Home Refresh").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
    expect(screen.getAllByText("12 Harbour Street").length).toBeGreaterThan(0);
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
    expect(
      screen.getByRole("heading", {
        name: customerDashboardCopy.quotesHeading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Residential")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: customerDashboardCopy.quotesViewAll }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.quotes);
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    expect(screen.queryByText("Reschedule")).not.toBeInTheDocument();
  });

  it("keeps an isolated quotes error without inventing quote records", (): void => {
    render(
      <CustomerDashboardOverview
        identity={identity}
        workspace={workspaceFrom(
          {
            recentBookings: [upcoming],
            summary: { completed: 0, pending: 0, total: 1, upcoming: 1 },
            upcomingBooking: upcoming,
          },
          { quotes: { status: "error" } },
        )}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: customerDashboardCopy.quotesHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(customerDashboardCopy.quotesError),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(customerDashboardCopy.summaryPending),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Residential")).not.toBeInTheDocument();
  });
});
