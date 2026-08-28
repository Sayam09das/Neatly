"use client";

import { Button } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import {
  adminNotificationCopy,
  adminNotificationFilterCatalog,
} from "@/config/admin-notifications";
import type { AdminNotificationFilters } from "@/types/admin-notification";

interface NotificationsFilterChipsProps {
  filters: AdminNotificationFilters;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminNotificationFilters) => void;
}

export function NotificationsFilterChips({
  filters,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
}: NotificationsFilterChipsProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const readStateLabel = adminNotificationFilterCatalog.readStates.find(
    (option) => option.id === filters.readState,
  )?.label;

  return (
    <AnimatePresence>
      {hasActiveFilters ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
          data-slot="notifications-filter-chips"
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
              label={`${adminNotificationCopy.searchLabel}: ${filters.query.trim()}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, query: "" });
              }}
            />
          ) : null}
          {readStateLabel !== undefined ? (
            <FilterChip
              label={`${adminNotificationCopy.readStateLabel}: ${readStateLabel}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, readState: "" });
              }}
            />
          ) : null}
          <Button
            onClick={onClearFilters}
            size="sm"
            type="button"
            variant="ghost"
          >
            {adminNotificationCopy.clearFilters}
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
