"use client";

import { type ReactElement, useId } from "react";
import {
  QuotesDateField,
  QuotesSelect,
} from "@/components/admin/quotes/quotes-filter-controls";
import {
  adminQuoteCopy,
  adminQuoteDateRangeFilterOptions,
  adminQuoteServiceFilterOptions,
  adminQuoteStatusFilterOptions,
} from "@/config/admin-quotes";
import { isAdminQuoteDateRange, isAdminQuoteStatus } from "@/lib/admin/quotes";
import {
  ADMIN_QUOTE_STATUS_ALL,
  type AdminQuoteFilters,
} from "@/types/admin-quote";

interface QuotesFilterFieldsProps {
  filters: AdminQuoteFilters;
  onFiltersChange: (filters: AdminQuoteFilters) => void;
}

export function QuotesFilterFields({
  filters,
  onFiltersChange,
}: QuotesFilterFieldsProps): ReactElement {
  const statusId = useId();
  const serviceId = useId();
  const dateRangeId = useId();
  const fromId = useId();
  const toId = useId();
  const showCustomDates = filters.dateRange === "custom";

  return (
    <div className="flex flex-col gap-4">
      <QuotesSelect
        id={statusId}
        label={adminQuoteCopy.statusLabel}
        onChange={(value): void => {
          if (value !== ADMIN_QUOTE_STATUS_ALL && !isAdminQuoteStatus(value)) {
            return;
          }

          onFiltersChange({
            ...filters,
            status: value,
          });
        }}
        options={adminQuoteStatusFilterOptions}
        value={filters.status}
      />
      <QuotesSelect
        id={serviceId}
        label={adminQuoteCopy.filterServiceLabel}
        onChange={(serviceType): void => {
          onFiltersChange({ ...filters, serviceType });
        }}
        options={adminQuoteServiceFilterOptions}
        value={filters.serviceType}
      />
      <QuotesSelect
        id={dateRangeId}
        label={adminQuoteCopy.dateRangeLabel}
        onChange={(value): void => {
          if (!isAdminQuoteDateRange(value)) {
            return;
          }

          onFiltersChange({
            ...filters,
            dateRange: value,
            requestedFrom: value === "custom" ? filters.requestedFrom : "",
            requestedTo: value === "custom" ? filters.requestedTo : "",
          });
        }}
        options={adminQuoteDateRangeFilterOptions}
        value={filters.dateRange}
      />
      {showCustomDates ? (
        <>
          <QuotesDateField
            id={fromId}
            label={adminQuoteCopy.dateFromLabel}
            onChange={(requestedFrom): void => {
              onFiltersChange({ ...filters, requestedFrom });
            }}
            value={filters.requestedFrom}
          />
          <QuotesDateField
            id={toId}
            label={adminQuoteCopy.dateToLabel}
            onChange={(requestedTo): void => {
              onFiltersChange({ ...filters, requestedTo });
            }}
            value={filters.requestedTo}
          />
        </>
      ) : null}
    </div>
  );
}
