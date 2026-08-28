"use client";

import { Button } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { adminServiceCopy } from "@/config/admin-services";
import type {
  AdminServiceFilterCatalog,
  AdminServiceFilters,
} from "@/types/admin-service";

interface ServicesFilterChipsProps {
  catalog: AdminServiceFilterCatalog;
  filters: AdminServiceFilters;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminServiceFilters) => void;
}

export function ServicesFilterChips({
  catalog,
  filters,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
}: ServicesFilterChipsProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const statusLabel = catalog.statuses.find(
    (option) => option.id === filters.status,
  )?.label;

  return (
    <AnimatePresence>
      {hasActiveFilters ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
          data-slot="services-filter-chips"
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
              label={`${adminServiceCopy.searchLabel}: ${filters.query.trim()}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, query: "" });
              }}
            />
          ) : null}
          {statusLabel !== undefined ? (
            <FilterChip
              label={`${adminServiceCopy.statusLabel}: ${statusLabel}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, status: "" });
              }}
            />
          ) : null}
          <Button
            onClick={onClearFilters}
            size="sm"
            type="button"
            variant="ghost"
          >
            {adminServiceCopy.clearFilters}
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
