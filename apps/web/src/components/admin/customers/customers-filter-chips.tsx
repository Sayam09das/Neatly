"use client";

import { Button } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { adminCustomerCopy } from "@/config/admin-customers";
import { formatCustomerJoinedFilterChip } from "@/lib/admin/customers";
import type {
  AdminCustomerFilterCatalog,
  AdminCustomerFilters,
} from "@/types/admin-customer";

interface CustomersFilterChipsProps {
  catalog: AdminCustomerFilterCatalog;
  filters: AdminCustomerFilters;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminCustomerFilters) => void;
}

export function CustomersFilterChips({
  catalog,
  filters,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
}: CustomersFilterChipsProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const dateChip = formatCustomerJoinedFilterChip(filters);
  const statusLabel = catalog.statuses.find(
    (option) => option.id === filters.status,
  )?.label;

  return (
    <AnimatePresence>
      {hasActiveFilters ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
          data-slot="customers-filter-chips"
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
              label={`${adminCustomerCopy.searchLabel}: ${filters.query.trim()}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, query: "" });
              }}
            />
          ) : null}
          {statusLabel !== undefined ? (
            <FilterChip
              label={`${adminCustomerCopy.statusLabel}: ${statusLabel}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, status: "" });
              }}
            />
          ) : null}
          {dateChip !== null ? (
            <FilterChip
              label={`${adminCustomerCopy.filterDateLabel}: ${dateChip}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  joinedFrom: "",
                  joinedTo: "",
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
            {adminCustomerCopy.clearFilters}
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
