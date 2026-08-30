"use client";

import { Button, Input, Label } from "@neatly/ui";
import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import { type ReactElement, useId } from "react";
import { getMotionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { adminCleanerCopy } from "@/config/admin-cleaners";
import type {
  AdminCleanerFilterCatalog,
  AdminCleanerFilters,
} from "@/types/admin-cleaner";

interface CleanersToolbarProps {
  catalog: AdminCleanerFilterCatalog;
  filters: AdminCleanerFilters;
  onCreate: () => void;
  onFiltersChange: (filters: AdminCleanerFilters) => void;
}

export function CleanersToolbar({
  catalog,
  filters,
  onCreate,
  onFiltersChange,
}: CleanersToolbarProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const searchId = useId();
  const statusId = useId();

  return (
    <motion.div
      className="flex flex-col gap-3"
      data-slot="cleaners-toolbar"
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
            {adminCleanerCopy.searchLabel}
          </Label>
          <Input
            aria-label={adminCleanerCopy.searchLabel}
            id={searchId}
            onChange={(event): void => {
              onFiltersChange({ ...filters, query: event.target.value });
            }}
            placeholder={adminCleanerCopy.searchPlaceholder}
            type="search"
            value={filters.query}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5 sm:w-56">
          <Label htmlFor={statusId}>{adminCleanerCopy.statusLabel}</Label>
          <select
            className={cn(
              "flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2",
              "text-body text-foreground shadow-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
            id={statusId}
            onChange={(event): void => {
              onFiltersChange({ ...filters, status: event.target.value });
            }}
            value={filters.status}
          >
            <option value="">All</option>
            {catalog.statuses.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={onCreate} type="button">
          {adminCleanerCopy.primaryAction}
        </Button>
      </div>
    </motion.div>
  );
}
