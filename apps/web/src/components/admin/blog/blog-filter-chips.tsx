"use client";

import { Button } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { AdminListFilterChip } from "@/components/admin/admin-list-fields";
import { adminBlogCopy } from "@/config/admin-blog";
import { formatBlogDateFilterChip, getBlogStatusLabel } from "@/lib/admin/blog";
import {
  ADMIN_BLOG_DATE_RANGE_ALL,
  ADMIN_BLOG_STATUS_ALL,
  type AdminBlogFilters,
} from "@/types/admin-blog";

interface BlogFilterChipsProps {
  filters: AdminBlogFilters;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminBlogFilters) => void;
}

export function BlogFilterChips({
  filters,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
}: BlogFilterChipsProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const dateChip = formatBlogDateFilterChip(filters);

  return (
    <AnimatePresence>
      {hasActiveFilters ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
          data-slot="blog-filter-chips"
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
              label={`${adminBlogCopy.searchLabel}: ${filters.query.trim()}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, query: "" });
              }}
            />
          ) : null}
          {filters.status !== ADMIN_BLOG_STATUS_ALL ? (
            <AdminListFilterChip
              label={`${adminBlogCopy.statusLabel}: ${getBlogStatusLabel(filters.status)}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  status: ADMIN_BLOG_STATUS_ALL,
                });
              }}
            />
          ) : null}
          {dateChip !== null ? (
            <AdminListFilterChip
              label={`${adminBlogCopy.dateRangeLabel}: ${dateChip}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  createdFrom: "",
                  createdTo: "",
                  dateRange: ADMIN_BLOG_DATE_RANGE_ALL,
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
            {adminBlogCopy.clearFilters}
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
