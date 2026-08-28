"use client";

import { Button } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { adminBookingCopy } from "@/config/admin-bookings";
import {
  formatBookingDateFilterChip,
  getBookingStatusLabel,
} from "@/lib/admin/bookings";
import type {
  AdminBookingFilterCatalog,
  AdminBookingFilters,
} from "@/types/admin-booking";
import { ADMIN_BOOKING_STATUS_ALL } from "@/types/admin-booking";

interface BookingsFilterChipsProps {
  catalog: AdminBookingFilterCatalog;
  filters: AdminBookingFilters;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminBookingFilters) => void;
}

export function BookingsFilterChips({
  catalog,
  filters,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
}: BookingsFilterChipsProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const dateChip = formatBookingDateFilterChip(filters);
  const serviceLabel = catalog.services.find(
    (option) => option.id === filters.serviceId,
  )?.label;
  const cleanerLabel = catalog.cleaners.find(
    (option) => option.id === filters.cleanerId,
  )?.label;
  const customerLabel = catalog.customers.find(
    (option) => option.id === filters.customerId,
  )?.label;

  return (
    <AnimatePresence>
      {hasActiveFilters ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
          data-slot="bookings-filter-chips"
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
              label={`${adminBookingCopy.searchLabel}: ${filters.query.trim()}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, query: "" });
              }}
            />
          ) : null}
          {filters.status !== ADMIN_BOOKING_STATUS_ALL ? (
            <FilterChip
              label={`${adminBookingCopy.statusLabel}: ${getBookingStatusLabel(filters.status)}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  status: ADMIN_BOOKING_STATUS_ALL,
                });
              }}
            />
          ) : null}
          {dateChip !== null ? (
            <FilterChip
              label={`${adminBookingCopy.filterDateLabel}: ${dateChip}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  scheduledFrom: "",
                  scheduledTo: "",
                });
              }}
            />
          ) : null}
          {serviceLabel !== undefined ? (
            <FilterChip
              label={`${adminBookingCopy.filterServiceLabel}: ${serviceLabel}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, serviceId: "" });
              }}
            />
          ) : null}
          {cleanerLabel !== undefined ? (
            <FilterChip
              label={`${adminBookingCopy.filterCleanerLabel}: ${cleanerLabel}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, cleanerId: "" });
              }}
            />
          ) : null}
          {customerLabel !== undefined ? (
            <FilterChip
              label={`${adminBookingCopy.filterCustomerLabel}: ${customerLabel}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, customerId: "" });
              }}
            />
          ) : null}
          <Button
            onClick={onClearFilters}
            size="sm"
            type="button"
            variant="ghost"
          >
            {adminBookingCopy.clearFilters}
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
