"use client";

import { type ReactElement, useId } from "react";
import {
  AdminListDateField,
  AdminListSelect,
} from "@/components/admin/admin-list-fields";
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

interface PortfolioFilterFieldsProps {
  filters: AdminPortfolioFilters;
  onFiltersChange: (filters: AdminPortfolioFilters) => void;
}

export function PortfolioFilterFields({
  filters,
  onFiltersChange,
}: PortfolioFilterFieldsProps): ReactElement {
  const categoryId = useId();
  const visibilityId = useId();
  const dateRangeId = useId();
  const fromId = useId();
  const toId = useId();
  const showCustomDates = filters.dateRange === "custom";

  return (
    <div className="flex flex-col gap-4">
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

          onFiltersChange({
            ...filters,
            createdFrom: value === "custom" ? filters.createdFrom : "",
            createdTo: value === "custom" ? filters.createdTo : "",
            dateRange: value,
          });
        }}
        options={adminPortfolioDateRangeFilterOptions}
        value={filters.dateRange}
      />
      {showCustomDates ? (
        <>
          <AdminListDateField
            id={fromId}
            label={adminPortfolioCopy.dateFromLabel}
            onChange={(createdFrom): void => {
              onFiltersChange({ ...filters, createdFrom });
            }}
            value={filters.createdFrom}
          />
          <AdminListDateField
            id={toId}
            label={adminPortfolioCopy.dateToLabel}
            onChange={(createdTo): void => {
              onFiltersChange({ ...filters, createdTo });
            }}
            value={filters.createdTo}
          />
        </>
      ) : null}
    </div>
  );
}
