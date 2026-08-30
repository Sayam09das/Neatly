"use client";

import { Button, Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { BlogIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { adminBlogCopy } from "@/config/admin-blog";

interface BlogNoMatchesStateProps {
  onClearFilters: () => void;
}

export function BlogEmptyState(): ReactElement {
  return (
    <div data-slot="blog-empty-state">
      <AdminEmptyState
        description={adminBlogCopy.emptyDescription}
        icon={BlogIcon}
        title={adminBlogCopy.emptyTitle}
      />
    </div>
  );
}

export function BlogNoMatchesState({
  onClearFilters,
}: BlogNoMatchesStateProps): ReactElement {
  return (
    <div data-slot="blog-no-matches">
      <AdminEmptyState
        description={adminBlogCopy.noMatchesDescription}
        icon={BlogIcon}
        title={adminBlogCopy.noMatchesTitle}
      />
      <Button
        className="mt-4"
        onClick={onClearFilters}
        type="button"
        variant="outline"
      >
        {adminBlogCopy.clearFilters}
      </Button>
    </div>
  );
}

export function BlogLoading(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="space-y-3"
      data-slot="blog-loading"
      role="status"
    >
      <p className="sr-only">{adminBlogCopy.loadingLabel}</p>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-2/3 max-w-full" />
    </div>
  );
}

interface BlogErrorProps {
  onRetry: () => void;
}

export function BlogError({ onRetry }: BlogErrorProps): ReactElement {
  return (
    <div data-slot="blog-error">
      <AdminRetryState
        actionLabel={adminBlogCopy.retryLabel}
        description={adminBlogCopy.errorDescription}
        onRetry={onRetry}
        title={adminBlogCopy.errorTitle}
      />
    </div>
  );
}
