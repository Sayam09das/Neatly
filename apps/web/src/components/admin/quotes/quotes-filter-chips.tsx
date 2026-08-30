"use client";

import { Button } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { adminQuoteCopy } from "@/config/admin-quotes";
import {
  formatQuoteDateFilterChip,
  getQuoteServiceLabel,
  getQuoteStatusLabel,
} from "@/lib/admin/quotes";
import {
  ADMIN_QUOTE_DATE_RANGE_ALL,
  ADMIN_QUOTE_STATUS_ALL,
  type AdminQuoteFilters,
} from "@/types/admin-quote";

interface QuotesFilterChipsProps {
  filters: AdminQuoteFilters;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminQuoteFilters) => void;
}

export function QuotesFilterChips({
  filters,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
}: QuotesFilterChipsProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const dateChip = formatQuoteDateFilterChip(filters);
  const serviceLabel =
    filters.serviceType === ""
      ? null
      : getQuoteServiceLabel(filters.serviceType);

  return (
    <AnimatePresence>
      {hasActiveFilters ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
          data-slot="quotes-filter-chips"
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
              label={`${adminQuoteCopy.searchLabel}: ${filters.query.trim()}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, query: "" });
              }}
            />
          ) : null}
          {filters.status !== ADMIN_QUOTE_STATUS_ALL ? (
            <FilterChip
              label={`${adminQuoteCopy.statusLabel}: ${getQuoteStatusLabel(filters.status)}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  status: ADMIN_QUOTE_STATUS_ALL,
                });
              }}
            />
          ) : null}
          {serviceLabel !== null &&
          serviceLabel !== adminQuoteCopy.emptyValue ? (
            <FilterChip
              label={`${adminQuoteCopy.filterServiceLabel}: ${serviceLabel}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, serviceType: "" });
              }}
            />
          ) : null}
          {dateChip !== null ? (
            <FilterChip
              label={`${adminQuoteCopy.dateRangeLabel}: ${dateChip}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  dateRange: ADMIN_QUOTE_DATE_RANGE_ALL,
                  requestedFrom: "",
                  requestedTo: "",
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
            {adminQuoteCopy.clearFilters}
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
