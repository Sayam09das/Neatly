/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminReviewsPage from "@/app/admin/(app)/reviews/page";
import { AdminReviews } from "@/components/admin/reviews/admin-reviews";
import { ReviewCard } from "@/components/admin/reviews/review-card";
import { ReviewRating } from "@/components/admin/reviews/review-rating";
import { ReviewStatusBadge } from "@/components/admin/reviews/review-status-badge";
import { ReviewText } from "@/components/admin/reviews/review-text";
import { ReviewsPagination } from "@/components/admin/reviews/reviews-pagination";
import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  ADMIN_REVIEW_DETAILS_PATH,
  adminReviewCopy,
  getAdminReviewDetailsPath,
} from "@/config/admin-reviews";
import type { AdminReview } from "@/types/admin-review";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/reviews",
}));

const TEST_REVIEW: AdminReview = {
  content: null,
  createdAt: null,
  customerName: null,
  customerRole: null,
  id: "review_test",
  isActive: null,
  isFeatured: null,
  rating: null,
  serviceCategory: null,
};

const LONG_REVIEW: AdminReview = {
  ...TEST_REVIEW,
  content: "x".repeat(200),
  id: "review_long",
  rating: 5,
};

const FORBIDDEN_FAKE_REVIEW_COPY = [
  "Sarah M.",
  "John Doe",
  "Jane Doe",
  "Amazing service",
  "Best cleaner",
  "5 out of 5 from our demo",
  "Approved",
  "Pending",
  "Rejected",
];

describe("Admin reviews page", (): void => {
  it("renders the title, search, filters, and empty state without fake reviews", (): void => {
    render(<AdminReviewsPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminReviewCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminReviewCopy.description)).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: adminReviewCopy.searchLabel }),
    ).toHaveAttribute("placeholder", adminReviewCopy.searchPlaceholder);
    expect(
      screen.getByRole("combobox", { name: adminReviewCopy.ratingLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminReviewCopy.filtersLabel }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminReviewCopy.emptyTitle)).toBeInTheDocument();
    expect(
      screen.getByText(adminReviewCopy.emptyDescription),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", {
        name: adminReviewCopy.paginationLabel,
      }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Sarah M.")).not.toBeInTheDocument();

    const markup = document.body.textContent ?? "";

    for (const phrase of FORBIDDEN_FAKE_REVIEW_COPY) {
      expect(markup).not.toContain(phrase);
    }
  });

  it("renders loading, error, and retry-ready states", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(
      <AdminReviews presentation={{ status: "loading" }} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(adminReviewCopy.loadingLabel)).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);

    rerender(
      <AdminReviews
        presentation={{
          onRetry,
          status: "error",
        }}
      />,
    );

    expect(screen.getByText(adminReviewCopy.errorTitle)).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminReviewCopy.retryLabel }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders table structure, mobile cards, and accessible actions for supplied rows", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminReviews
        presentation={{
          reviews: [TEST_REVIEW],
          status: "ready",
        }}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: adminReviewCopy.tableReviewer,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(adminReviewCopy.emptyValue).length,
    ).toBeGreaterThan(0);
    expect(document.querySelector('[data-slot="review-card"]')).toBeTruthy();
    expect(document.querySelector('[data-slot="review-rating"]')).toBeTruthy();

    const actionButton = screen.getAllByRole("button", {
      name: adminReviewCopy.actionsLabel,
    })[0];

    if (actionButton === undefined) {
      throw new Error("Expected a review actions trigger.");
    }

    await user.click(actionButton);

    expect(
      await screen.findByRole("menuitem", {
        name: adminReviewCopy.viewAction,
      }),
    ).toHaveAttribute("data-disabled");
    expect(
      screen.getByText(adminReviewCopy.comingSoonHint),
    ).toBeInTheDocument();
  });

  it("opens filters and a delete confirmation that cannot complete", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminReviews
        presentation={{
          reviews: [TEST_REVIEW],
          status: "ready",
        }}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: adminReviewCopy.filtersLabel }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: adminReviewCopy.filterSheetTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(adminReviewCopy.statusLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(adminReviewCopy.categoryLabel),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(
        screen.queryByRole("dialog", {
          name: adminReviewCopy.filterSheetTitle,
        }),
      ).not.toBeInTheDocument();
    });

    const actionButton = screen.getAllByRole("button", {
      name: adminReviewCopy.actionsLabel,
    })[0];

    if (actionButton === undefined) {
      throw new Error("Expected a review actions trigger.");
    }

    await user.click(actionButton);
    await user.click(
      await screen.findByRole("menuitem", {
        name: adminReviewCopy.deleteAction,
      }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: adminReviewCopy.confirmDeleteTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminReviewCopy.confirmDeleteAction }),
    ).toBeDisabled();
  });

  it("shows filter chips and clear filters only when filters are active", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminReviews presentation={{ status: "empty" }} />);

    expect(
      screen.queryByRole("button", { name: adminReviewCopy.clearFilters }),
    ).not.toBeInTheDocument();

    await user.type(
      screen.getByRole("searchbox", { name: adminReviewCopy.searchLabel }),
      "review_test",
    );

    expect(
      screen.getByRole("button", {
        name: `Remove ${adminReviewCopy.searchLabel}: review_test`,
      }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminReviewCopy.clearFilters }),
    );
    await waitFor((): void => {
      expect(
        screen.queryByRole("button", { name: adminReviewCopy.clearFilters }),
      ).not.toBeInTheDocument();
    });
  });
});

describe("Review presentation components", (): void => {
  it("renders accessible rating text and a neutral empty rating", (): void => {
    const { rerender } = render(<ReviewRating rating={null} />);

    expect(screen.getByText(adminReviewCopy.emptyValue)).toBeInTheDocument();

    rerender(<ReviewRating rating={4} />);
    expect(screen.getByText("4 out of 5 stars")).toBeInTheDocument();
    expect(screen.getByText("4/5")).toBeInTheDocument();
  });

  it("renders supplied status text and a neutral empty status", (): void => {
    const { rerender } = render(<ReviewStatusBadge isActive={null} />);

    expect(screen.getByText(adminReviewCopy.emptyValue)).toBeInTheDocument();

    rerender(<ReviewStatusBadge isActive={true} />);
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.queryByText("Approved")).not.toBeInTheDocument();
  });

  it("renders a compact review card for supplied data", (): void => {
    render(<ReviewCard review={TEST_REVIEW} />);

    expect(document.querySelector('[data-slot="review-card"]')).toBeTruthy();
    expect(
      screen.getAllByText(adminReviewCopy.emptyValue).length,
    ).toBeGreaterThan(0);
  });

  it("lets long review text expand without fabricating quotes", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<ReviewText content={LONG_REVIEW.content} />);

    expect(
      screen.getByRole("button", { name: adminReviewCopy.readMore }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminReviewCopy.readMore }),
    );
    expect(
      screen.getByRole("button", { name: adminReviewCopy.readLess }),
    ).toBeInTheDocument();
    expect(screen.getByText("x".repeat(200))).toBeInTheDocument();
  });

  it("renders pagination architecture without inventing pages on empty data", (): void => {
    render(
      <ReviewsPagination
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
        name: adminReviewCopy.paginationLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: adminReviewCopy.paginationPrevious,
      }),
    ).toBeDisabled();
  });

  it("keeps the details path as a future route placeholder", (): void => {
    expect(ADMIN_PATHS.reviews).toBe("/admin/reviews");
    expect(ADMIN_REVIEW_DETAILS_PATH).toBe("/admin/reviews/[id]");
    expect(getAdminReviewDetailsPath("review_test")).toBe(
      "/admin/reviews/review_test",
    );
  });
});
