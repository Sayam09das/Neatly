"use client";

import { Input, Label } from "@neatly/ui";
import { cn } from "@neatly/utils";
import type { ReactElement } from "react";

const selectClassName =
  "flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body text-foreground shadow-none transition-colors duration-normal ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

export interface AdminListSelectOption {
  label: string;
  value: string;
}

interface AdminListSelectProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: readonly AdminListSelectOption[];
  value: string;
}

export function AdminListSelect({
  id,
  label,
  onChange,
  options,
  value,
}: AdminListSelectProps): ReactElement {
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

interface AdminListDateFieldProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}

export function AdminListDateField({
  id,
  label,
  onChange,
  value,
}: AdminListDateFieldProps): ReactElement {
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

interface AdminListFilterChipProps {
  label: string;
  onRemove: () => void;
}

export function AdminListFilterChip({
  label,
  onRemove,
}: AdminListFilterChipProps): ReactElement {
  return (
    <button
      aria-label={`Remove ${label}`}
      className="inline-flex min-h-touch items-center rounded-full border border-border bg-background px-3 text-caption text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={onRemove}
      type="button"
    >
      {label}
    </button>
  );
}
