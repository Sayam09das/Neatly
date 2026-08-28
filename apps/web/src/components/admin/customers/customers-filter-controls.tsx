"use client";

import { Input, Label } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { type ReactElement, useId } from "react";
import { adminCustomerCopy } from "@/config/admin-customers";
import type { AdminCustomerFilters } from "@/types/admin-customer";

const selectClassName =
  "flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body text-foreground shadow-none transition-colors duration-normal ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

export interface CustomersSelectOption {
  label: string;
  value: string;
}

interface CustomersSelectProps {
  emptyLabel?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: readonly CustomersSelectOption[];
  value: string;
}

export function CustomersSelect({
  emptyLabel,
  id,
  label,
  onChange,
  options,
  value,
}: CustomersSelectProps): ReactElement {
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

interface CustomersDateFieldProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}

export function CustomersDateField({
  id,
  label,
  onChange,
  value,
}: CustomersDateFieldProps): ReactElement {
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

interface CustomersQuickFiltersProps {
  filters: AdminCustomerFilters;
  onFiltersChange: (filters: AdminCustomerFilters) => void;
}

export function CustomersQuickFilters({
  filters,
  onFiltersChange,
}: CustomersQuickFiltersProps): ReactElement {
  const fromId = useId();
  const toId = useId();

  return (
    <div className="hidden min-w-0 flex-1 grid-cols-2 gap-3 md:grid">
      <CustomersDateField
        id={fromId}
        label={adminCustomerCopy.joinedFromLabel}
        onChange={(joinedFrom): void => {
          onFiltersChange({ ...filters, joinedFrom });
        }}
        value={filters.joinedFrom}
      />
      <CustomersDateField
        id={toId}
        label={adminCustomerCopy.joinedToLabel}
        onChange={(joinedTo): void => {
          onFiltersChange({ ...filters, joinedTo });
        }}
        value={filters.joinedTo}
      />
    </div>
  );
}
