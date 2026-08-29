/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminBookingsPage from "@/app/admin/(app)/bookings/page";
import { AdminBookings } from "@/components/admin/bookings/admin-bookings";
import { BookingCard } from "@/components/admin/bookings/booking-card";
import { BookingStatusBadge } from "@/components/admin/bookings/booking-status-badge";
import { BookingsPagination } from "@/components/admin/bookings/bookings-pagination";
import {
  ADMIN_BOOKING_DETAILS_PATH,
  adminBookingCopy,
  adminBookingStatusLabels,
  getAdminBookingDetailsPath,
} from "@/config/admin-bookings";
import { ADMIN_PATHS } from "@/config/admin-nav";
import type { AdminBooking } from "@/types/admin-booking";
import { adminBookingStatuses } from "@/types/admin-booking";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/bookings",
  useRouter: (): { replace: () => void } => ({
    replace: (): void => undefined,
  }),
  useSearchParams: (): URLSearchParams => new URLSearchParams(),
}));

vi.mock("@/lib/admin/use-admin-list-state", () => ({
  useAdminListState: <T,>({
    defaults,
  }: {
    defaults: T;
  }): {
    filters: T;
    page: number;
    setFilters: (filters: T) => void;
    setPage: (page: number) => void;
  } => ({
    filters: defaults,
    page: 1,
    setFilters: (): void => undefined,
    setPage: (): void => undefined,
  }),
}));

vi.mock("@/lib/admin/bookings", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/bookings")>();

  return {
    ...actual,
    listAdminBookingFilterCatalog: vi.fn().mockResolvedValue({
      data: { cleaners: [], customers: [], services: [] },
      ok: true,
      status: 200,
    }),
    listAdminBookings: vi.fn().mockResolvedValue({
      data: {
        bookings: [],
        pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
      },
      ok: true,
      status: 200,
    }),
  };
});

const TEST_BOOKING: AdminBooking = {
  cleanerId: null,
  cleanerName: null,
  customerId: null,
  customerName: null,
  id: "booking_test",
  notes: null,
  scheduledAt: null,
  serviceAddress: null,
  serviceId: null,
  serviceName: null,
  status: "PENDING",
};

const FORBIDDEN_FAKE_BOOKING_COPY = [
  "John Smith",
  "Jane Doe",
  "BK-1024",
  "BOOK-1001",
  "₹2,500",
  "Residential Cleaning",
  "Deep Cleaning",
  "Commercial Cleaning",
];

describe("Admin bookings page", (): void => {
  it("renders the title, search, filters, and empty state without fake bookings", async (): Promise<void> => {
    render(<AdminBookingsPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminBookingCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminBookingCopy.description)).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: adminBookingCopy.searchLabel }),
    ).toHaveAttribute("placeholder", adminBookingCopy.searchPlaceholder);
    expect(
      screen.getByRole("combobox", { name: adminBookingCopy.statusLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(adminBookingCopy.dateFromLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(adminBookingCopy.dateToLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminBookingCopy.filtersLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: adminBookingCopy.primaryAction })
        .length,
    ).toBeGreaterThan(0);
    await waitFor((): void => {
      expect(screen.getByText(adminBookingCopy.emptyTitle)).toBeInTheDocument();
    });
    expect(
      screen.getByText(adminBookingCopy.emptyDescription),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", {
        name: adminBookingCopy.paginationLabel,
      }),
    ).not.toBeInTheDocument();

    const markup = document.body.textContent ?? "";

    for (const phrase of FORBIDDEN_FAKE_BOOKING_COPY) {
      expect(markup).not.toContain(phrase);
    }
  });

  it("renders loading, error, and retry-ready states", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(
      <AdminBookings presentation={{ status: "loading" }} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(adminBookingCopy.loadingLabel)).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);

    rerender(
      <AdminBookings
        presentation={{
          onRetry,
          status: "error",
        }}
      />,
    );

    expect(screen.getByText(adminBookingCopy.errorTitle)).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminBookingCopy.retryLabel }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders table structure, mobile cards, and accessible actions for supplied rows", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminBookings
        presentation={{
          bookings: [TEST_BOOKING],
          status: "ready",
        }}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: adminBookingCopy.tableBooking,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(TEST_BOOKING.id).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminBookingCopy.customerEmpty).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminBookingCopy.unassignedCleaner).length,
    ).toBeGreaterThan(0);
    expect(document.querySelector('[data-slot="booking-card"]')).toBeTruthy();

    const actionButton = screen.getAllByRole("button", {
      name: adminBookingCopy.actionsLabel,
    })[0];

    if (actionButton === undefined) {
      throw new Error("Expected a booking actions trigger.");
    }

    await user.click(actionButton);

    expect(
      await screen.findByRole("menuitem", {
        name: adminBookingCopy.viewDetailsAction,
      }),
    ).toHaveAttribute("data-disabled");
    expect(
      screen.getAllByText(adminBookingCopy.comingSoonHint).length,
    ).toBeGreaterThan(0);
  });

  it("opens filter and create dialogs without creating bookings", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminBookings presentation={{ status: "empty" }} />);

    await user.click(
      screen.getByRole("button", { name: adminBookingCopy.filtersLabel }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: adminBookingCopy.filterSheetTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminBookingCopy.filterCleanerEmpty),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminBookingCopy.filterServiceEmpty),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminBookingCopy.filterCustomerEmpty),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(
        screen.queryByRole("dialog", {
          name: adminBookingCopy.filterSheetTitle,
        }),
      ).not.toBeInTheDocument();
    });

    const createButton = screen.getAllByRole("button", {
      name: adminBookingCopy.primaryAction,
    })[0];

    if (createButton === undefined) {
      throw new Error("Expected a New booking action.");
    }

    await user.click(createButton);

    expect(
      await screen.findByRole("dialog", {
        name: adminBookingCopy.createTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminBookingCopy.createDescription),
    ).toBeInTheDocument();
    expect(screen.queryByText(TEST_BOOKING.id)).not.toBeInTheDocument();
  });

  it("shows filter chips and clear filters only when filters are active", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminBookings presentation={{ status: "empty" }} />);

    expect(
      screen.queryByRole("button", { name: adminBookingCopy.clearFilters }),
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: adminBookingCopy.statusLabel }),
      "CONFIRMED",
    );

    expect(
      screen.getByRole("button", {
        name: `Remove ${adminBookingCopy.statusLabel}: ${adminBookingStatusLabels.CONFIRMED}`,
      }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminBookingCopy.clearFilters }),
    );
    await waitFor((): void => {
      expect(
        screen.queryByRole("button", { name: adminBookingCopy.clearFilters }),
      ).not.toBeInTheDocument();
    });
  });
});

describe("Booking presentation components", (): void => {
  it("renders every booking status as text", (): void => {
    const { rerender } = render(
      <BookingStatusBadge status={adminBookingStatuses[0]} />,
    );

    for (const status of adminBookingStatuses) {
      rerender(<BookingStatusBadge status={status} />);
      expect(
        screen.getByText(adminBookingStatusLabels[status]),
      ).toBeInTheDocument();
    }
  });

  it("renders a compact booking card for supplied data", (): void => {
    render(<BookingCard booking={TEST_BOOKING} />);

    expect(screen.getByText(TEST_BOOKING.id)).toBeInTheDocument();
    expect(screen.getByText(adminBookingCopy.tableService)).toBeInTheDocument();
    expect(
      screen.getByText(adminBookingStatusLabels.PENDING),
    ).toBeInTheDocument();
  });

  it("renders pagination architecture without inventing pages on empty data", (): void => {
    render(
      <BookingsPagination
        pagination={{
          page: 1,
          pageSize: 10,
          total: 24,
          totalPages: 3,
        }}
      />,
    );

    expect(
      screen.getByRole("navigation", {
        name: adminBookingCopy.paginationLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminBookingCopy.paginationPrevious }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: `${adminBookingCopy.paginationPageLabel} 2`,
      }),
    ).toBeInTheDocument();
  });

  it("keeps the details path as a future route placeholder", (): void => {
    expect(ADMIN_PATHS.bookings).toBe("/admin/bookings");
    expect(ADMIN_BOOKING_DETAILS_PATH).toBe("/admin/bookings/[id]");
    expect(getAdminBookingDetailsPath("booking_test")).toBe(
      "/admin/bookings/booking_test",
    );
  });
});
