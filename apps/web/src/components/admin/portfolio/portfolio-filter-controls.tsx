"use client";

import { type ReactElement, useId } from "react";
import { AdminListSelect } from "@/components/admin/admin-list-fields";
import {
  adminPortfolioCategoryFilterOptions,
  adminPortfolioCopy,
  adminPortfolioDateRangeFilterOptions,
  adminPortfolioVisibilityFilterOptions,
} from "@/config/admin-portfolio";
import {
  isAdminPortfolioCategory,
  isAdminPortfolioDateRange,
  isAdminPortfolioVisibility,
} from "@/lib/admin/portfolio";
import type { AdminPortfolioFilters } from "@/types/admin-portfolio";

interface PortfolioQuickFiltersProps {
  filters: AdminPortfolioFilters;
  onFiltersChange: (filters: AdminPortfolioFilters) => void;
}

export function PortfolioQuickFilters({
  filters,
  onFiltersChange,
}: PortfolioQuickFiltersProps): ReactElement {
  const categoryId = useId();
  const visibilityId = useId();
  const dateRangeId = useId();

  return (
    <div className="hidden min-w-0 flex-1 grid-cols-3 gap-3 md:grid">
      <AdminListSelect
        id={categoryId}
        label={adminPortfolioCopy.categoryLabel}
        onChange={(value): void => {
          if (value !== "" && !isAdminPortfolioCategory(value)) {
            return;
          }

          onFiltersChange({ ...filters, category: value });
        }}
        options={adminPortfolioCategoryFilterOptions}
        value={filters.category}
      />
      <AdminListSelect
        id={visibilityId}
        label={adminPortfolioCopy.visibilityLabel}
        onChange={(value): void => {
          if (!isAdminPortfolioVisibility(value)) {
            return;
          }

          onFiltersChange({ ...filters, visibility: value });
        }}
        options={adminPortfolioVisibilityFilterOptions}
        value={filters.visibility}
      />
      <AdminListSelect
        id={dateRangeId}
        label={adminPortfolioCopy.dateRangeLabel}
        onChange={(value): void => {
          if (!isAdminPortfolioDateRange(value)) {
            return;
          }

          onFiltersChange({ ...filters, dateRange: value });
        }}
        options={adminPortfolioDateRangeFilterOptions}
        value={filters.dateRange}
      />
    </div>
  );
}
