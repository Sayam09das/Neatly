"use client";

import { Button } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { adminContactCopy } from "@/config/admin-contacts";
import {
  formatContactDateFilterChip,
  getContactStatusLabel,
} from "@/lib/admin/contacts";
import {
  ADMIN_CONTACT_DATE_RANGE_ALL,
  ADMIN_CONTACT_STATUS_ALL,
  type AdminContactFilters,
} from "@/types/admin-contact";

interface ContactsFilterChipsProps {
  filters: AdminContactFilters;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminContactFilters) => void;
}

export function ContactsFilterChips({
  filters,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
}: ContactsFilterChipsProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const dateChip = formatContactDateFilterChip(filters);

  return (
    <AnimatePresence>
      {hasActiveFilters ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
          data-slot="contacts-filter-chips"
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
              label={`${adminContactCopy.searchLabel}: ${filters.query.trim()}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, query: "" });
              }}
            />
          ) : null}
          {filters.status !== ADMIN_CONTACT_STATUS_ALL ? (
            <FilterChip
              label={`${adminContactCopy.statusLabel}: ${getContactStatusLabel(filters.status)}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  status: ADMIN_CONTACT_STATUS_ALL,
                });
              }}
            />
          ) : null}
          {dateChip !== null ? (
            <FilterChip
              label={`${adminContactCopy.dateRangeLabel}: ${dateChip}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  createdFrom: "",
                  createdTo: "",
                  dateRange: ADMIN_CONTACT_DATE_RANGE_ALL,
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
            {adminContactCopy.clearFilters}
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
