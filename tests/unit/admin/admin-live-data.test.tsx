/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminDashboardLive } from "@/components/admin/admin-dashboard-live";
import { AdminBookings } from "@/components/admin/bookings/admin-bookings";
import { AdminCustomers } from "@/components/admin/customers/admin-customers";
import { AdminNotifications } from "@/components/admin/notifications/admin-notifications";
import { AdminReviews } from "@/components/admin/reviews/admin-reviews";
import { AdminServices } from "@/components/admin/services/admin-services";
import { adminBookingCopy } from "@/config/admin-bookings";
import { adminCustomerCopy } from "@/config/admin-customers";
import { adminDashboardCopy } from "@/config/admin-dashboard";
import { adminNotificationCopy } from "@/config/admin-notifications";
import { adminReviewCopy } from "@/config/admin-reviews";
import { adminServiceCopy } from "@/config/admin-services";
import { listAdminBookings } from "@/lib/admin/bookings";
import { listAdminCustomers } from "@/lib/admin/customers";
import { getAdminDashboard } from "@/lib/admin/dashboard";
import { listAdminNotifications } from "@/lib/admin/notifications";
import { listAdminReviews } from "@/lib/admin/reviews";
import { listAdminServices } from "@/lib/admin/services";
import { handleAdminApiFailure } from "@/lib/admin/session";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/customers",
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

vi.mock("@/lib/admin/dashboard", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/dashboard")>();
  return { ...actual, getAdminDashboard: vi.fn() };
});

vi.mock("@/lib/admin/customers", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/customers")>();
  return { ...actual, listAdminCustomers: vi.fn() };
});

vi.mock("@/lib/admin/bookings", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/bookings")>();
  return {
    ...actual,
    listAdminBookingFilterCatalog: vi.fn().mockResolvedValue({
      data: { cleaners: [], customers: [], services: [] },
      ok: true,
      status: 200,
    }),
    listAdminBookings: vi.fn(),
  };
});

vi.mock("@/lib/admin/services", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/services")>();
  return { ...actual, listAdminServices: vi.fn() };
});

vi.mock("@/lib/admin/reviews", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/reviews")>();
  return { ...actual, listAdminReviews: vi.fn() };
});

vi.mock("@/lib/admin/notifications", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/admin/notifications")>();
  return { ...actual, listAdminNotifications: vi.fn() };
});

vi.mock("@/lib/admin/session", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/session")>();
  return { ...actual, handleAdminApiFailure: vi.fn() };
});

const emptyPagination = {
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
} as const;

const apiFailure = {
  code: "INTERNAL_ERROR" as const,
  fields: {},
  forbidden: false,
  message: "Unable to complete this request. Please try again.",
  ok: false as const,
  status: 500,
  unauthorized: false,
};

describe("Admin live API surfaces", (): void => {
  it("loads dashboard metrics from the API and never invents growth", async (): Promise<void> => {
    vi.mocked(getAdminDashboard).mockResolvedValue({
      data: {
        bookings: {
          assigned: 0,
          cancelled: 0,
          completed: 0,
          confirmed: 0,
          inProgress: 0,
          pending: 1,
          total: 4,
        },
        cleaners: { active: 1, total: 1 },
        customers: { active: 3, total: 6 },
        recentBookings: [],
        recentCustomers: [],
        reviews: { active: 2, total: 2 },
        services: { active: 5, total: 5 },
      },
      ok: true,
      status: 200,
    });

    render(<AdminDashboardLive />);

    await waitFor((): void => {
      expect(screen.getByText("6")).toBeInTheDocument();
    });
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3 active")).toBeInTheDocument();
    expect(screen.queryByText(/\+12/)).not.toBeInTheDocument();
    expect(screen.queryByText(/revenue/i)).not.toBeInTheDocument();
    expect(getAdminDashboard).toHaveBeenCalledTimes(1);
  });

  it("renders customers, bookings, services, reviews, and notifications from API data", async (): Promise<void> => {
    vi.mocked(listAdminCustomers).mockResolvedValue({
      data: {
        customers: [
          {
            address: null,
            avatarUrl: null,
            bookingCount: 2,
            email: "ada@neatly.test",
            id: "cus_live",
            joinedAt: "2026-03-01T12:00:00.000Z",
            name: "Ada Lovelace",
            phone: null,
            statusLabel: "Active",
          },
        ],
        pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      },
      ok: true,
      status: 200,
    });
    vi.mocked(listAdminBookings).mockResolvedValue({
      data: {
        bookings: [
          {
            cleanerId: null,
            cleanerName: null,
            customerId: "cus_live",
            customerName: "Ada Lovelace",
            id: "bkg_live",
            notes: null,
            scheduledAt: "2026-04-01T09:00:00.000Z",
            serviceAddress: null,
            serviceId: "svc_live",
            serviceName: "Kitchen reset",
            status: "PENDING",
          },
        ],
        pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      },
      ok: true,
      status: 200,
    });
    vi.mocked(listAdminServices).mockResolvedValue({
      data: {
        pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
        services: [
          {
            coverImageUrl: null,
            fullDescription: "Full kitchen reset.",
            id: "svc_live",
            isActive: true,
            name: "Kitchen reset",
            shortDescription: "Reset a kitchen after a move.",
            slug: "kitchen-reset",
          },
        ],
      },
      ok: true,
      status: 200,
    });
    vi.mocked(listAdminReviews).mockResolvedValue({
      data: {
        pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
        reviews: [
          {
            content: "The crew was punctual and careful.",
            createdAt: "2026-03-12T10:00:00.000Z",
            customerName: "Ada Lovelace",
            customerRole: null,
            id: "rev_live",
            isActive: true,
            isFeatured: false,
            rating: 5,
            serviceCategory: "RESIDENTIAL",
          },
        ],
      },
      ok: true,
      status: 200,
    });
    vi.mocked(listAdminNotifications).mockResolvedValue({
      data: {
        notifications: [
          {
            createdAt: "2026-03-12T10:00:00.000Z",
            id: "ntf_live",
            isRead: false,
            message: "A customer booked Kitchen reset.",
            relatedHref: null,
            relatedLabel: null,
            title: "Booking created",
          },
        ],
        pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      },
      ok: true,
      status: 200,
    });

    const { unmount } = render(<AdminCustomers />);
    await waitFor((): void => {
      expect(screen.getAllByText("Ada Lovelace").length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText("ada@neatly.test").length).toBeGreaterThan(0);
    expect(listAdminCustomers).toHaveBeenCalled();
    unmount();

    const bookingsView = render(<AdminBookings />);
    await waitFor((): void => {
      expect(screen.getAllByText("Kitchen reset").length).toBeGreaterThan(0);
    });
    expect(listAdminBookings).toHaveBeenCalled();
    bookingsView.unmount();

    const servicesView = render(<AdminServices />);
    await waitFor((): void => {
      expect(screen.getAllByText("Kitchen reset").length).toBeGreaterThan(0);
    });
    expect(listAdminServices).toHaveBeenCalled();
    servicesView.unmount();

    const reviewsView = render(<AdminReviews />);
    await waitFor((): void => {
      expect(
        screen.getAllByText("The crew was punctual and careful.").length,
      ).toBeGreaterThan(0);
    });
    expect(listAdminReviews).toHaveBeenCalled();
    reviewsView.unmount();

    render(<AdminNotifications />);
    await waitFor((): void => {
      expect(screen.getAllByText("Booking created").length).toBeGreaterThan(0);
    });
    expect(listAdminNotifications).toHaveBeenCalled();
  });

  it("shows an empty state for a successful empty API response", async (): Promise<void> => {
    vi.mocked(listAdminCustomers).mockResolvedValue({
      data: { customers: [], pagination: emptyPagination },
      ok: true,
      status: 200,
    });

    render(<AdminCustomers />);

    await waitFor((): void => {
      expect(
        screen.getByText(adminCustomerCopy.emptyTitle),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByText(adminCustomerCopy.errorTitle),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
  });

  it("shows an error state when the API fails and does not fall back to fake rows", async (): Promise<void> => {
    vi.mocked(listAdminCustomers).mockResolvedValue(apiFailure);
    vi.mocked(listAdminBookings).mockResolvedValue(apiFailure);
    vi.mocked(listAdminServices).mockResolvedValue(apiFailure);
    vi.mocked(listAdminReviews).mockResolvedValue(apiFailure);
    vi.mocked(listAdminNotifications).mockResolvedValue(apiFailure);
    vi.mocked(getAdminDashboard).mockResolvedValue(apiFailure);

    const customersView = render(<AdminCustomers />);
    await waitFor((): void => {
      expect(
        screen.getByText(adminCustomerCopy.errorTitle),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByText(adminCustomerCopy.emptyTitle),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    customersView.unmount();

    const bookingsView = render(<AdminBookings />);
    await waitFor((): void => {
      expect(screen.getByText(adminBookingCopy.errorTitle)).toBeInTheDocument();
    });
    expect(
      screen.queryByText(adminBookingCopy.emptyTitle),
    ).not.toBeInTheDocument();
    bookingsView.unmount();

    const servicesView = render(<AdminServices />);
    await waitFor((): void => {
      expect(screen.getByText(adminServiceCopy.errorTitle)).toBeInTheDocument();
    });
    servicesView.unmount();

    const reviewsView = render(<AdminReviews />);
    await waitFor((): void => {
      expect(screen.getByText(adminReviewCopy.errorTitle)).toBeInTheDocument();
    });
    reviewsView.unmount();

    const notificationsView = render(<AdminNotifications />);
    await waitFor((): void => {
      expect(
        screen.getByText(adminNotificationCopy.errorTitle),
      ).toBeInTheDocument();
    });
    notificationsView.unmount();

    render(<AdminDashboardLive />);
    await waitFor((): void => {
      expect(
        screen.getAllByText(adminDashboardCopy.errorTitle).length,
      ).toBeGreaterThan(0);
    });
    expect(screen.queryByText("96%")).not.toBeInTheDocument();
  });

  it("treats 403 as a page error and 401 as session handling", async (): Promise<void> => {
    vi.mocked(listAdminCustomers)
      .mockResolvedValueOnce({
        code: "FORBIDDEN",
        fields: {},
        forbidden: true,
        message: "You do not have access.",
        ok: false,
        status: 403,
        unauthorized: false,
      })
      .mockResolvedValueOnce({
        code: "UNAUTHORIZED",
        fields: {},
        forbidden: false,
        message: "Session expired",
        ok: false,
        status: 401,
        unauthorized: true,
      });

    const forbiddenView = render(<AdminCustomers />);
    await waitFor((): void => {
      expect(
        screen.getByText(adminCustomerCopy.errorTitle),
      ).toBeInTheDocument();
    });
    expect(handleAdminApiFailure).toHaveBeenCalledWith(
      expect.objectContaining({ forbidden: true, status: 403 }),
    );
    forbiddenView.unmount();

    render(<AdminCustomers />);
    await waitFor((): void => {
      expect(handleAdminApiFailure).toHaveBeenCalledWith(
        expect.objectContaining({ unauthorized: true, status: 401 }),
      );
    });
    expect(screen.getByText(adminCustomerCopy.errorTitle)).toBeInTheDocument();
  });
});
