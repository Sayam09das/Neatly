/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminCustomersPage from "@/app/admin/(app)/customers/page";
import { AdminCustomers } from "@/components/admin/customers/admin-customers";
import { CustomerCard } from "@/components/admin/customers/customer-card";
import { CustomerStatusBadge } from "@/components/admin/customers/customer-status-badge";
import { CustomersPagination } from "@/components/admin/customers/customers-pagination";
import {
  ADMIN_CUSTOMER_DETAILS_PATH,
  adminCustomerCopy,
  getAdminCustomerDetailsPath,
} from "@/config/admin-customers";
import { ADMIN_PATHS } from "@/config/admin-nav";
import type { AdminCustomer } from "@/types/admin-customer";

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

vi.mock("@/lib/admin/customers", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/customers")>();

  return {
    ...actual,
    listAdminCustomers: vi.fn().mockResolvedValue({
      data: {
        customers: [],
        pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
      },
      ok: true,
      status: 200,
    }),
  };
});

const TEST_CUSTOMER: AdminCustomer = {
  address: null,
  avatarUrl: null,
  bookingCount: null,
  email: null,
  id: "customer_test",
  joinedAt: null,
  name: null,
  phone: null,
  statusLabel: null,
};

const FORBIDDEN_FAKE_CUSTOMER_COPY = [
  "John Doe",
  "Jane Smith",
  "Rahul Das",
  "john@example.com",
  "+1 555",
  "12 bookings",
  "5 bookings",
  "0 bookings",
];

describe("Admin customers page", (): void => {
  it("renders the title, search, filters, and empty state without fake customers", async (): Promise<void> => {
    render(<AdminCustomersPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminCustomerCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminCustomerCopy.description)).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: adminCustomerCopy.searchLabel }),
    ).toHaveAttribute("placeholder", adminCustomerCopy.searchPlaceholder);
    expect(
      screen.getByLabelText(adminCustomerCopy.joinedFromLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(adminCustomerCopy.joinedToLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminCustomerCopy.filtersLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: adminCustomerCopy.primaryAction })
        .length,
    ).toBeGreaterThan(0);
    await waitFor((): void => {
      expect(
        screen.getByText(adminCustomerCopy.emptyTitle),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(adminCustomerCopy.emptyDescription),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", {
        name: adminCustomerCopy.paginationLabel,
      }),
    ).not.toBeInTheDocument();

    const markup = document.body.textContent ?? "";

    for (const phrase of FORBIDDEN_FAKE_CUSTOMER_COPY) {
      expect(markup).not.toContain(phrase);
    }
  });

  it("renders loading, error, and retry-ready states", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(
      <AdminCustomers presentation={{ status: "loading" }} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByText(adminCustomerCopy.loadingLabel),
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);

    rerender(
      <AdminCustomers
        presentation={{
          onRetry,
          status: "error",
        }}
      />,
    );

    expect(screen.getByText(adminCustomerCopy.errorTitle)).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminCustomerCopy.retryLabel }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders table structure, mobile cards, and accessible actions for supplied rows", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminCustomers
        presentation={{
          customers: [TEST_CUSTOMER],
          status: "ready",
        }}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: adminCustomerCopy.tableCustomer,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(adminCustomerCopy.emptyValue).length,
    ).toBeGreaterThan(0);
    expect(document.querySelector('[data-slot="customer-card"]')).toBeTruthy();
    expect(
      document.querySelector('[data-slot="customer-avatar"]'),
    ).toBeTruthy();

    const actionButton = screen.getAllByRole("button", {
      name: adminCustomerCopy.actionsLabel,
    })[0];

    if (actionButton === undefined) {
      throw new Error("Expected a customer actions trigger.");
    }

    await user.click(actionButton);

    expect(
      await screen.findByRole("menuitem", {
        name: adminCustomerCopy.viewAction,
      }),
    ).toHaveAttribute("data-disabled");
    expect(
      screen.getAllByText(adminCustomerCopy.comingSoonHint).length,
    ).toBeGreaterThan(0);
  });

  it("opens filter and create dialogs without creating customers", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminCustomers presentation={{ status: "empty" }} />);

    await user.click(
      screen.getByRole("button", { name: adminCustomerCopy.filtersLabel }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: adminCustomerCopy.filterSheetTitle,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminCustomerCopy.statusEmpty)).toBeInTheDocument();
    expect(
      screen.getByText(adminCustomerCopy.activityEmpty),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(
        screen.queryByRole("dialog", {
          name: adminCustomerCopy.filterSheetTitle,
        }),
      ).not.toBeInTheDocument();
    });

    const createButton = screen.getAllByRole("button", {
      name: adminCustomerCopy.primaryAction,
    })[0];

    if (createButton === undefined) {
      throw new Error("Expected an Add customer action.");
    }

    await user.click(createButton);

    expect(
      await screen.findByRole("dialog", {
        name: adminCustomerCopy.createTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminCustomerCopy.createDescription),
    ).toBeInTheDocument();
    expect(screen.queryByText(TEST_CUSTOMER.id)).not.toBeInTheDocument();
  });

  it("shows filter chips and clear filters only when filters are active", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminCustomers presentation={{ status: "empty" }} />);

    expect(
      screen.queryByRole("button", { name: adminCustomerCopy.clearFilters }),
    ).not.toBeInTheDocument();

    await user.type(
      screen.getByRole("searchbox", { name: adminCustomerCopy.searchLabel }),
      "customer_test",
    );

    expect(
      screen.getByRole("button", {
        name: `Remove ${adminCustomerCopy.searchLabel}: customer_test`,
      }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminCustomerCopy.clearFilters }),
    );
    await waitFor((): void => {
      expect(
        screen.queryByRole("button", { name: adminCustomerCopy.clearFilters }),
      ).not.toBeInTheDocument();
    });
  });
});

describe("Customer presentation components", (): void => {
  it("renders supplied status text and a neutral empty status", (): void => {
    const { rerender } = render(<CustomerStatusBadge label={null} />);

    expect(screen.getByText(adminCustomerCopy.emptyValue)).toBeInTheDocument();

    rerender(<CustomerStatusBadge label="Lead" />);
    expect(screen.getByText("Lead")).toBeInTheDocument();
  });

  it("renders a compact customer card for supplied data", (): void => {
    render(<CustomerCard customer={TEST_CUSTOMER} />);

    expect(
      screen.getByText(adminCustomerCopy.tableBookings),
    ).toBeInTheDocument();
    expect(screen.getByText(adminCustomerCopy.tableJoined)).toBeInTheDocument();
    expect(
      screen.getAllByText(adminCustomerCopy.emptyValue).length,
    ).toBeGreaterThan(0);
  });

  it("renders pagination architecture without inventing pages on empty data", (): void => {
    render(
      <CustomersPagination
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
        name: adminCustomerCopy.paginationLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: adminCustomerCopy.paginationPrevious,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: `${adminCustomerCopy.paginationPageLabel} 2`,
      }),
    ).toBeInTheDocument();
  });

  it("keeps the details path as a future route placeholder", (): void => {
    expect(ADMIN_PATHS.customers).toBe("/admin/customers");
    expect(ADMIN_CUSTOMER_DETAILS_PATH).toBe("/admin/customers/[id]");
    expect(getAdminCustomerDetailsPath("customer_test")).toBe(
      "/admin/customers/customer_test",
    );
  });
});
