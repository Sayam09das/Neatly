"use client";

import { Card } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { CleanerCardList } from "@/components/admin/cleaners/cleaner-card";
import { CleanersDesktopTable } from "@/components/admin/cleaners/cleaners-desktop-table";
import { CleanersPagination } from "@/components/admin/cleaners/cleaners-pagination";
import {
  CleanersEmptyState,
  CleanersError,
  CleanersLoading,
  CleanersNoMatchesState,
} from "@/components/admin/cleaners/cleaners-states";
import { shouldRenderCleanerPagination } from "@/lib/admin/cleaners";
import type {
  AdminCleaner,
  AdminCleanerPagination,
  AdminCleanerPresentation,
} from "@/types/admin-cleaner";

interface CleanersTableProps {
  cleaners: readonly AdminCleaner[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  onMutated?: () => void;
  onPageChange?: (page: number) => void;
  pagination?: AdminCleanerPagination;
  presentation: AdminCleanerPresentation;
}

export function CleanersTable({
  cleaners,
  hasActiveFilters,
  onClearFilters,
  onCreate,
  onMutated,
  onPageChange,
  pagination,
  presentation,
}: CleanersTableProps): ReactElement {
  return (
    <div className="flex flex-col gap-4" data-slot="cleaners-table">
      <CleanersTableBody
        cleaners={cleaners}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onCreate={onCreate}
        onMutated={onMutated}
        presentation={presentation}
      />
      {presentation.status === "ready" &&
      shouldRenderCleanerPagination(pagination, cleaners.length) &&
      pagination !== undefined ? (
        <CleanersPagination
          onPageChange={onPageChange}
          pagination={pagination}
        />
      ) : null}
    </div>
  );
}

function CleanersTableBody({
  cleaners,
  hasActiveFilters,
  onClearFilters,
  onCreate,
  onMutated,
  presentation,
}: {
  cleaners: readonly AdminCleaner[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  onMutated?: () => void;
  presentation: AdminCleanerPresentation;
}): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <CleanersLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <CleanersError onRetry={presentation.onRetry} />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <CleanersEmptyState onCreate={onCreate} />
      </Card>
    );
  }

  if (cleaners.length === 0) {
    return (
      <Card className="p-6 shadow-none">
        {hasActiveFilters ? (
          <CleanersNoMatchesState onClearFilters={onClearFilters} />
        ) : (
          <CleanersEmptyState onCreate={onCreate} />
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
        <CleanerCardList cleaners={cleaners} onMutated={onMutated} />
        <CleanersDesktopTable cleaners={cleaners} onMutated={onMutated} />
      </motion.div>
    </AnimatePresence>
  );
}
