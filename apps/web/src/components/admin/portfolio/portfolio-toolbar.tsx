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
import { PortfolioFilterChips } from "@/components/admin/portfolio/portfolio-filter-chips";
import { PortfolioQuickFilters } from "@/components/admin/portfolio/portfolio-filter-controls";
import { PortfolioFilterFields } from "@/components/admin/portfolio/portfolio-filter-fields";
import { adminPortfolioCopy } from "@/config/admin-portfolio";
import type { AdminPortfolioFilters } from "@/types/admin-portfolio";

interface PortfolioToolbarProps {
  filters: AdminPortfolioFilters;
  filtersOpen: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminPortfolioFilters) => void;
  onFiltersOpenChange: (open: boolean) => void;
}

export function PortfolioToolbar({
  filters,
  filtersOpen,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
  onFiltersOpenChange,
}: PortfolioToolbarProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const searchId = useId();

  return (
    <motion.div
      className="flex flex-col gap-3"
      data-slot="portfolio-toolbar"
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
            {adminPortfolioCopy.searchLabel}
          </Label>
          <Input
            aria-label={adminPortfolioCopy.searchLabel}
            id={searchId}
            onChange={(event): void => {
              onFiltersChange({ ...filters, query: event.target.value });
            }}
            placeholder={adminPortfolioCopy.searchPlaceholder}
            type="search"
            value={filters.query}
          />
        </div>
        <PortfolioQuickFilters
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
              {adminPortfolioCopy.filtersLabel}
            </Button>
            <SheetContent
              closeLabel={adminPortfolioCopy.closeFiltersLabel}
              side="right"
            >
              <SheetHeader>
                <SheetTitle>{adminPortfolioCopy.filterSheetTitle}</SheetTitle>
                <SheetDescription>
                  {adminPortfolioCopy.filterSheetDescription}
                </SheetDescription>
              </SheetHeader>
              <PortfolioFilterFields
                filters={filters}
                onFiltersChange={onFiltersChange}
              />
            </SheetContent>
          </Sheet>
          <Button
            disabled
            title={adminPortfolioCopy.createUnavailable}
            type="button"
          >
            {adminPortfolioCopy.createAction}
          </Button>
        </div>
      </div>
      <PortfolioFilterChips
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onFiltersChange={onFiltersChange}
      />
    </motion.div>
  );
}
