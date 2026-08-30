"use client";

import { type ReactElement, useId } from "react";
import {
  AdminListDateField,
  AdminListSelect,
} from "@/components/admin/admin-list-fields";
import {
  adminBlogCopy,
  adminBlogDateRangeFilterOptions,
  adminBlogStatusFilterOptions,
} from "@/config/admin-blog";
import { isAdminBlogDateRange, isAdminBlogStatus } from "@/lib/admin/blog";
import {
  ADMIN_BLOG_STATUS_ALL,
  type AdminBlogFilters,
} from "@/types/admin-blog";

interface BlogFilterFieldsProps {
  filters: AdminBlogFilters;
  onFiltersChange: (filters: AdminBlogFilters) => void;
}

export function BlogFilterFields({
  filters,
  onFiltersChange,
}: BlogFilterFieldsProps): ReactElement {
  const statusId = useId();
  const dateRangeId = useId();
  const fromId = useId();
  const toId = useId();
  const showCustomDates = filters.dateRange === "custom";

  return (
    <div className="flex flex-col gap-4">
      <AdminListSelect
        id={statusId}
        label={adminBlogCopy.statusLabel}
        onChange={(value): void => {
          if (value !== ADMIN_BLOG_STATUS_ALL && !isAdminBlogStatus(value)) {
            return;
          }

          onFiltersChange({ ...filters, status: value });
        }}
        options={adminBlogStatusFilterOptions}
        value={filters.status}
      />
      <AdminListSelect
        id={dateRangeId}
        label={adminBlogCopy.dateRangeLabel}
        onChange={(value): void => {
          if (!isAdminBlogDateRange(value)) {
            return;
          }

          onFiltersChange({
            ...filters,
            createdFrom: value === "custom" ? filters.createdFrom : "",
            createdTo: value === "custom" ? filters.createdTo : "",
            dateRange: value,
          });
        }}
        options={adminBlogDateRangeFilterOptions}
        value={filters.dateRange}
      />
      {showCustomDates ? (
        <>
          <AdminListDateField
            id={fromId}
            label={adminBlogCopy.dateFromLabel}
            onChange={(createdFrom): void => {
              onFiltersChange({ ...filters, createdFrom });
            }}
            value={filters.createdFrom}
          />
          <AdminListDateField
            id={toId}
            label={adminBlogCopy.dateToLabel}
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
