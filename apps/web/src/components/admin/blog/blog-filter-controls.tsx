"use client";

import { type ReactElement, useId } from "react";
import { AdminListSelect } from "@/components/admin/admin-list-fields";
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

interface BlogQuickFiltersProps {
  filters: AdminBlogFilters;
  onFiltersChange: (filters: AdminBlogFilters) => void;
}

export function BlogQuickFilters({
  filters,
  onFiltersChange,
}: BlogQuickFiltersProps): ReactElement {
  const statusId = useId();
  const dateRangeId = useId();

  return (
    <div className="hidden min-w-0 flex-1 grid-cols-2 gap-3 md:grid">
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

          onFiltersChange({ ...filters, dateRange: value });
        }}
        options={adminBlogDateRangeFilterOptions}
        value={filters.dateRange}
      />
    </div>
  );
}
