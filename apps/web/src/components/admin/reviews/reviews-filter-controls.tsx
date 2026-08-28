"use client";

import { Input, Label } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { type ReactElement, useId } from "react";
import { adminReviewCopy } from "@/config/admin-reviews";
import type {
  AdminReviewFilterCatalog,
  AdminReviewFilters,
} from "@/types/admin-review";

const selectClassName =
  "flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body text-foreground shadow-none transition-colors duration-normal ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

interface ReviewsSelectProps {
  allLabel: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: readonly { label: string; value: string }[];
  value: string;
}

export function ReviewsSelect({
  allLabel,
  id,
  label,
  onChange,
  options,
  value,
}: ReviewsSelectProps): ReactElement {
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

interface ReviewsDateFieldProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}

export function ReviewsDateField({
  id,
  label,
  onChange,
  value,
}: ReviewsDateFieldProps): ReactElement {
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

interface ReviewsQuickFiltersProps {
  catalog: AdminReviewFilterCatalog;
  filters: AdminReviewFilters;
  onFiltersChange: (filters: AdminReviewFilters) => void;
}

export function ReviewsQuickFilters({
  catalog,
  filters,
  onFiltersChange,
}: ReviewsQuickFiltersProps): ReactElement {
  const ratingId = useId();

  return (
    <div className="hidden min-w-0 md:block md:w-48">
      <ReviewsSelect
        allLabel={adminReviewCopy.ratingAll}
        id={ratingId}
        label={adminReviewCopy.ratingLabel}
        onChange={(rating): void => {
          onFiltersChange({ ...filters, rating });
        }}
        options={catalog.ratings.map((option) => ({
          label: option.label,
          value: option.id,
        }))}
        value={filters.rating}
      />
    </div>
  );
}

interface ReviewsFilterFieldsProps {
  catalog: AdminReviewFilterCatalog;
  filters: AdminReviewFilters;
  onFiltersChange: (filters: AdminReviewFilters) => void;
}

export function ReviewsFilterFields({
  catalog,
  filters,
  onFiltersChange,
}: ReviewsFilterFieldsProps): ReactElement {
  const ratingId = useId();
  const statusId = useId();
  const categoryId = useId();
  const fromId = useId();
  const toId = useId();

  return (
    <div className="flex flex-col gap-4">
      <ReviewsSelect
        allLabel={adminReviewCopy.ratingAll}
        id={ratingId}
        label={adminReviewCopy.ratingLabel}
        onChange={(rating): void => {
          onFiltersChange({ ...filters, rating });
        }}
        options={catalog.ratings.map((option) => ({
          label: option.label,
          value: option.id,
        }))}
        value={filters.rating}
      />
      <ReviewsSelect
        allLabel={adminReviewCopy.statusAll}
        id={statusId}
        label={adminReviewCopy.statusLabel}
        onChange={(status): void => {
          onFiltersChange({ ...filters, status });
        }}
        options={catalog.statuses.map((option) => ({
          label: option.label,
          value: option.id,
        }))}
        value={filters.status}
      />
      <ReviewsSelect
        allLabel={adminReviewCopy.categoryAll}
        id={categoryId}
        label={adminReviewCopy.categoryLabel}
        onChange={(category): void => {
          onFiltersChange({ ...filters, category });
        }}
        options={catalog.categories.map((option) => ({
          label: option.label,
          value: option.id,
        }))}
        value={filters.category}
      />
      <ReviewsDateField
        id={fromId}
        label={adminReviewCopy.createdFromLabel}
        onChange={(createdFrom): void => {
          onFiltersChange({ ...filters, createdFrom });
        }}
        value={filters.createdFrom}
      />
      <ReviewsDateField
        id={toId}
        label={adminReviewCopy.createdToLabel}
        onChange={(createdTo): void => {
          onFiltersChange({ ...filters, createdTo });
        }}
        value={filters.createdTo}
      />
    </div>
  );
}
