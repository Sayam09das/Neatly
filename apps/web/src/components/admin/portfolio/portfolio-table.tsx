"use client";

import { Card } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { PortfolioCardList } from "@/components/admin/portfolio/portfolio-card";
import { PortfolioDesktopTable } from "@/components/admin/portfolio/portfolio-desktop-table";
import { PortfolioPagination } from "@/components/admin/portfolio/portfolio-pagination";
import {
  PortfolioEmptyState,
  PortfolioError,
  PortfolioLoading,
  PortfolioNoMatchesState,
} from "@/components/admin/portfolio/portfolio-states";
import { shouldRenderPortfolioPagination } from "@/lib/admin/portfolio";
import type {
  AdminPortfolioPagination,
  AdminPortfolioPresentation,
  AdminPortfolioProject,
} from "@/types/admin-portfolio";

interface PortfolioTableProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onPageChange?: (page: number) => void;
  pagination?: AdminPortfolioPagination;
  presentation: AdminPortfolioPresentation;
  projects: readonly AdminPortfolioProject[];
}

export function PortfolioTable({
  hasActiveFilters,
  onClearFilters,
  onPageChange,
  pagination,
  presentation,
  projects,
}: PortfolioTableProps): ReactElement {
  return (
    <div className="flex flex-col gap-4" data-slot="portfolio-table">
      <PortfolioTableBody
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        presentation={presentation}
        projects={projects}
      />
      {presentation.status === "ready" &&
      shouldRenderPortfolioPagination(pagination, projects.length) &&
      pagination !== undefined ? (
        <PortfolioPagination
          onPageChange={onPageChange}
          pagination={pagination}
        />
      ) : null}
    </div>
  );
}

interface PortfolioTableBodyProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  presentation: AdminPortfolioPresentation;
  projects: readonly AdminPortfolioProject[];
}

function PortfolioTableBody({
  hasActiveFilters,
  onClearFilters,
  presentation,
  projects,
}: PortfolioTableBodyProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <PortfolioLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <PortfolioError onRetry={presentation.onRetry} />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <PortfolioEmptyState />
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="p-6 shadow-none">
        {hasActiveFilters ? (
          <PortfolioNoMatchesState onClearFilters={onClearFilters} />
        ) : (
          <PortfolioEmptyState />
        )}
      </Card>
    );
  }

  return (
    <AnimatePresence initial={false}>
      <motion.div
        animate="visible"
        initial={prefersReducedMotion ? false : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: prefersReducedMotion ? 0 : motionDuration.micro,
            },
          },
        }}
      >
        <PortfolioCardList projects={projects} />
        <PortfolioDesktopTable projects={projects} />
      </motion.div>
    </AnimatePresence>
  );
}
