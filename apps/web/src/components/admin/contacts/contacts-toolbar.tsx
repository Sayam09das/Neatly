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
import { ContactsFilterChips } from "@/components/admin/contacts/contacts-filter-chips";
import { ContactsQuickFilters } from "@/components/admin/contacts/contacts-filter-controls";
import { ContactsFilterFields } from "@/components/admin/contacts/contacts-filter-fields";
import { adminContactCopy } from "@/config/admin-contacts";
import type { AdminContactFilters } from "@/types/admin-contact";

interface ContactsToolbarProps {
  filters: AdminContactFilters;
  filtersOpen: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminContactFilters) => void;
  onFiltersOpenChange: (open: boolean) => void;
}

export function ContactsToolbar({
  filters,
  filtersOpen,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
  onFiltersOpenChange,
}: ContactsToolbarProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const searchId = useId();

  return (
    <motion.div
      className="flex flex-col gap-3"
      data-slot="contacts-toolbar"
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
            {adminContactCopy.searchLabel}
          </Label>
          <Input
            aria-label={adminContactCopy.searchLabel}
            id={searchId}
            onChange={(event): void => {
              onFiltersChange({ ...filters, query: event.target.value });
            }}
            placeholder={adminContactCopy.searchPlaceholder}
            type="search"
            value={filters.query}
          />
        </div>
        <ContactsQuickFilters
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
              {adminContactCopy.filtersLabel}
            </Button>
            <SheetContent
              closeLabel={adminContactCopy.closeFiltersLabel}
              side="right"
            >
              <SheetHeader>
                <SheetTitle>{adminContactCopy.filterSheetTitle}</SheetTitle>
                <SheetDescription>
                  {adminContactCopy.filterSheetDescription}
                </SheetDescription>
              </SheetHeader>
              <ContactsFilterFields
                filters={filters}
                onFiltersChange={onFiltersChange}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <ContactsFilterChips
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onFiltersChange={onFiltersChange}
      />
    </motion.div>
  );
}
