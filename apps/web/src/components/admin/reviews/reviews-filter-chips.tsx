"use client";

import { Button } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { adminReviewCopy } from "@/config/admin-reviews";
import { formatReviewDateChip } from "@/lib/admin/reviews";
import type {
  AdminReviewFilterCatalog,
  AdminReviewFilters,
} from "@/types/admin-review";

interface ReviewsFilterChipsProps {
  catalog: AdminReviewFilterCatalog;
  filters: AdminReviewFilters;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminReviewFilters) => void;
}

export function ReviewsFilterChips({
  catalog,
  filters,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
}: ReviewsFilterChipsProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const ratingLabel = catalog.ratings.find(
    (option) => option.id === filters.rating,
  )?.label;
  const statusLabel = catalog.statuses.find(
    (option) => option.id === filters.status,
  )?.label;
  const categoryLabel = catalog.categories.find(
    (option) => option.id === filters.category,
  )?.label;
  const dateChip = formatReviewDateChip(filters);

  return (
    <AnimatePresence>
      {hasActiveFilters ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
          data-slot="reviews-filter-chips"
          exit={{
            opacity: prefersReducedMotion ? 1 : 0,
            y: prefersReducedMotion ? 0 : -4,
          }}
          initial={{
            opacity: prefersReducedMotion ? 1 : 0,
            y: prefersReducedMotion ? 0 : -4,
          }}
        >
          {filters.query.trim() !== "" ? (
            <FilterChip
              label={`${adminReviewCopy.searchLabel}: ${filters.query.trim()}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, query: "" });
              }}
            />
          ) : null}
          {ratingLabel !== undefined ? (
            <FilterChip
              label={`${adminReviewCopy.ratingLabel}: ${ratingLabel}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, rating: "" });
              }}
            />
          ) : null}
          {statusLabel !== undefined ? (
            <FilterChip
              label={`${adminReviewCopy.statusLabel}: ${statusLabel}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, status: "" });
              }}
            />
          ) : null}
          {categoryLabel !== undefined ? (
            <FilterChip
              label={`${adminReviewCopy.categoryLabel}: ${categoryLabel}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, category: "" });
              }}
            />
          ) : null}
          {dateChip !== null ? (
            <FilterChip
              label={`${adminReviewCopy.filterDateLabel}: ${dateChip}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  createdFrom: "",
                  createdTo: "",
                });
              }}
            />
          ) : null}
          <Button
            onClick={onClearFilters}
            size="sm"
            type="button"
            variant="ghost"
          >
            {adminReviewCopy.clearFilters}
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

function FilterChip({ label, onRemove }: FilterChipProps): ReactElement {
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
