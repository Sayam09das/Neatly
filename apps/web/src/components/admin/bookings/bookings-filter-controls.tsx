"use client";

import { Input, Label } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { type ReactElement, useId } from "react";
import {
  adminBookingCopy,
  adminBookingStatusFilterOptions,
} from "@/config/admin-bookings";
import type {
  AdminBookingFilters,
  AdminBookingStatusFilter,
} from "@/types/admin-booking";

const selectClassName =
  "flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body text-foreground shadow-none transition-colors duration-normal ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

export interface BookingsSelectOption {
  label: string;
  value: string;
}

interface BookingsSelectProps {
  emptyLabel?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: readonly BookingsSelectOption[];
  value: string;
}

export function BookingsSelect({
  emptyLabel,
  id,
  label,
  onChange,
  options,
  value,
}: BookingsSelectProps): ReactElement {
  const isEmpty = options.length === 0;

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        className={cn(selectClassName)}
        disabled={isEmpty}
        id={id}
        onChange={(event): void => {
          onChange(event.target.value);
        }}
        value={isEmpty ? "" : value}
      >
        {isEmpty ? (
          <option value="">{emptyLabel}</option>
        ) : (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

interface BookingsDateFieldProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}

export function BookingsDateField({
  id,
  label,
  onChange,
  value,
}: BookingsDateFieldProps): ReactElement {
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

interface BookingsQuickFiltersProps {
  filters: AdminBookingFilters;
  onFiltersChange: (filters: AdminBookingFilters) => void;
}

export function BookingsQuickFilters({
  filters,
  onFiltersChange,
}: BookingsQuickFiltersProps): ReactElement {
  const statusId = useId();
  const fromId = useId();
  const toId = useId();

  return (
    <div className="hidden min-w-0 flex-1 grid-cols-3 gap-3 md:grid">
      <BookingsSelect
        id={statusId}
        label={adminBookingCopy.statusLabel}
        onChange={(value): void => {
          onFiltersChange({
            ...filters,
            status: value as AdminBookingStatusFilter,
          });
        }}
        options={adminBookingStatusFilterOptions}
        value={filters.status}
      />
      <BookingsDateField
        id={fromId}
        label={adminBookingCopy.dateFromLabel}
        onChange={(scheduledFrom): void => {
          onFiltersChange({ ...filters, scheduledFrom });
        }}
        value={filters.scheduledFrom}
      />
      <BookingsDateField
        id={toId}
        label={adminBookingCopy.dateToLabel}
        onChange={(scheduledTo): void => {
          onFiltersChange({ ...filters, scheduledTo });
        }}
        value={filters.scheduledTo}
      />
    </div>
  );
}
