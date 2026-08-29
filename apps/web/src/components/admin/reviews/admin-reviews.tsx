"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { ReviewsTable } from "@/components/admin/reviews/reviews-table";
import { ReviewsToolbar } from "@/components/admin/reviews/reviews-toolbar";
import { ADMIN_SEARCH_DEBOUNCE_MS } from "@/config/admin-api";
import {
  adminReviewCopy,
  adminReviewFilterCatalog,
  defaultAdminReviewFilters,
} from "@/config/admin-reviews";
import {
  type AdminReviewList,
  filterReviews,
  hasActiveReviewFilters,
  listAdminReviews,
} from "@/lib/admin/reviews";
import { useAdminListState } from "@/lib/admin/use-admin-list-state";
import {
  type AdminQueryState,
  useAdminQuery,
} from "@/lib/admin/use-admin-query";
import { useAdminRefresh } from "@/lib/admin/use-admin-refresh";
import { useDebouncedValue } from "@/lib/admin/use-debounced-value";
import type {
  AdminReviewFilterCatalog,
  AdminReviewFilters,
  AdminReviewPresentation,
} from "@/types/admin-review";

interface AdminReviewsProps {
  filterCatalog?: AdminReviewFilterCatalog;
  presentation?: AdminReviewPresentation;
}

export function AdminReviews({
  filterCatalog = adminReviewFilterCatalog,
  presentation,
}: AdminReviewsProps): ReactElement {
  if (presentation === undefined) {
    return <AdminReviewsLive filterCatalog={filterCatalog} />;
  }

  return (
    <AdminReviewsView
      filterCatalog={filterCatalog}
      presentation={presentation}
    />
  );
}

function AdminReviewsLive({
  filterCatalog,
}: {
  filterCatalog: AdminReviewFilterCatalog;
}): ReactElement {
  const { filters, page, setFilters, setPage } = useAdminListState({
    defaults: defaultAdminReviewFilters,
  });
  const debouncedQuery = useDebouncedValue(
    filters.query,
    ADMIN_SEARCH_DEBOUNCE_MS,
  );
  const requestKey = JSON.stringify({
    category: filters.category,
    createdFrom: filters.createdFrom,
    createdTo: filters.createdTo,
    page,
    query: debouncedQuery,
    rating: filters.rating,
    status: filters.status,
  });
  const query = useAdminQuery({
    enabled: true,
    request: (signal) =>
      listAdminReviews(
        {
          ...filters,
          page,
          query: debouncedQuery,
        },
        { signal },
      ),
    requestKey,
  });
  useAdminRefresh("reviews", query.retry);

  return (
    <AdminReviewsView
      filterCatalog={filterCatalog}
      filters={filters}
      onFiltersChange={setFilters}
      onMutated={query.retry}
      onPageChange={setPage}
      presentation={toLiveReviewPresentation(
        query,
        hasActiveReviewFilters(filters),
      )}
    />
  );
}

interface AdminReviewsViewProps {
  filterCatalog: AdminReviewFilterCatalog;
  filters?: AdminReviewFilters;
  onFiltersChange?: (filters: AdminReviewFilters) => void;
  onMutated?: () => void;
  onPageChange?: (page: number) => void;
  presentation: AdminReviewPresentation;
}

function AdminReviewsView({
  filterCatalog,
  filters: filtersProp,
  onFiltersChange,
  onMutated,
  onPageChange,
  presentation,
}: AdminReviewsViewProps): ReactElement {
  const [localFilters, setLocalFilters] = useState<AdminReviewFilters>(
    defaultAdminReviewFilters,
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = filtersProp ?? localFilters;
  const setFilters = onFiltersChange ?? setLocalFilters;
  const sourceReviews =
    presentation.status === "ready" ? presentation.reviews : [];
  const visibleReviews =
    onFiltersChange === undefined
      ? filterReviews(sourceReviews, filters)
      : sourceReviews;
  const hasActiveFilters = hasActiveReviewFilters(filters);

  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-reviews"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminReviewCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminReviewCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <ReviewsToolbar
            catalog={filterCatalog}
            filters={filters}
            filtersOpen={filtersOpen}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminReviewFilters);
            }}
            onFiltersChange={setFilters}
            onFiltersOpenChange={setFiltersOpen}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <ReviewsTable
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminReviewFilters);
            }}
            onMutated={onMutated}
            onPageChange={onPageChange}
            pagination={
              presentation.status === "ready"
                ? presentation.pagination
                : undefined
            }
            presentation={presentation}
            reviews={visibleReviews}
          />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

function toLiveReviewPresentation(
  query: AdminQueryState<AdminReviewList>,
  hasActiveFilters: boolean,
): AdminReviewPresentation {
  if (query.status === "loading") {
    return { status: "loading" };
  }

  if (query.status === "error") {
    return { onRetry: query.retry, status: "error" };
  }

  if (query.data === null || query.data.reviews.length === 0) {
    return hasActiveFilters
      ? {
          pagination: query.data?.pagination,
          reviews: [],
          status: "ready",
        }
      : { status: "empty" };
  }

  return {
    pagination: query.data.pagination,
    reviews: query.data.reviews,
    status: "ready",
  };
}
