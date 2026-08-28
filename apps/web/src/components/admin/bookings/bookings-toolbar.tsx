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
import { BookingsFilterChips } from "@/components/admin/bookings/bookings-filter-chips";
import { BookingsQuickFilters } from "@/components/admin/bookings/bookings-filter-controls";
import { BookingsFilterFields } from "@/components/admin/bookings/bookings-filter-fields";
import { adminBookingCopy } from "@/config/admin-bookings";
import type {
  AdminBookingFilterCatalog,
  AdminBookingFilters,
} from "@/types/admin-booking";

interface BookingsToolbarProps {
  catalog: AdminBookingFilterCatalog;
  filters: AdminBookingFilters;
  filtersOpen: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  onFiltersChange: (filters: AdminBookingFilters) => void;
  onFiltersOpenChange: (open: boolean) => void;
}

export function BookingsToolbar({
  catalog,
  filters,
  filtersOpen,
  hasActiveFilters,
  onClearFilters,
  onCreate,
  onFiltersChange,
  onFiltersOpenChange,
}: BookingsToolbarProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const searchId = useId();

  return (
    <motion.div
      className="flex flex-col gap-3"
      data-slot="bookings-toolbar"
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
            {adminBookingCopy.searchLabel}
          </Label>
          <Input
            aria-label={adminBookingCopy.searchLabel}
            id={searchId}
            onChange={(event): void => {
              onFiltersChange({ ...filters, query: event.target.value });
            }}
            placeholder={adminBookingCopy.searchPlaceholder}
            type="search"
            value={filters.query}
          />
        </div>
        <BookingsQuickFilters
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
              {adminBookingCopy.filtersLabel}
            </Button>
            <SheetContent
              closeLabel={adminBookingCopy.closeFiltersLabel}
              side="right"
            >
              <SheetHeader>
                <SheetTitle>{adminBookingCopy.filterSheetTitle}</SheetTitle>
                <SheetDescription>
                  {adminBookingCopy.filterSheetDescription}
                </SheetDescription>
              </SheetHeader>
              <BookingsFilterFields
                catalog={catalog}
                filters={filters}
                onFiltersChange={onFiltersChange}
              />
            </SheetContent>
          </Sheet>
          <Button onClick={onCreate} type="button">
            {adminBookingCopy.primaryAction}
          </Button>
        </div>
      </div>
      <BookingsFilterChips
        catalog={catalog}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onFiltersChange={onFiltersChange}
      />
    </motion.div>
  );
}
