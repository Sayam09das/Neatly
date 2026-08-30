"use client";

import { Input, Label } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { type ReactElement, useId } from "react";
import {
  adminContactCopy,
  adminContactDateRangeFilterOptions,
  adminContactStatusFilterOptions,
} from "@/config/admin-contacts";
import {
  isAdminContactDateRange,
  isAdminContactStatus,
} from "@/lib/admin/contacts";
import {
  ADMIN_CONTACT_STATUS_ALL,
  type AdminContactFilters,
} from "@/types/admin-contact";

const selectClassName =
  "flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body text-foreground shadow-none transition-colors duration-normal ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

export interface ContactsSelectOption {
  label: string;
  value: string;
}

interface ContactsSelectProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: readonly ContactsSelectOption[];
  value: string;
}

export function ContactsSelect({
  id,
  label,
  onChange,
  options,
  value,
}: ContactsSelectProps): ReactElement {
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

interface ContactsDateFieldProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}

export function ContactsDateField({
  id,
  label,
  onChange,
  value,
}: ContactsDateFieldProps): ReactElement {
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

interface ContactsQuickFiltersProps {
  filters: AdminContactFilters;
  onFiltersChange: (filters: AdminContactFilters) => void;
}

export function ContactsQuickFilters({
  filters,
  onFiltersChange,
}: ContactsQuickFiltersProps): ReactElement {
  const statusId = useId();
  const dateRangeId = useId();

  return (
    <div className="hidden min-w-0 flex-1 grid-cols-2 gap-3 md:grid">
      <ContactsSelect
        id={statusId}
        label={adminContactCopy.statusLabel}
        onChange={(value): void => {
          if (
            value !== ADMIN_CONTACT_STATUS_ALL &&
            !isAdminContactStatus(value)
          ) {
            return;
          }

          onFiltersChange({
            ...filters,
            status: value,
          });
        }}
        options={adminContactStatusFilterOptions}
        value={filters.status}
      />
      <ContactsSelect
        id={dateRangeId}
        label={adminContactCopy.dateRangeLabel}
        onChange={(value): void => {
          if (!isAdminContactDateRange(value)) {
            return;
          }

          onFiltersChange({
            ...filters,
            dateRange: value,
          });
        }}
        options={adminContactDateRangeFilterOptions}
        value={filters.dateRange}
      />
    </div>
  );
}
