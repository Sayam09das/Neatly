/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminNewsletterPage from "@/app/admin/(app)/newsletter/page";
import { AdminNewsletter } from "@/components/admin/newsletter/admin-newsletter";
import { NewsletterCard } from "@/components/admin/newsletter/newsletter-card";
import { NewsletterDetails } from "@/components/admin/newsletter/newsletter-details";
import { NewsletterPagination } from "@/components/admin/newsletter/newsletter-pagination";
import { NewsletterStatusBadge } from "@/components/admin/newsletter/newsletter-status-badge";
import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  ADMIN_NEWSLETTER_DETAILS_PATH,
  adminNewsletterCopy,
  adminNewsletterStatusLabels,
  getAdminNewsletterDetailsPath,
} from "@/config/admin-newsletter";
import type { AdminNewsletterSubscriber } from "@/types/admin-newsletter";
import { adminNewsletterStatuses } from "@/types/admin-newsletter";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/newsletter",
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

const TEST_SUBSCRIBER: AdminNewsletterSubscriber = {
  createdAt: "2026-08-30T09:00:00.000Z",
  email: "ada@neatly.test",
  id: "subscriber_test",
  status: "SUBSCRIBED",
  subscribedAt: "2026-08-30T09:00:00.000Z",
  unsubscribedAt: null,
  updatedAt: "2026-08-30T09:00:00.000Z",
};

const FORBIDDEN_FAKE_NEWSLETTER_COPY = ["john@example.com", "jane@example.com"];

describe("Admin newsletter page", (): void => {
  it("renders the title, search, filters, metrics, and empty state without fake subscribers", async (): Promise<void> => {
    render(<AdminNewsletterPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminNewsletterCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminNewsletterCopy.description),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", {
        name: adminNewsletterCopy.searchLabel,
      }),
    ).toHaveAttribute("placeholder", adminNewsletterCopy.searchPlaceholder);
    expect(
      screen.getByRole("combobox", { name: adminNewsletterCopy.statusLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", {
        name: adminNewsletterCopy.dateRangeLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminNewsletterCopy.filtersLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminNewsletterCopy.exportAction }),
    ).toBeDisabled();
    expect(
      screen.getByText(adminNewsletterCopy.metricTotal),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(adminNewsletterCopy.metricSubscribed).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminNewsletterCopy.metricUnsubscribed).length,
    ).toBeGreaterThan(0);
    await waitFor((): void => {
      expect(
        screen.getByText(adminNewsletterCopy.emptyTitle),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(adminNewsletterCopy.emptyDescription),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", {
        name: adminNewsletterCopy.paginationLabel,
      }),
    ).not.toBeInTheDocument();

    const markup = document.body.textContent ?? "";

    for (const phrase of FORBIDDEN_FAKE_NEWSLETTER_COPY) {
      expect(markup).not.toContain(phrase);
    }
  });

  it("renders loading, error, and retry-ready states", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(
      <AdminNewsletter presentation={{ status: "loading" }} />,
    );

    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    expect(
      screen.getByText(adminNewsletterCopy.loadingLabel),
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);

    rerender(
      <AdminNewsletter
        presentation={{
          onRetry,
          status: "error",
        }}
      />,
    );

    expect(
      screen.getByText(adminNewsletterCopy.errorTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminNewsletterCopy.errorDescription),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminNewsletterCopy.retryLabel }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders table structure, mobile cards, and accessible actions for supplied rows", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminNewsletter
        presentation={{
          status: "ready",
          subscribers: [TEST_SUBSCRIBER],
        }}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: adminNewsletterCopy.tableEmail,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(TEST_SUBSCRIBER.email).length).toBeGreaterThan(
      0,
    );
    expect(
      document.querySelector('[data-slot="newsletter-card"]'),
    ).toBeTruthy();
    expect(
      screen.getAllByRole("link", { name: adminNewsletterCopy.viewAction })
        .length,
    ).toBeGreaterThan(0);

    const actionButton = screen.getAllByRole("button", {
      name: adminNewsletterCopy.actionsLabel,
    })[0];

    if (actionButton === undefined) {
      throw new Error("Expected a newsletter actions trigger.");
    }

    await user.click(actionButton);

    expect(
      await screen.findByRole("menuitem", {
        name: adminNewsletterCopy.viewAction,
      }),
    ).toHaveAttribute(
      "href",
      getAdminNewsletterDetailsPath(TEST_SUBSCRIBER.id),
    );
    expect(
      screen.getByRole("menuitem", {
        name: adminNewsletterCopy.exportAction,
      }),
    ).toHaveAttribute("data-disabled");
  });

  it("opens the filter sheet without inventing subscriber records", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminNewsletter presentation={{ status: "empty" }} />);

    await user.click(
      screen.getByRole("button", { name: adminNewsletterCopy.filtersLabel }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: adminNewsletterCopy.filterSheetTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminNewsletterCopy.filterSheetDescription),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(
        screen.queryByRole("dialog", {
          name: adminNewsletterCopy.filterSheetTitle,
        }),
      ).not.toBeInTheDocument();
    });
    expect(screen.queryByText(TEST_SUBSCRIBER.id)).not.toBeInTheDocument();
  });

  it("shows filter chips and clear filters only when filters are active", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminNewsletter presentation={{ status: "empty" }} />);

    expect(
      screen.queryByRole("button", { name: adminNewsletterCopy.clearFilters }),
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: adminNewsletterCopy.statusLabel }),
      "SUBSCRIBED",
    );

    expect(
      screen.getByRole("button", {
        name: `Remove ${adminNewsletterCopy.statusLabel}: ${adminNewsletterStatusLabels.SUBSCRIBED}`,
      }),
    ).toBeInTheDocument();
    const clearChip = screen.getAllByRole("button", {
      name: adminNewsletterCopy.clearFilters,
    })[0];

    if (clearChip === undefined) {
      throw new Error("Expected a clear filters action.");
    }

    await user.click(clearChip);
    await waitFor((): void => {
      expect(
        screen.queryByRole("button", {
          name: adminNewsletterCopy.clearFilters,
        }),
      ).not.toBeInTheDocument();
    });
  });

  it("shows the search-empty state when filters hide supplied subscribers", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminNewsletter
        presentation={{
          status: "ready",
          subscribers: [TEST_SUBSCRIBER],
        }}
      />,
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: adminNewsletterCopy.statusLabel }),
      "UNSUBSCRIBED",
    );

    expect(
      screen.getByText(adminNewsletterCopy.noMatchesTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminNewsletterCopy.noMatchesDescription),
    ).toBeInTheDocument();
    const clearMatches = screen.getAllByRole("button", {
      name: adminNewsletterCopy.clearFilters,
    })[0];

    if (clearMatches === undefined) {
      throw new Error("Expected a clear filters action.");
    }

    await user.click(clearMatches);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});

describe("Newsletter presentation components", (): void => {
  it("renders every newsletter status as text", (): void => {
    const firstStatus = adminNewsletterStatuses[0];

    if (firstStatus === undefined) {
      throw new Error("Expected newsletter statuses.");
    }

    const { rerender } = render(<NewsletterStatusBadge status={firstStatus} />);

    for (const status of adminNewsletterStatuses) {
      rerender(<NewsletterStatusBadge status={status} />);
      expect(
        screen.getByText(adminNewsletterStatusLabels[status]),
      ).toBeInTheDocument();
    }
  });

  it("renders a compact subscriber card for supplied data", (): void => {
    render(<NewsletterCard subscriber={TEST_SUBSCRIBER} />);

    expect(screen.getByText(TEST_SUBSCRIBER.email)).toBeInTheDocument();
    expect(
      screen.getAllByText(adminNewsletterStatusLabels.SUBSCRIBED).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: adminNewsletterCopy.viewAction }),
    ).toHaveAttribute(
      "href",
      getAdminNewsletterDetailsPath(TEST_SUBSCRIBER.id),
    );
  });

  it("renders pagination architecture without inventing pages on empty data", (): void => {
    render(
      <NewsletterPagination
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
        name: adminNewsletterCopy.paginationLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: adminNewsletterCopy.paginationPrevious,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: `${adminNewsletterCopy.paginationPageLabel} 2`,
      }),
    ).toBeInTheDocument();
  });

  it("keeps the details path wired for subscriber review", (): void => {
    expect(ADMIN_PATHS.newsletter).toBe("/admin/newsletter");
    expect(ADMIN_NEWSLETTER_DETAILS_PATH).toBe("/admin/newsletter/[id]");
    expect(getAdminNewsletterDetailsPath("subscriber_test")).toBe(
      "/admin/newsletter/subscriber_test",
    );
  });
});

describe("Newsletter details", (): void => {
  it("renders supplied subscriber details without inventing emails", (): void => {
    render(
      <NewsletterDetails
        presentation={{ status: "ready", subscriber: TEST_SUBSCRIBER }}
        subscriberId={TEST_SUBSCRIBER.id}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminNewsletterCopy.detailsHeading,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(TEST_SUBSCRIBER.email).length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getByRole("button", { name: adminNewsletterCopy.exportAction }),
    ).toBeDisabled();
    expect(
      screen.getByText(adminNewsletterCopy.timelineCreated),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(adminNewsletterCopy.timelineUpdated),
    ).not.toBeInTheDocument();
    expect(document.body.textContent ?? "").not.toContain("john@example.com");
  });

  it("renders the not-found state when a subscriber is unavailable", (): void => {
    render(
      <NewsletterDetails
        presentation={{ status: "empty" }}
        subscriberId="missing"
      />,
    );

    expect(
      screen.getByText(adminNewsletterCopy.detailsNotFoundTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: adminNewsletterCopy.backToNewsletter }),
    ).toHaveAttribute("href", ADMIN_PATHS.newsletter);
  });
});
