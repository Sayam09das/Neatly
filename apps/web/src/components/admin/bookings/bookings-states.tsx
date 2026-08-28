"use client";

import { Button, Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { BookingsIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminBookingCopy } from "@/config/admin-bookings";

interface BookingsEmptyStateProps {
  onCreate: () => void;
}

export function BookingsEmptyState({
  onCreate,
}: BookingsEmptyStateProps): ReactElement {
  return (
    <div
      className="flex flex-col items-start gap-4"
      data-slot="bookings-empty-state"
    >
      <AdminEmptyState
        description={adminBookingCopy.emptyDescription}
        icon={BookingsIcon}
        title={adminBookingCopy.emptyTitle}
      />
      <Button onClick={onCreate} type="button">
        {adminBookingCopy.primaryAction}
      </Button>
    </div>
  );
}

interface BookingsNoMatchesStateProps {
  onClearFilters: () => void;
}

export function BookingsNoMatchesState({
  onClearFilters,
}: BookingsNoMatchesStateProps): ReactElement {
  return (
    <div data-slot="bookings-no-matches">
      <AdminEmptyState
        description={adminBookingCopy.noMatchesDescription}
        icon={BookingsIcon}
        title={adminBookingCopy.noMatchesTitle}
      />
      <Button
        className="mt-4"
        onClick={onClearFilters}
        type="button"
        variant="outline"
      >
        {adminBookingCopy.clearFilters}
      </Button>
    </div>
  );
}

export function BookingsLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-3"
      data-slot="bookings-loading"
      role="status"
    >
      <p className="sr-only">{adminBookingCopy.loadingLabel}</p>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-2/3 max-w-full" />
    </div>
  );
}

interface BookingsErrorProps {
  onRetry: () => void;
}

export function BookingsError({ onRetry }: BookingsErrorProps): ReactElement {
  return (
    <div data-slot="bookings-error">
      <AdminRetryState
        actionLabel={adminBookingCopy.retryLabel}
        description={adminBookingCopy.errorDescription}
        onRetry={onRetry}
        title={adminBookingCopy.errorTitle}
      />
    </div>
  );
}
