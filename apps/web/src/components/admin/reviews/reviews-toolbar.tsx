"use client";

import {
  Button,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@neatly/ui";
import { motion } from "framer-motion";
import { type ReactElement, useId } from "react";
import { getMotionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { FilterIcon } from "@/components/admin/admin-icons";
import { ReviewsFilterChips } from "@/components/admin/reviews/reviews-filter-chips";
import {
  ReviewsFilterFields,
  ReviewsQuickFilters,
} from "@/components/admin/reviews/reviews-filter-controls";
import { adminReviewCopy } from "@/config/admin-reviews";
import type {
  AdminReviewFilterCatalog,
  AdminReviewFilters,
} from "@/types/admin-review";

interface ReviewsToolbarProps {
  catalog: AdminReviewFilterCatalog;
  filters: AdminReviewFilters;
  filtersOpen: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminReviewFilters) => void;
  onFiltersOpenChange: (open: boolean) => void;
}

export function ReviewsToolbar({
  catalog,
  filters,
  filtersOpen,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
  onFiltersOpenChange,
}: ReviewsToolbarProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const searchId = useId();

  return (
    <motion.div
      className="flex flex-col gap-3"
      data-slot="reviews-toolbar"
      variants={{
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: getMotionTransition(prefersReducedMotion),
        },
      }}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <Label className="sr-only" htmlFor={searchId}>
            {adminReviewCopy.searchLabel}
          </Label>
          <Input
            aria-label={adminReviewCopy.searchLabel}
            id={searchId}
            onChange={(event): void => {
              onFiltersChange({ ...filters, query: event.target.value });
            }}
            placeholder={adminReviewCopy.searchPlaceholder}
            type="search"
            value={filters.query}
          />
        </div>
        <ReviewsQuickFilters
          catalog={catalog}
          filters={filters}
          onFiltersChange={onFiltersChange}
        />
        <Sheet onOpenChange={onFiltersOpenChange} open={filtersOpen}>
          <Button
            aria-expanded={filtersOpen}
            onClick={(): void => onFiltersOpenChange(true)}
            type="button"
            variant="outline"
          >
            <FilterIcon />
            {adminReviewCopy.filtersLabel}
          </Button>
          <SheetContent
            closeLabel={adminReviewCopy.closeFiltersLabel}
            side="right"
          >
            <SheetHeader>
              <SheetTitle>{adminReviewCopy.filterSheetTitle}</SheetTitle>
              <SheetDescription>
                {adminReviewCopy.filterSheetDescription}
              </SheetDescription>
            </SheetHeader>
            <ReviewsFilterFields
              catalog={catalog}
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          </SheetContent>
        </Sheet>
      </div>
      <ReviewsFilterChips
        catalog={catalog}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onFiltersChange={onFiltersChange}
      />
    </motion.div>
  );
}
