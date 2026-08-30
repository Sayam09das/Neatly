"use client";

import { type ReactElement, useId } from "react";
import {
  AdminListDateField,
  AdminListSelect,
} from "@/components/admin/admin-list-fields";
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

interface NewsletterFilterFieldsProps {
  filters: AdminNewsletterFilters;
  onFiltersChange: (filters: AdminNewsletterFilters) => void;
}

export function NewsletterFilterFields({
  filters,
  onFiltersChange,
}: NewsletterFilterFieldsProps): ReactElement {
  const statusId = useId();
  const dateRangeId = useId();
  const fromId = useId();
  const toId = useId();
  const showCustomDates = filters.dateRange === "custom";

  return (
    <div className="flex flex-col gap-4">
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

          onFiltersChange({
            ...filters,
            dateRange: value,
            subscribedFrom: value === "custom" ? filters.subscribedFrom : "",
            subscribedTo: value === "custom" ? filters.subscribedTo : "",
          });
        }}
        options={adminNewsletterDateRangeFilterOptions}
        value={filters.dateRange}
      />
      {showCustomDates ? (
        <>
          <AdminListDateField
            id={fromId}
            label={adminNewsletterCopy.dateFromLabel}
            onChange={(subscribedFrom): void => {
              onFiltersChange({ ...filters, subscribedFrom });
            }}
            value={filters.subscribedFrom}
          />
          <AdminListDateField
            id={toId}
            label={adminNewsletterCopy.dateToLabel}
            onChange={(subscribedTo): void => {
              onFiltersChange({ ...filters, subscribedTo });
            }}
            value={filters.subscribedTo}
          />
        </>
      ) : null}
    </div>
  );
}
