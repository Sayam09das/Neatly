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
import { CustomersFilterChips } from "@/components/admin/customers/customers-filter-chips";
import { CustomersQuickFilters } from "@/components/admin/customers/customers-filter-controls";
import { CustomersFilterFields } from "@/components/admin/customers/customers-filter-fields";
import { adminCustomerCopy } from "@/config/admin-customers";
import type {
  AdminCustomerFilterCatalog,
  AdminCustomerFilters,
} from "@/types/admin-customer";

interface CustomersToolbarProps {
  catalog: AdminCustomerFilterCatalog;
  filters: AdminCustomerFilters;
  filtersOpen: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  onFiltersChange: (filters: AdminCustomerFilters) => void;
  onFiltersOpenChange: (open: boolean) => void;
}

export function CustomersToolbar({
  catalog,
  filters,
  filtersOpen,
  hasActiveFilters,
  onClearFilters,
  onCreate,
  onFiltersChange,
  onFiltersOpenChange,
}: CustomersToolbarProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const searchId = useId();

  return (
    <motion.div
      className="flex flex-col gap-3"
      data-slot="customers-toolbar"
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
            {adminCustomerCopy.searchLabel}
          </Label>
          <Input
            aria-label={adminCustomerCopy.searchLabel}
            id={searchId}
            onChange={(event): void => {
              onFiltersChange({ ...filters, query: event.target.value });
            }}
            placeholder={adminCustomerCopy.searchPlaceholder}
            type="search"
            value={filters.query}
          />
        </div>
        <CustomersQuickFilters
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
              {adminCustomerCopy.filtersLabel}
            </Button>
            <SheetContent
              closeLabel={adminCustomerCopy.closeFiltersLabel}
              side="right"
            >
              <SheetHeader>
                <SheetTitle>{adminCustomerCopy.filterSheetTitle}</SheetTitle>
                <SheetDescription>
                  {adminCustomerCopy.filterSheetDescription}
                </SheetDescription>
              </SheetHeader>
              <CustomersFilterFields
                catalog={catalog}
                filters={filters}
                onFiltersChange={onFiltersChange}
              />
            </SheetContent>
          </Sheet>
          <Button onClick={onCreate} type="button">
            {adminCustomerCopy.primaryAction}
          </Button>
        </div>
      </div>
      <CustomersFilterChips
        catalog={catalog}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onFiltersChange={onFiltersChange}
      />
    </motion.div>
  );
}
