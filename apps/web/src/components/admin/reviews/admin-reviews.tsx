"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { ReviewsTable } from "@/components/admin/reviews/reviews-table";
import { ReviewsToolbar } from "@/components/admin/reviews/reviews-toolbar";
import {
  adminReviewCopy,
  adminReviewFilterCatalog,
  defaultAdminReviewFilters,
} from "@/config/admin-reviews";
import { filterReviews, hasActiveReviewFilters } from "@/lib/admin/reviews";
import type {
  AdminReviewFilterCatalog,
  AdminReviewFilters,
  AdminReviewPresentation,
} from "@/types/admin-review";

interface AdminReviewsProps {
  filterCatalog?: AdminReviewFilterCatalog;
  presentation: AdminReviewPresentation;
}

export function AdminReviews({
  filterCatalog = adminReviewFilterCatalog,
  presentation,
}: AdminReviewsProps): ReactElement {
  const [filters, setFilters] = useState<AdminReviewFilters>(
    defaultAdminReviewFilters,
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sourceReviews =
    presentation.status === "ready" ? presentation.reviews : [];
  const visibleReviews = filterReviews(sourceReviews, filters);
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
