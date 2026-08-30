"use client";

import { Input, Label } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { type ReactElement, useId } from "react";
import {
  adminQuoteCopy,
  adminQuoteDateRangeFilterOptions,
  adminQuoteStatusFilterOptions,
} from "@/config/admin-quotes";
import { isAdminQuoteDateRange, isAdminQuoteStatus } from "@/lib/admin/quotes";
import {
  ADMIN_QUOTE_STATUS_ALL,
  type AdminQuoteFilters,
} from "@/types/admin-quote";

const selectClassName =
  "flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body text-foreground shadow-none transition-colors duration-normal ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

export interface QuotesSelectOption {
  label: string;
  value: string;
}

interface QuotesSelectProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: readonly QuotesSelectOption[];
  value: string;
}

export function QuotesSelect({
  id,
  label,
  onChange,
  options,
  value,
}: QuotesSelectProps): ReactElement {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        className={cn(selectClassName)}
        id={id}
        onChange={(event): void => {
          onChange(event.target.value);
        }}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface QuotesDateFieldProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}

export function QuotesDateField({
  id,
  label,
  onChange,
  value,
}: QuotesDateFieldProps): ReactElement {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        onChange={(event): void => {
          onChange(event.target.value);
        }}
        type="date"
        value={value}
      />
    </div>
  );
}

interface QuotesQuickFiltersProps {
  filters: AdminQuoteFilters;
  onFiltersChange: (filters: AdminQuoteFilters) => void;
}

export function QuotesQuickFilters({
  filters,
  onFiltersChange,
}: QuotesQuickFiltersProps): ReactElement {
  const statusId = useId();
  const dateRangeId = useId();

  return (
    <div className="hidden min-w-0 flex-1 grid-cols-2 gap-3 md:grid">
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
        id={dateRangeId}
        label={adminQuoteCopy.dateRangeLabel}
        onChange={(value): void => {
          if (!isAdminQuoteDateRange(value)) {
            return;
          }

          onFiltersChange({
            ...filters,
            dateRange: value,
          });
        }}
        options={adminQuoteDateRangeFilterOptions}
        value={filters.dateRange}
      />
    </div>
  );
}
