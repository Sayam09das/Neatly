"use client";

import { Button } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { AdminListFilterChip } from "@/components/admin/admin-list-fields";
import {
  adminPortfolioCopy,
  adminPortfolioVisibilityLabels,
} from "@/config/admin-portfolio";
import {
  formatPortfolioDateFilterChip,
  getPortfolioCategoryLabel,
} from "@/lib/admin/portfolio";
import {
  ADMIN_PORTFOLIO_DATE_RANGE_ALL,
  ADMIN_PORTFOLIO_VISIBILITY_ALL,
  type AdminPortfolioFilters,
  type AdminPortfolioVisibility,
} from "@/types/admin-portfolio";

interface PortfolioFilterChipsProps {
  filters: AdminPortfolioFilters;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminPortfolioFilters) => void;
}

export function PortfolioFilterChips({
  filters,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
}: PortfolioFilterChipsProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const dateChip = formatPortfolioDateFilterChip(filters);

  return (
    <AnimatePresence>
      {hasActiveFilters ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2"
          data-slot="portfolio-filter-chips"
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
              label={`${adminPortfolioCopy.searchLabel}: ${filters.query.trim()}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, query: "" });
              }}
            />
          ) : null}
          {filters.category !== "" ? (
            <AdminListFilterChip
              label={`${adminPortfolioCopy.categoryLabel}: ${getPortfolioCategoryLabel(filters.category)}`}
              onRemove={(): void => {
                onFiltersChange({ ...filters, category: "" });
              }}
            />
          ) : null}
          {filters.visibility !== ADMIN_PORTFOLIO_VISIBILITY_ALL ? (
            <AdminListFilterChip
              label={`${adminPortfolioCopy.visibilityLabel}: ${getVisibilityChipLabel(filters.visibility)}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  visibility: ADMIN_PORTFOLIO_VISIBILITY_ALL,
                });
              }}
            />
          ) : null}
          {dateChip !== null ? (
            <AdminListFilterChip
              label={`${adminPortfolioCopy.dateRangeLabel}: ${dateChip}`}
              onRemove={(): void => {
                onFiltersChange({
                  ...filters,
                  createdFrom: "",
                  createdTo: "",
                  dateRange: ADMIN_PORTFOLIO_DATE_RANGE_ALL,
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
            {adminPortfolioCopy.clearFilters}
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function getVisibilityChipLabel(visibility: AdminPortfolioVisibility): string {
  if (visibility === ADMIN_PORTFOLIO_VISIBILITY_ALL) {
    return adminPortfolioCopy.visibilityAll;
  }

  return adminPortfolioVisibilityLabels[visibility];
}
