"use client";

import { Button, Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { ServicesIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminServiceCopy } from "@/config/admin-services";

interface ServicesEmptyStateProps {
  onCreate: () => void;
}

export function ServicesEmptyState({
  onCreate,
}: ServicesEmptyStateProps): ReactElement {
  return (
    <div
      className="flex flex-col items-start gap-4"
      data-slot="services-empty-state"
    >
      <AdminEmptyState
        description={adminServiceCopy.emptyDescription}
        icon={ServicesIcon}
        title={adminServiceCopy.emptyTitle}
      />
      <Button onClick={onCreate} type="button">
        {adminServiceCopy.primaryAction}
      </Button>
    </div>
  );
}

interface ServicesNoMatchesStateProps {
  onClearFilters: () => void;
}

export function ServicesNoMatchesState({
  onClearFilters,
}: ServicesNoMatchesStateProps): ReactElement {
  return (
    <div data-slot="services-no-matches">
      <AdminEmptyState
        description={adminServiceCopy.noMatchesDescription}
        icon={ServicesIcon}
        title={adminServiceCopy.noMatchesTitle}
      />
      <Button
        className="mt-4"
        onClick={onClearFilters}
        type="button"
        variant="outline"
      >
        {adminServiceCopy.clearFilters}
      </Button>
    </div>
  );
}

export function ServicesLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-3"
      data-slot="services-loading"
      role="status"
    >
      <p className="sr-only">{adminServiceCopy.loadingLabel}</p>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-2/3 max-w-full" />
    </div>
  );
}

interface ServicesErrorProps {
  onRetry: () => void;
}

export function ServicesError({ onRetry }: ServicesErrorProps): ReactElement {
  return (
    <div data-slot="services-error">
      <AdminRetryState
        actionLabel={adminServiceCopy.retryLabel}
        description={adminServiceCopy.errorDescription}
        onRetry={onRetry}
        title={adminServiceCopy.errorTitle}
      />
    </div>
  );
}
