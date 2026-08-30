"use client";

import { Button, Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { NewsletterIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminNewsletterCopy } from "@/config/admin-newsletter";

interface NewsletterNoMatchesStateProps {
  onClearFilters: () => void;
}

export function NewsletterEmptyState(): ReactElement {
  return (
    <div data-slot="newsletter-empty-state">
      <AdminEmptyState
        description={adminNewsletterCopy.emptyDescription}
        icon={NewsletterIcon}
        title={adminNewsletterCopy.emptyTitle}
      />
    </div>
  );
}

export function NewsletterNoMatchesState({
  onClearFilters,
}: NewsletterNoMatchesStateProps): ReactElement {
  return (
    <div data-slot="newsletter-no-matches">
      <AdminEmptyState
        description={adminNewsletterCopy.noMatchesDescription}
        icon={NewsletterIcon}
        title={adminNewsletterCopy.noMatchesTitle}
      />
      <Button
        className="mt-4"
        onClick={onClearFilters}
        type="button"
        variant="outline"
      >
        {adminNewsletterCopy.clearFilters}
      </Button>
    </div>
  );
}

export function NewsletterLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-3"
      data-slot="newsletter-loading"
      role="status"
    >
      <p className="sr-only">{adminNewsletterCopy.loadingLabel}</p>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-2/3 max-w-full" />
    </div>
  );
}

interface NewsletterErrorProps {
  onRetry: () => void;
}

export function NewsletterError({
  onRetry,
}: NewsletterErrorProps): ReactElement {
  return (
    <div data-slot="newsletter-error">
      <AdminRetryState
        actionLabel={adminNewsletterCopy.retryLabel}
        description={adminNewsletterCopy.errorDescription}
        onRetry={onRetry}
        title={adminNewsletterCopy.errorTitle}
      />
    </div>
  );
}
