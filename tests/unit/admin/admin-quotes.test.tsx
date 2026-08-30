/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminQuotesPage from "@/app/admin/(app)/quotes/page";
import { AdminQuotes } from "@/components/admin/quotes/admin-quotes";
import { QuoteCard } from "@/components/admin/quotes/quote-card";
import { QuoteDetails } from "@/components/admin/quotes/quote-details";
import { QuoteStatusBadge } from "@/components/admin/quotes/quote-status-badge";
import { QuotesPagination } from "@/components/admin/quotes/quotes-pagination";
import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  ADMIN_QUOTE_DETAILS_PATH,
  adminQuoteCopy,
  adminQuoteServiceTypeLabels,
  adminQuoteStatusLabels,
  getAdminQuoteDetailsPath,
} from "@/config/admin-quotes";
import type { AdminQuote } from "@/types/admin-quote";
import { adminQuoteStatuses } from "@/types/admin-quote";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/quotes",
  useRouter: (): {
    push: () => void;
    refresh: () => void;
    replace: () => void;
  } => ({
    push: (): void => undefined,
    refresh: (): void => undefined,
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

vi.mock("@/lib/admin/use-admin-query", () => ({
  useAdminQuery: (): {
    data: null;
    error: null;
    retry: () => void;
    status: "success";
  } => ({
    data: null,
    error: null,
    retry: (): void => undefined,
    status: "success",
  }),
}));

vi.mock("@/lib/admin/use-admin-refresh", () => ({
  useAdminRefresh: (): void => undefined,
}));

const TEST_QUOTE: AdminQuote = {
  additionalNotes: "Please use unscented products.",
  adminNotes: null,
  approximateSize: "1,000-2,000 sq ft",
  bathrooms: 2,
  bedrooms: 3,
  bookingId: null,
  createdAt: "2026-08-30T09:00:00.000Z",
  email: "ada@neatly.test",
  frequency: "ONE_TIME",
  fullName: "Ada Lovelace",
  id: "quote_test",
  phone: "+1-555-0100",
  preferredDate: "2026-09-02",
  preferredTime: "Morning (8am-12pm)",
  propertyType: "APARTMENT",
  quotedAmount: null,
  service: null,
  serviceAddress: "123 Test Street",
  serviceId: null,
  serviceType: "RESIDENTIAL",
  status: "NEW",
  updatedAt: "2026-08-30T09:00:00.000Z",
};

const FORBIDDEN_FAKE_QUOTE_COPY = [
  "Sarah Johnson",
  "Q-1024",
  "Residential Cleaning",
  "Deep Cleaning",
  "Commercial Cleaning",
];

describe("Admin quotes page", (): void => {
  it("renders the title, search, filters, metrics, and empty state without fake quotes", async (): Promise<void> => {
    render(<AdminQuotesPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminQuoteCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminQuoteCopy.description)).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: adminQuoteCopy.searchLabel }),
    ).toHaveAttribute("placeholder", adminQuoteCopy.searchPlaceholder);
    expect(
      screen.getByRole("combobox", { name: adminQuoteCopy.statusLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: adminQuoteCopy.dateRangeLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminQuoteCopy.filtersLabel }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminQuoteCopy.metricTotal)).toBeInTheDocument();
    expect(
      screen.getAllByText(adminQuoteCopy.metricNew).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminQuoteCopy.metricReviewing).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminQuoteCopy.metricQuoted).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminQuoteCopy.metricConverted).length,
    ).toBeGreaterThan(0);
    await waitFor((): void => {
      expect(screen.getByText(adminQuoteCopy.emptyTitle)).toBeInTheDocument();
    });
    expect(
      screen.getByText(adminQuoteCopy.emptyDescription),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", {
        name: adminQuoteCopy.paginationLabel,
      }),
    ).not.toBeInTheDocument();

    const markup = document.body.textContent ?? "";

    for (const phrase of FORBIDDEN_FAKE_QUOTE_COPY) {
      expect(markup).not.toContain(phrase);
    }
  });

  it("renders loading, error, and retry-ready states", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(
      <AdminQuotes presentation={{ status: "loading" }} />,
    );

    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    expect(screen.getByText(adminQuoteCopy.loadingLabel)).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);

    rerender(
      <AdminQuotes
        presentation={{
          onRetry,
          status: "error",
        }}
      />,
    );

    expect(screen.getByText(adminQuoteCopy.errorTitle)).toBeInTheDocument();
    expect(
      screen.getByText(adminQuoteCopy.errorDescription),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminQuoteCopy.retryLabel }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders table structure, mobile cards, and accessible actions for supplied rows", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminQuotes
        presentation={{
          quotes: [TEST_QUOTE],
          status: "ready",
        }}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: adminQuoteCopy.tableQuote,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(TEST_QUOTE.id).length).toBeGreaterThan(0);
    expect(screen.getAllByText(TEST_QUOTE.fullName).length).toBeGreaterThan(0);
    expect(screen.getAllByText(TEST_QUOTE.email).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminQuoteServiceTypeLabels.RESIDENTIAL).length,
    ).toBeGreaterThan(0);
    expect(document.querySelector('[data-slot="quote-card"]')).toBeTruthy();
    expect(
      screen.getAllByRole("link", { name: adminQuoteCopy.viewAction }).length,
    ).toBeGreaterThan(0);

    const actionButton = screen.getAllByRole("button", {
      name: adminQuoteCopy.actionsLabel,
    })[0];

    if (actionButton === undefined) {
      throw new Error("Expected a quote actions trigger.");
    }

    await user.click(actionButton);

    expect(
      await screen.findByRole("menuitem", {
        name: adminQuoteCopy.viewAction,
      }),
    ).toHaveAttribute("href", getAdminQuoteDetailsPath(TEST_QUOTE.id));
  });

  it("opens the filter sheet without inventing quote records", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminQuotes presentation={{ status: "empty" }} />);

    await user.click(
      screen.getByRole("button", { name: adminQuoteCopy.filtersLabel }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: adminQuoteCopy.filterSheetTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminQuoteCopy.filterSheetDescription),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: adminQuoteCopy.filterServiceLabel }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(
        screen.queryByRole("dialog", {
          name: adminQuoteCopy.filterSheetTitle,
        }),
      ).not.toBeInTheDocument();
    });
    expect(screen.queryByText(TEST_QUOTE.id)).not.toBeInTheDocument();
  });

  it("shows filter chips and clear filters only when filters are active", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminQuotes presentation={{ status: "empty" }} />);

    expect(
      screen.queryByRole("button", { name: adminQuoteCopy.clearFilters }),
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: adminQuoteCopy.statusLabel }),
      "NEW",
    );

    expect(
      screen.getByRole("button", {
        name: `Remove ${adminQuoteCopy.statusLabel}: ${adminQuoteStatusLabels.NEW}`,
      }),
    ).toBeInTheDocument();
    const clearChip = screen.getAllByRole("button", {
      name: adminQuoteCopy.clearFilters,
    })[0];

    if (clearChip === undefined) {
      throw new Error("Expected a clear filters action.");
    }

    await user.click(clearChip);
    await waitFor((): void => {
      expect(
        screen.queryByRole("button", { name: adminQuoteCopy.clearFilters }),
      ).not.toBeInTheDocument();
    });
  });

  it("shows the search-empty state when filters hide supplied quotes", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminQuotes
        presentation={{
          quotes: [TEST_QUOTE],
          status: "ready",
        }}
      />,
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: adminQuoteCopy.statusLabel }),
      "DECLINED",
    );

    expect(screen.getByText(adminQuoteCopy.noMatchesTitle)).toBeInTheDocument();
    expect(
      screen.getByText(adminQuoteCopy.noMatchesDescription),
    ).toBeInTheDocument();
    const clearMatches = screen.getAllByRole("button", {
      name: adminQuoteCopy.clearFilters,
    })[0];

    if (clearMatches === undefined) {
      throw new Error("Expected a clear filters action.");
    }

    await user.click(clearMatches);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});

describe("Quote presentation components", (): void => {
  it("renders every quote status as text", (): void => {
    const { rerender } = render(
      <QuoteStatusBadge status={adminQuoteStatuses[0]} />,
    );

    for (const status of adminQuoteStatuses) {
      rerender(<QuoteStatusBadge status={status} />);
      expect(
        screen.getByText(adminQuoteStatusLabels[status]),
      ).toBeInTheDocument();
    }
  });

  it("renders a compact quote card for supplied data", (): void => {
    render(<QuoteCard quote={TEST_QUOTE} />);

    expect(screen.getByText(TEST_QUOTE.fullName)).toBeInTheDocument();
    expect(screen.getByText(TEST_QUOTE.email)).toBeInTheDocument();
    expect(
      screen.getByText(adminQuoteServiceTypeLabels.RESIDENTIAL),
    ).toBeInTheDocument();
    expect(screen.getByText(adminQuoteStatusLabels.NEW)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: adminQuoteCopy.viewAction }),
    ).toHaveAttribute("href", getAdminQuoteDetailsPath(TEST_QUOTE.id));
  });

  it("renders pagination architecture without inventing pages on empty data", (): void => {
    render(
      <QuotesPagination
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
        name: adminQuoteCopy.paginationLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminQuoteCopy.paginationPrevious }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: `${adminQuoteCopy.paginationPageLabel} 2`,
      }),
    ).toBeInTheDocument();
  });

  it("keeps the details path wired for quote review", (): void => {
    expect(ADMIN_PATHS.quotes).toBe("/admin/quotes");
    expect(ADMIN_QUOTE_DETAILS_PATH).toBe("/admin/quotes/[id]");
    expect(getAdminQuoteDetailsPath("quote_test")).toBe(
      "/admin/quotes/quote_test",
    );
  });
});

describe("Quote details", (): void => {
  it("renders supplied quote details without inventing timeline events", (): void => {
    render(
      <QuoteDetails
        presentation={{ quote: TEST_QUOTE, status: "ready" }}
        quoteId={TEST_QUOTE.id}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminQuoteCopy.detailsHeading,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(TEST_QUOTE.fullName).length).toBeGreaterThan(0);
    expect(screen.getByText(TEST_QUOTE.email)).toBeInTheDocument();
    expect(screen.getByText(TEST_QUOTE.phone)).toBeInTheDocument();
    expect(
      screen.getByText(TEST_QUOTE.additionalNotes ?? ""),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminQuoteCopy.reviewAction }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminQuoteCopy.quoteAction }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminQuoteCopy.timelineCreated),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(adminQuoteCopy.timelineUpdated),
    ).not.toBeInTheDocument();
  });

  it("renders the not-found state when a quote is unavailable", (): void => {
    render(
      <QuoteDetails presentation={{ status: "empty" }} quoteId="missing" />,
    );

    expect(
      screen.getByText(adminQuoteCopy.detailsNotFoundTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: adminQuoteCopy.backToQuotes }),
    ).toHaveAttribute("href", ADMIN_PATHS.quotes);
  });
});
