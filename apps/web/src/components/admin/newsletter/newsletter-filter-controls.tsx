"use client";

import { type ReactElement, useId } from "react";
import { AdminListSelect } from "@/components/admin/admin-list-fields";
import {
  adminNewsletterCopy,
  adminNewsletterDateRangeFilterOptions,
  adminNewsletterStatusFilterOptions,
} from "@/config/admin-newsletter";
import {
  isAdminNewsletterDateRange,
  isAdminNewsletterStatus,
} from "@/lib/admin/newsletter";
import {
  ADMIN_NEWSLETTER_STATUS_ALL,
  type AdminNewsletterFilters,
} from "@/types/admin-newsletter";

interface NewsletterQuickFiltersProps {
  filters: AdminNewsletterFilters;
  onFiltersChange: (filters: AdminNewsletterFilters) => void;
}

export function NewsletterQuickFilters({
  filters,
  onFiltersChange,
}: NewsletterQuickFiltersProps): ReactElement {
  const statusId = useId();
  const dateRangeId = useId();

  return (
    <div className="hidden min-w-0 flex-1 grid-cols-2 gap-3 md:grid">
      <AdminListSelect
        id={statusId}
        label={adminNewsletterCopy.statusLabel}
        onChange={(value): void => {
          if (
            value !== ADMIN_NEWSLETTER_STATUS_ALL &&
            !isAdminNewsletterStatus(value)
          ) {
            return;
          }

          onFiltersChange({ ...filters, status: value });
        }}
        options={adminNewsletterStatusFilterOptions}
        value={filters.status}
      />
      <AdminListSelect
        id={dateRangeId}
        label={adminNewsletterCopy.dateRangeLabel}
        onChange={(value): void => {
          if (!isAdminNewsletterDateRange(value)) {
            return;
          }

          onFiltersChange({ ...filters, dateRange: value });
        }}
        options={adminNewsletterDateRangeFilterOptions}
        value={filters.dateRange}
      />
    </div>
  );
}
