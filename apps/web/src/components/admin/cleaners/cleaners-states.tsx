"use client";

import { Button, Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { UserIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminCleanerCopy } from "@/config/admin-cleaners";

interface CleanersEmptyStateProps {
  onCreate: () => void;
}

export function CleanersEmptyState({
  onCreate,
}: CleanersEmptyStateProps): ReactElement {
  return (
    <div
      className="flex flex-col items-start gap-4"
      data-slot="cleaners-empty-state"
    >
      <AdminEmptyState
        description={adminCleanerCopy.emptyDescription}
        icon={UserIcon}
        title={adminCleanerCopy.emptyTitle}
      />
      <Button onClick={onCreate} type="button">
        {adminCleanerCopy.primaryAction}
      </Button>
    </div>
  );
}

interface CleanersNoMatchesStateProps {
  onClearFilters: () => void;
}

export function CleanersNoMatchesState({
  onClearFilters,
}: CleanersNoMatchesStateProps): ReactElement {
  return (
    <div data-slot="cleaners-no-matches">
      <AdminEmptyState
        description={adminCleanerCopy.noMatchesDescription}
        icon={UserIcon}
        title={adminCleanerCopy.noMatchesTitle}
      />
      <Button
        className="mt-4"
        onClick={onClearFilters}
        type="button"
        variant="outline"
      >
        Clear filters
      </Button>
    </div>
  );
}

export function CleanersLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-3"
      data-slot="cleaners-loading"
      role="status"
    >
      <p className="sr-only">{adminCleanerCopy.loadingLabel}</p>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-2/3 max-w-full" />
    </div>
  );
}

interface CleanersErrorProps {
  onRetry: () => void;
}

export function CleanersError({ onRetry }: CleanersErrorProps): ReactElement {
  return (
    <div data-slot="cleaners-error">
      <AdminRetryState
        actionLabel={adminCleanerCopy.retryLabel}
        description={adminCleanerCopy.errorDescription}
        onRetry={onRetry}
        title={adminCleanerCopy.errorTitle}
      />
    </div>
  );
}
