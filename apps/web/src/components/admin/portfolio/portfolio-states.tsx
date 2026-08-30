"use client";

import { Button, Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PortfolioIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminPortfolioCopy } from "@/config/admin-portfolio";

interface PortfolioNoMatchesStateProps {
  onClearFilters: () => void;
}

export function PortfolioEmptyState(): ReactElement {
  return (
    <div data-slot="portfolio-empty-state">
      <AdminEmptyState
        description={adminPortfolioCopy.emptyDescription}
        icon={PortfolioIcon}
        title={adminPortfolioCopy.emptyTitle}
      />
    </div>
  );
}

export function PortfolioNoMatchesState({
  onClearFilters,
}: PortfolioNoMatchesStateProps): ReactElement {
  return (
    <div data-slot="portfolio-no-matches">
      <AdminEmptyState
        description={adminPortfolioCopy.noMatchesDescription}
        icon={PortfolioIcon}
        title={adminPortfolioCopy.noMatchesTitle}
      />
      <Button
        className="mt-4"
        onClick={onClearFilters}
        type="button"
        variant="outline"
      >
        {adminPortfolioCopy.clearFilters}
      </Button>
    </div>
  );
}

export function PortfolioLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-3"
      data-slot="portfolio-loading"
      role="status"
    >
      <p className="sr-only">{adminPortfolioCopy.loadingLabel}</p>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-2/3 max-w-full" />
    </div>
  );
}

interface PortfolioErrorProps {
  onRetry: () => void;
}

export function PortfolioError({ onRetry }: PortfolioErrorProps): ReactElement {
  return (
    <div data-slot="portfolio-error">
      <AdminRetryState
        actionLabel={adminPortfolioCopy.retryLabel}
        description={adminPortfolioCopy.errorDescription}
        onRetry={onRetry}
        title={adminPortfolioCopy.errorTitle}
      />
    </div>
  );
}
