/** @vitest-environment jsdom */

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminServicesPage from "@/app/admin/(app)/services/page";
import { AdminServices } from "@/components/admin/services/admin-services";
import { ServiceCard } from "@/components/admin/services/service-card";
import { ServiceStatusBadge } from "@/components/admin/services/service-status-badge";
import { ServicesPagination } from "@/components/admin/services/services-pagination";
import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  ADMIN_SERVICE_DETAILS_PATH,
  adminServiceCopy,
  adminServiceStatusLabels,
  getAdminServiceDetailsPath,
} from "@/config/admin-services";
import type { AdminService } from "@/types/admin-service";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/services",
}));

const TEST_SERVICE: AdminService = {
  coverImageUrl: null,
  id: "service_test",
  isActive: null,
  name: null,
  shortDescription: null,
  slug: null,
};

const FORBIDDEN_FAKE_SERVICE_COPY = [
  "Residential cleaning",
  "Deep cleaning",
  "Commercial cleaning",
  "$99",
  "2 hours",
  "3 hours",
  "90 minutes",
  "12 bookings",
];

describe("Admin services page", (): void => {
  it("renders the title, search, filters, and empty state without fake services", (): void => {
    render(<AdminServicesPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminServiceCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminServiceCopy.description)).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: adminServiceCopy.searchLabel }),
    ).toHaveAttribute("placeholder", adminServiceCopy.searchPlaceholder);
    expect(
      screen.getAllByLabelText(adminServiceCopy.statusLabel).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: adminServiceCopy.filtersLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: adminServiceCopy.primaryAction })
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getByText(adminServiceCopy.emptyTitle)).toBeInTheDocument();
    expect(
      screen.getByText(adminServiceCopy.emptyDescription),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", {
        name: adminServiceCopy.paginationLabel,
      }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Archived")).not.toBeInTheDocument();

    const markup = document.body.textContent ?? "";

    for (const phrase of FORBIDDEN_FAKE_SERVICE_COPY) {
      expect(markup).not.toContain(phrase);
    }
  });

  it("renders loading, error, and retry-ready states", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(
      <AdminServices presentation={{ status: "loading" }} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(adminServiceCopy.loadingLabel)).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);

    rerender(
      <AdminServices
        presentation={{
          onRetry,
          status: "error",
        }}
      />,
    );

    expect(screen.getByText(adminServiceCopy.errorTitle)).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminServiceCopy.retryLabel }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders table structure, mobile cards, and accessible actions for supplied rows", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminServices
        presentation={{
          services: [TEST_SERVICE],
          status: "ready",
        }}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: adminServiceCopy.tableService,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(adminServiceCopy.emptyValue).length,
    ).toBeGreaterThan(0);
    expect(document.querySelector('[data-slot="service-card"]')).toBeTruthy();
    expect(document.querySelector('[data-slot="service-media"]')).toBeTruthy();

    const actionButton = screen.getAllByRole("button", {
      name: adminServiceCopy.actionsLabel,
    })[0];

    if (actionButton === undefined) {
      throw new Error("Expected a service actions trigger.");
    }

    await user.click(actionButton);

    expect(
      await screen.findByRole("menuitem", {
        name: adminServiceCopy.viewAction,
      }),
    ).toHaveAttribute("data-disabled");
    expect(
      screen.getByText(adminServiceCopy.comingSoonHint),
    ).toBeInTheDocument();
  });

  it("opens filter and create dialogs without creating services", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminServices presentation={{ status: "empty" }} />);

    await user.click(
      screen.getByRole("button", { name: adminServiceCopy.filtersLabel }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: adminServiceCopy.filterSheetTitle,
      }),
    ).toBeInTheDocument();

    const filterDialog = screen.getByRole("dialog", {
      name: adminServiceCopy.filterSheetTitle,
    });

    expect(
      within(filterDialog).getByRole("option", {
        name: adminServiceStatusLabels.active,
      }),
    ).toBeInTheDocument();
    expect(
      within(filterDialog).getByRole("option", {
        name: adminServiceStatusLabels.inactive,
      }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(
        screen.queryByRole("dialog", {
          name: adminServiceCopy.filterSheetTitle,
        }),
      ).not.toBeInTheDocument();
    });

    const createButton = screen.getAllByRole("button", {
      name: adminServiceCopy.primaryAction,
    })[0];

    if (createButton === undefined) {
      throw new Error("Expected an Add service action.");
    }

    await user.click(createButton);

    expect(
      await screen.findByRole("dialog", {
        name: adminServiceCopy.createTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminServiceCopy.createDescription),
    ).toBeInTheDocument();
    expect(screen.queryByText(TEST_SERVICE.id)).not.toBeInTheDocument();
  });

  it("shows filter chips and clear filters only when filters are active", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminServices presentation={{ status: "empty" }} />);

    expect(
      screen.queryByRole("button", { name: adminServiceCopy.clearFilters }),
    ).not.toBeInTheDocument();

    await user.type(
      screen.getByRole("searchbox", { name: adminServiceCopy.searchLabel }),
      "service_test",
    );

    expect(
      screen.getByRole("button", {
        name: `Remove ${adminServiceCopy.searchLabel}: service_test`,
      }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminServiceCopy.clearFilters }),
    );
    await waitFor((): void => {
      expect(
        screen.queryByRole("button", { name: adminServiceCopy.clearFilters }),
      ).not.toBeInTheDocument();
    });
  });
});

describe("Service presentation components", (): void => {
  it("renders Active, Inactive, and a neutral empty status as text", (): void => {
    const { rerender } = render(<ServiceStatusBadge isActive={null} />);

    expect(screen.getByText(adminServiceCopy.emptyValue)).toBeInTheDocument();

    rerender(<ServiceStatusBadge isActive={true} />);
    expect(
      screen.getByText(adminServiceStatusLabels.active),
    ).toBeInTheDocument();

    rerender(<ServiceStatusBadge isActive={false} />);
    expect(
      screen.getByText(adminServiceStatusLabels.inactive),
    ).toBeInTheDocument();
  });

  it("renders a compact service card for supplied data", (): void => {
    render(<ServiceCard service={TEST_SERVICE} />);

    expect(
      screen.getAllByText(adminServiceCopy.emptyValue).length,
    ).toBeGreaterThan(0);
    expect(document.querySelector('[data-slot="service-card"]')).toBeTruthy();
  });

  it("renders pagination architecture without inventing pages on empty data", (): void => {
    render(
      <ServicesPagination
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
        name: adminServiceCopy.paginationLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: adminServiceCopy.paginationPrevious,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: `${adminServiceCopy.paginationPageLabel} 2`,
      }),
    ).toBeInTheDocument();
  });

  it("keeps the details path as a future route placeholder", (): void => {
    expect(ADMIN_PATHS.services).toBe("/admin/services");
    expect(ADMIN_SERVICE_DETAILS_PATH).toBe("/admin/services/[id]");
    expect(getAdminServiceDetailsPath("service_test")).toBe(
      "/admin/services/service_test",
    );
  });
});
