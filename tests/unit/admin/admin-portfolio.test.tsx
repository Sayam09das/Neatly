/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminPortfolioPage from "@/app/admin/(app)/portfolio/page";
import { AdminPortfolio } from "@/components/admin/portfolio/admin-portfolio";
import { PortfolioCard } from "@/components/admin/portfolio/portfolio-card";
import { PortfolioDetails } from "@/components/admin/portfolio/portfolio-details";
import { PortfolioPagination } from "@/components/admin/portfolio/portfolio-pagination";
import { PortfolioStatusBadge } from "@/components/admin/portfolio/portfolio-status-badge";
import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  ADMIN_PORTFOLIO_DETAILS_PATH,
  adminPortfolioCategoryLabels,
  adminPortfolioCopy,
  adminPortfolioVisibilityLabels,
  getAdminPortfolioDetailsPath,
} from "@/config/admin-portfolio";
import type { AdminPortfolioProject } from "@/types/admin-portfolio";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/portfolio",
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

const TEST_PROJECT: AdminPortfolioProject = {
  category: "RESIDENTIAL",
  createdAt: "2026-08-30T09:00:00.000Z",
  description: "A residential refresh for a test property.",
  id: "project_test",
  isFeatured: false,
  isPublished: true,
  location: "Test District",
  slug: "project-alpha",
  sortOrder: 1,
  title: "Project Alpha",
  updatedAt: "2026-08-30T09:00:00.000Z",
};

const FORBIDDEN_FAKE_PORTFOLIO_COPY = [
  "Downtown Loft Deep Clean",
  "North Suburbs",
];

describe("Admin portfolio page", (): void => {
  it("renders the title, search, filters, metrics, and empty state without fake projects", async (): Promise<void> => {
    render(<AdminPortfolioPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminPortfolioCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminPortfolioCopy.description),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: adminPortfolioCopy.searchLabel }),
    ).toHaveAttribute("placeholder", adminPortfolioCopy.searchPlaceholder);
    expect(
      screen.getByRole("combobox", { name: adminPortfolioCopy.categoryLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", {
        name: adminPortfolioCopy.visibilityLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", {
        name: adminPortfolioCopy.dateRangeLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminPortfolioCopy.filtersLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminPortfolioCopy.createAction }),
    ).toBeDisabled();
    expect(
      screen.getByText(adminPortfolioCopy.metricTotal),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(adminPortfolioCopy.metricPublished).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminPortfolioCopy.metricUnpublished).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminPortfolioCopy.metricFeatured).length,
    ).toBeGreaterThan(0);
    await waitFor((): void => {
      expect(
        screen.getByText(adminPortfolioCopy.emptyTitle),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(adminPortfolioCopy.emptyDescription),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", {
        name: adminPortfolioCopy.paginationLabel,
      }),
    ).not.toBeInTheDocument();

    const markup = document.body.textContent ?? "";

    for (const phrase of FORBIDDEN_FAKE_PORTFOLIO_COPY) {
      expect(markup).not.toContain(phrase);
    }
  });

  it("renders loading, error, and retry-ready states", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(
      <AdminPortfolio presentation={{ status: "loading" }} />,
    );

    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    expect(
      screen.getByText(adminPortfolioCopy.loadingLabel),
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);

    rerender(
      <AdminPortfolio
        presentation={{
          onRetry,
          status: "error",
        }}
      />,
    );

    expect(screen.getByText(adminPortfolioCopy.errorTitle)).toBeInTheDocument();
    expect(
      screen.getByText(adminPortfolioCopy.errorDescription),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminPortfolioCopy.retryLabel }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders table structure, mobile cards, and accessible actions for supplied rows", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminPortfolio
        presentation={{
          projects: [TEST_PROJECT],
          status: "ready",
        }}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: adminPortfolioCopy.tableTitle,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(TEST_PROJECT.title).length).toBeGreaterThan(0);
    expect(screen.getAllByText(TEST_PROJECT.slug).length).toBeGreaterThan(0);
    expect(document.querySelector('[data-slot="portfolio-card"]')).toBeTruthy();
    expect(
      screen.getAllByRole("link", { name: adminPortfolioCopy.viewAction })
        .length,
    ).toBeGreaterThan(0);

    const actionButton = screen.getAllByRole("button", {
      name: adminPortfolioCopy.actionsLabel,
    })[0];

    if (actionButton === undefined) {
      throw new Error("Expected a portfolio actions trigger.");
    }

    await user.click(actionButton);

    expect(
      await screen.findByRole("menuitem", {
        name: adminPortfolioCopy.viewAction,
      }),
    ).toHaveAttribute("href", getAdminPortfolioDetailsPath(TEST_PROJECT.id));
    expect(
      screen.getByRole("menuitem", {
        name: adminPortfolioCopy.editAction,
      }),
    ).toHaveAttribute("data-disabled");
  });

  it("opens the filter sheet without inventing project records", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminPortfolio presentation={{ status: "empty" }} />);

    await user.click(
      screen.getByRole("button", { name: adminPortfolioCopy.filtersLabel }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: adminPortfolioCopy.filterSheetTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminPortfolioCopy.filterSheetDescription),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(
        screen.queryByRole("dialog", {
          name: adminPortfolioCopy.filterSheetTitle,
        }),
      ).not.toBeInTheDocument();
    });
    expect(screen.queryByText(TEST_PROJECT.id)).not.toBeInTheDocument();
  });

  it("shows filter chips and clear filters only when filters are active", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminPortfolio presentation={{ status: "empty" }} />);

    expect(
      screen.queryByRole("button", { name: adminPortfolioCopy.clearFilters }),
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: adminPortfolioCopy.visibilityLabel,
      }),
      "published",
    );

    expect(
      screen.getByRole("button", {
        name: `Remove ${adminPortfolioCopy.visibilityLabel}: ${adminPortfolioVisibilityLabels.published}`,
      }),
    ).toBeInTheDocument();
    const clearChip = screen.getAllByRole("button", {
      name: adminPortfolioCopy.clearFilters,
    })[0];

    if (clearChip === undefined) {
      throw new Error("Expected a clear filters action.");
    }

    await user.click(clearChip);
    await waitFor((): void => {
      expect(
        screen.queryByRole("button", {
          name: adminPortfolioCopy.clearFilters,
        }),
      ).not.toBeInTheDocument();
    });
  });

  it("shows the search-empty state when filters hide supplied projects", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminPortfolio
        presentation={{
          projects: [TEST_PROJECT],
          status: "ready",
        }}
      />,
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: adminPortfolioCopy.categoryLabel }),
      "COMMERCIAL",
    );

    expect(
      screen.getByText(adminPortfolioCopy.noMatchesTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminPortfolioCopy.noMatchesDescription),
    ).toBeInTheDocument();
    const clearMatches = screen.getAllByRole("button", {
      name: adminPortfolioCopy.clearFilters,
    })[0];

    if (clearMatches === undefined) {
      throw new Error("Expected a clear filters action.");
    }

    await user.click(clearMatches);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});

describe("Portfolio presentation components", (): void => {
  it("renders published and unpublished visibility as text", (): void => {
    const { rerender } = render(<PortfolioStatusBadge isPublished />);

    expect(
      screen.getByText(adminPortfolioCopy.visibilityPublished),
    ).toBeInTheDocument();

    rerender(<PortfolioStatusBadge isPublished={false} />);
    expect(
      screen.getByText(adminPortfolioCopy.visibilityUnpublished),
    ).toBeInTheDocument();
  });

  it("renders a compact project card for supplied data", (): void => {
    render(<PortfolioCard project={TEST_PROJECT} />);

    expect(screen.getByText(TEST_PROJECT.title)).toBeInTheDocument();
    expect(screen.getByText(TEST_PROJECT.slug)).toBeInTheDocument();
    expect(
      screen.getByText(adminPortfolioCategoryLabels.RESIDENTIAL),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: adminPortfolioCopy.viewAction }),
    ).toHaveAttribute("href", getAdminPortfolioDetailsPath(TEST_PROJECT.id));
  });

  it("renders pagination architecture without inventing pages on empty data", (): void => {
    render(
      <PortfolioPagination
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
        name: adminPortfolioCopy.paginationLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: adminPortfolioCopy.paginationPrevious,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: `${adminPortfolioCopy.paginationPageLabel} 2`,
      }),
    ).toBeInTheDocument();
  });

  it("keeps the details path wired for project review", (): void => {
    expect(ADMIN_PATHS.portfolio).toBe("/admin/portfolio");
    expect(ADMIN_PORTFOLIO_DETAILS_PATH).toBe("/admin/portfolio/[id]");
    expect(getAdminPortfolioDetailsPath("project_test")).toBe(
      "/admin/portfolio/project_test",
    );
  });
});

describe("Portfolio details", (): void => {
  it("renders supplied project details without inventing images", (): void => {
    render(
      <PortfolioDetails
        presentation={{ project: TEST_PROJECT, status: "ready" }}
        projectId={TEST_PROJECT.id}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminPortfolioCopy.detailsHeading,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(TEST_PROJECT.title).length).toBeGreaterThan(0);
    expect(screen.getByText(TEST_PROJECT.description)).toBeInTheDocument();
    expect(
      screen.getByText(adminPortfolioCopy.imagesEmpty),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminPortfolioCopy.editAction }),
    ).toBeDisabled();
    expect(
      screen.getByText(adminPortfolioCopy.timelineCreated),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(adminPortfolioCopy.timelineUpdated),
    ).not.toBeInTheDocument();
  });

  it("renders the not-found state when a project is unavailable", (): void => {
    render(
      <PortfolioDetails
        presentation={{ status: "empty" }}
        projectId="missing"
      />,
    );

    expect(
      screen.getByText(adminPortfolioCopy.detailsNotFoundTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: adminPortfolioCopy.backToPortfolio }),
    ).toHaveAttribute("href", ADMIN_PATHS.portfolio);
  });
});
