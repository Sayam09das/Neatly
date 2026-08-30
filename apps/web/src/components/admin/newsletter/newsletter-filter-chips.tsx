"use client";

import { Button } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { AdminListFilterChip } from "@/components/admin/admin-list-fields";
import { adminNewsletterCopy } from "@/config/admin-newsletter";
import {
  formatNewsletterDateFilterChip,
  getNewsletterStatusLabel,
} from "@/lib/admin/newsletter";
import {
  ADMIN_NEWSLETTER_DATE_RANGE_ALL,
  ADMIN_NEWSLETTER_STATUS_ALL,
  type AdminNewsletterFilters,
} from "@/types/admin-newsletter";

interface NewsletterFilterChipsProps {
  filters: AdminNewsletterFilters;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminNewsletterFilters) => void;
}

export function NewsletterFilterChips({
  filters,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
}: NewsletterFilterChipsProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const dateChip = formatNewsletterDateFilterChip(filters);

  return (
    <AnimatePresence>
      {hasActiveFilters ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
          data-slot="newsletter-filter-chips"
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
            <AdminListFilterChip
              label={`${adminNewsletterCopy.searchLabel}: ${filters.query.trim()}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, query: "" });
              }}
            />
          ) : null}
          {filters.status !== ADMIN_NEWSLETTER_STATUS_ALL ? (
            <AdminListFilterChip
              label={`${adminNewsletterCopy.statusLabel}: ${getNewsletterStatusLabel(filters.status)}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  status: ADMIN_NEWSLETTER_STATUS_ALL,
                });
              }}
            />
          ) : null}
          {dateChip !== null ? (
            <AdminListFilterChip
              label={`${adminNewsletterCopy.dateRangeLabel}: ${dateChip}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  dateRange: ADMIN_NEWSLETTER_DATE_RANGE_ALL,
                  subscribedFrom: "",
                  subscribedTo: "",
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
            {adminNewsletterCopy.clearFilters}
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
