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
import { ServicesFilterChips } from "@/components/admin/services/services-filter-chips";
import { ServicesQuickFilters } from "@/components/admin/services/services-filter-controls";
import { ServicesFilterFields } from "@/components/admin/services/services-filter-fields";
import { adminServiceCopy } from "@/config/admin-services";
import type {
  AdminServiceFilterCatalog,
  AdminServiceFilters,
} from "@/types/admin-service";

interface ServicesToolbarProps {
  catalog: AdminServiceFilterCatalog;
  filters: AdminServiceFilters;
  filtersOpen: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  onFiltersChange: (filters: AdminServiceFilters) => void;
  onFiltersOpenChange: (open: boolean) => void;
}

export function ServicesToolbar({
  catalog,
  filters,
  filtersOpen,
  hasActiveFilters,
  onClearFilters,
  onCreate,
  onFiltersChange,
  onFiltersOpenChange,
}: ServicesToolbarProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const searchId = useId();

  return (
    <motion.div
      className="flex flex-col gap-3"
      data-slot="services-toolbar"
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
            {adminServiceCopy.searchLabel}
          </Label>
          <Input
            aria-label={adminServiceCopy.searchLabel}
            id={searchId}
            onChange={(event): void => {
              onFiltersChange({ ...filters, query: event.target.value });
            }}
            placeholder={adminServiceCopy.searchPlaceholder}
            type="search"
            value={filters.query}
          />
        </div>
        <ServicesQuickFilters
          catalog={catalog}
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
              {adminServiceCopy.filtersLabel}
            </Button>
            <SheetContent
              closeLabel={adminServiceCopy.closeFiltersLabel}
              side="right"
            >
              <SheetHeader>
                <SheetTitle>{adminServiceCopy.filterSheetTitle}</SheetTitle>
                <SheetDescription>
                  {adminServiceCopy.filterSheetDescription}
                </SheetDescription>
              </SheetHeader>
              <ServicesFilterFields
                catalog={catalog}
                filters={filters}
                onFiltersChange={onFiltersChange}
              />
            </SheetContent>
          </Sheet>
          <Button onClick={onCreate} type="button">
            {adminServiceCopy.primaryAction}
          </Button>
        </div>
      </div>
      <ServicesFilterChips
        catalog={catalog}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onFiltersChange={onFiltersChange}
      />
    </motion.div>
  );
}
