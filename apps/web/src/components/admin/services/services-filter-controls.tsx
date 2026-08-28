"use client";

import { Label } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { type ReactElement, useId } from "react";
import { adminServiceCopy } from "@/config/admin-services";
import type {
  AdminServiceFilterCatalog,
  AdminServiceFilters,
} from "@/types/admin-service";

const selectClassName =
  "flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body text-foreground shadow-none transition-colors duration-normal ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

export interface ServicesSelectOption {
  label: string;
  value: string;
}

interface ServicesSelectProps {
  allLabel: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: readonly ServicesSelectOption[];
  value: string;
}

export function ServicesSelect({
  allLabel,
  id,
  label,
  onChange,
  options,
  value,
}: ServicesSelectProps): ReactElement {
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
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface ServicesQuickFiltersProps {
  catalog: AdminServiceFilterCatalog;
  filters: AdminServiceFilters;
  onFiltersChange: (filters: AdminServiceFilters) => void;
}

export function ServicesQuickFilters({
  catalog,
  filters,
  onFiltersChange,
}: ServicesQuickFiltersProps): ReactElement {
  const statusId = useId();

  return (
    <div className="hidden min-w-0 md:block md:w-56">
      <ServicesSelect
        allLabel={adminServiceCopy.statusAll}
        id={statusId}
        label={adminServiceCopy.statusLabel}
        onChange={(status): void => {
          onFiltersChange({ ...filters, status });
        }}
        options={catalog.statuses.map((option) => ({
          label: option.label,
          value: option.id,
        }))}
        value={filters.status}
      />
    </div>
  );
}
