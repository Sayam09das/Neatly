"use client";

import { Button, Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { QuotesIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminQuoteCopy } from "@/config/admin-quotes";

interface QuotesNoMatchesStateProps {
  onClearFilters: () => void;
}

export function QuotesEmptyState(): ReactElement {
  return (
    <div data-slot="quotes-empty-state">
      <AdminEmptyState
        description={adminQuoteCopy.emptyDescription}
        icon={QuotesIcon}
        title={adminQuoteCopy.emptyTitle}
      />
    </div>
  );
}

export function QuotesNoMatchesState({
  onClearFilters,
}: QuotesNoMatchesStateProps): ReactElement {
  return (
    <div data-slot="quotes-no-matches">
      <AdminEmptyState
        description={adminQuoteCopy.noMatchesDescription}
        icon={QuotesIcon}
        title={adminQuoteCopy.noMatchesTitle}
      />
      <Button
        className="mt-4"
        onClick={onClearFilters}
        type="button"
        variant="outline"
      >
        {adminQuoteCopy.clearFilters}
      </Button>
    </div>
  );
}

export function QuotesLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-3"
      data-slot="quotes-loading"
      role="status"
    >
      <p className="sr-only">{adminQuoteCopy.loadingLabel}</p>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-2/3 max-w-full" />
    </div>
  );
}

interface QuotesErrorProps {
  onRetry: () => void;
}

export function QuotesError({ onRetry }: QuotesErrorProps): ReactElement {
  return (
    <div data-slot="quotes-error">
      <AdminRetryState
        actionLabel={adminQuoteCopy.retryLabel}
        description={adminQuoteCopy.errorDescription}
        onRetry={onRetry}
        title={adminQuoteCopy.errorTitle}
      />
    </div>
  );
}
