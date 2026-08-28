"use client";

import { Button, Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { CustomersIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminCustomerCopy } from "@/config/admin-customers";

interface CustomersEmptyStateProps {
  onCreate: () => void;
}

export function CustomersEmptyState({
  onCreate,
}: CustomersEmptyStateProps): ReactElement {
  return (
    <div
      className="flex flex-col items-start gap-4"
      data-slot="customers-empty-state"
    >
      <AdminEmptyState
        description={adminCustomerCopy.emptyDescription}
        icon={CustomersIcon}
        title={adminCustomerCopy.emptyTitle}
      />
      <Button onClick={onCreate} type="button">
        {adminCustomerCopy.primaryAction}
      </Button>
    </div>
  );
}

interface CustomersNoMatchesStateProps {
  onClearFilters: () => void;
}

export function CustomersNoMatchesState({
  onClearFilters,
}: CustomersNoMatchesStateProps): ReactElement {
  return (
    <div data-slot="customers-no-matches">
      <AdminEmptyState
        description={adminCustomerCopy.noMatchesDescription}
        icon={CustomersIcon}
        title={adminCustomerCopy.noMatchesTitle}
      />
      <Button
        className="mt-4"
        onClick={onClearFilters}
        type="button"
        variant="outline"
      >
        {adminCustomerCopy.clearFilters}
      </Button>
    </div>
  );
}

export function CustomersLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-3"
      data-slot="customers-loading"
      role="status"
    >
      <p className="sr-only">{adminCustomerCopy.loadingLabel}</p>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-2/3 max-w-full" />
    </div>
  );
}

interface CustomersErrorProps {
  onRetry: () => void;
}

export function CustomersError({ onRetry }: CustomersErrorProps): ReactElement {
  return (
    <div data-slot="customers-error">
      <AdminRetryState
        actionLabel={adminCustomerCopy.retryLabel}
        description={adminCustomerCopy.errorDescription}
        onRetry={onRetry}
        title={adminCustomerCopy.errorTitle}
      />
    </div>
  );
}
