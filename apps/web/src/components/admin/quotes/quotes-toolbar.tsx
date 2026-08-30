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
import { QuotesFilterChips } from "@/components/admin/quotes/quotes-filter-chips";
import { QuotesQuickFilters } from "@/components/admin/quotes/quotes-filter-controls";
import { QuotesFilterFields } from "@/components/admin/quotes/quotes-filter-fields";
import { adminQuoteCopy } from "@/config/admin-quotes";
import type { AdminQuoteFilters } from "@/types/admin-quote";

interface QuotesToolbarProps {
  filters: AdminQuoteFilters;
  filtersOpen: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminQuoteFilters) => void;
  onFiltersOpenChange: (open: boolean) => void;
}

export function QuotesToolbar({
  filters,
  filtersOpen,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
  onFiltersOpenChange,
}: QuotesToolbarProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const searchId = useId();

  return (
    <motion.div
      className="flex flex-col gap-3"
      data-slot="quotes-toolbar"
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
            {adminQuoteCopy.searchLabel}
          </Label>
          <Input
            aria-label={adminQuoteCopy.searchLabel}
            id={searchId}
            onChange={(event): void => {
              onFiltersChange({ ...filters, query: event.target.value });
            }}
            placeholder={adminQuoteCopy.searchPlaceholder}
            type="search"
            value={filters.query}
          />
        </div>
        <QuotesQuickFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
        />
        <div className="flex items-center gap-2">
          <Sheet onOpenChange={onFiltersOpenChange} open={filtersOpen}>
            <Button
              aria-expanded={filtersOpen}
              onClick={(): void => onFiltersOpenChange(true)}
              type="button"
              variant="outline"
            >
              <FilterIcon />
              {adminQuoteCopy.filtersLabel}
            </Button>
            <SheetContent
              closeLabel={adminQuoteCopy.closeFiltersLabel}
              side="right"
            >
              <SheetHeader>
                <SheetTitle>{adminQuoteCopy.filterSheetTitle}</SheetTitle>
                <SheetDescription>
                  {adminQuoteCopy.filterSheetDescription}
                </SheetDescription>
              </SheetHeader>
              <QuotesFilterFields
                filters={filters}
                onFiltersChange={onFiltersChange}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <QuotesFilterChips
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onFiltersChange={onFiltersChange}
      />
    </motion.div>
  );
}
