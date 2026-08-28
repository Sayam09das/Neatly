"use client";

import { Card } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { ReviewCardList } from "@/components/admin/reviews/review-card";
import { ReviewsDesktopTable } from "@/components/admin/reviews/reviews-desktop-table";
import { ReviewsPagination } from "@/components/admin/reviews/reviews-pagination";
import {
  ReviewsEmptyState,
  ReviewsError,
  ReviewsLoading,
  ReviewsNoMatchesState,
} from "@/components/admin/reviews/reviews-states";
import { ReviewsSummary } from "@/components/admin/reviews/reviews-summary";
import { shouldRenderReviewPagination } from "@/lib/admin/reviews";
import type {
  AdminReview,
  AdminReviewPagination,
  AdminReviewPresentation,
} from "@/types/admin-review";

interface ReviewsTableProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  pagination?: AdminReviewPagination;
  presentation: AdminReviewPresentation;
  reviews: readonly AdminReview[];
}

export function ReviewsTable({
  hasActiveFilters,
  onClearFilters,
  pagination,
  presentation,
  reviews,
}: ReviewsTableProps): ReactElement {
  return (
    <div className="flex flex-col gap-4" data-slot="reviews-table">
      {presentation.status === "ready" && reviews.length > 0 ? (
        <ReviewsSummary reviews={reviews} />
      ) : null}
      <ReviewsTableBody
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        presentation={presentation}
        reviews={reviews}
      />
      {presentation.status === "ready" &&
      shouldRenderReviewPagination(pagination, reviews.length) &&
      pagination !== undefined ? (
        <ReviewsPagination pagination={pagination} />
      ) : null}
    </div>
  );
}

interface ReviewsTableBodyProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  presentation: AdminReviewPresentation;
  reviews: readonly AdminReview[];
}

function ReviewsTableBody({
  hasActiveFilters,
  onClearFilters,
  presentation,
  reviews,
}: ReviewsTableBodyProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <ReviewsLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <ReviewsError onRetry={presentation.onRetry} />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <ReviewsEmptyState />
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card className="p-6 shadow-none">
        {hasActiveFilters ? (
          <ReviewsNoMatchesState onClearFilters={onClearFilters} />
        ) : (
          <ReviewsEmptyState />
        )}
      </Card>
    );
  }

  return (
    <AnimatePresence initial={false}>
      <motion.div
        animate="visible"
        initial={prefersReducedMotion ? false : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: prefersReducedMotion ? 0 : motionDuration.micro,
            },
          },
        }}
      >
        <ReviewCardList reviews={reviews} />
        <ReviewsDesktopTable reviews={reviews} />
      </motion.div>
    </AnimatePresence>
  );
}
