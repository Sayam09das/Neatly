"use client";

import { Button, Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { TestimonialsIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminReviewCopy } from "@/config/admin-reviews";

export function ReviewsEmptyState(): ReactElement {
  return (
    <div data-slot="reviews-empty-state">
      <AdminEmptyState
        description={adminReviewCopy.emptyDescription}
        icon={TestimonialsIcon}
        title={adminReviewCopy.emptyTitle}
      />
    </div>
  );
}

interface ReviewsNoMatchesStateProps {
  onClearFilters: () => void;
}

export function ReviewsNoMatchesState({
  onClearFilters,
}: ReviewsNoMatchesStateProps): ReactElement {
  return (
    <div data-slot="reviews-no-matches">
      <AdminEmptyState
        description={adminReviewCopy.noMatchesDescription}
        icon={TestimonialsIcon}
        title={adminReviewCopy.noMatchesTitle}
      />
      <Button
        className="mt-4"
        onClick={onClearFilters}
        type="button"
        variant="outline"
      >
        {adminReviewCopy.clearFilters}
      </Button>
    </div>
  );
}

export function ReviewsLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-3"
      data-slot="reviews-loading"
      role="status"
    >
      <p className="sr-only">{adminReviewCopy.loadingLabel}</p>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-2/3 max-w-full" />
    </div>
  );
}

interface ReviewsErrorProps {
  onRetry: () => void;
}

export function ReviewsError({ onRetry }: ReviewsErrorProps): ReactElement {
  return (
    <div data-slot="reviews-error">
      <AdminRetryState
        actionLabel={adminReviewCopy.retryLabel}
        description={adminReviewCopy.errorDescription}
        onRetry={onRetry}
        title={adminReviewCopy.errorTitle}
      />
    </div>
  );
}
