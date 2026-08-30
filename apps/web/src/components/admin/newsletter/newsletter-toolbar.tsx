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
import { NewsletterFilterChips } from "@/components/admin/newsletter/newsletter-filter-chips";
import { NewsletterQuickFilters } from "@/components/admin/newsletter/newsletter-filter-controls";
import { NewsletterFilterFields } from "@/components/admin/newsletter/newsletter-filter-fields";
import { adminNewsletterCopy } from "@/config/admin-newsletter";
import type { AdminNewsletterFilters } from "@/types/admin-newsletter";

interface NewsletterToolbarProps {
  filters: AdminNewsletterFilters;
  filtersOpen: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminNewsletterFilters) => void;
  onFiltersOpenChange: (open: boolean) => void;
}

export function NewsletterToolbar({
  filters,
  filtersOpen,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
  onFiltersOpenChange,
}: NewsletterToolbarProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const searchId = useId();

  return (
    <motion.div
      className="flex flex-col gap-3"
      data-slot="newsletter-toolbar"
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
            {adminNewsletterCopy.searchLabel}
          </Label>
          <Input
            aria-label={adminNewsletterCopy.searchLabel}
            id={searchId}
            onChange={(event): void => {
              onFiltersChange({ ...filters, query: event.target.value });
            }}
            placeholder={adminNewsletterCopy.searchPlaceholder}
            type="search"
            value={filters.query}
          />
        </div>
        <NewsletterQuickFilters
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
              {adminNewsletterCopy.filtersLabel}
            </Button>
            <SheetContent
              closeLabel={adminNewsletterCopy.closeFiltersLabel}
              side="right"
            >
              <SheetHeader>
                <SheetTitle>{adminNewsletterCopy.filterSheetTitle}</SheetTitle>
                <SheetDescription>
                  {adminNewsletterCopy.filterSheetDescription}
                </SheetDescription>
              </SheetHeader>
              <NewsletterFilterFields
                filters={filters}
                onFiltersChange={onFiltersChange}
              />
            </SheetContent>
          </Sheet>
          <Button
            disabled
            title={adminNewsletterCopy.exportUnavailable}
            type="button"
          >
            {adminNewsletterCopy.exportAction}
          </Button>
        </div>
      </div>
      <NewsletterFilterChips
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onFiltersChange={onFiltersChange}
      />
    </motion.div>
  );
}
