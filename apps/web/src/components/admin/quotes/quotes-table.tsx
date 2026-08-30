"use client";

import { Card } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { QuoteCardList } from "@/components/admin/quotes/quote-card";
import { QuotesDesktopTable } from "@/components/admin/quotes/quotes-desktop-table";
import { QuotesPagination } from "@/components/admin/quotes/quotes-pagination";
import {
  QuotesEmptyState,
  QuotesError,
  QuotesLoading,
  QuotesNoMatchesState,
} from "@/components/admin/quotes/quotes-states";
import { shouldRenderQuotePagination } from "@/lib/admin/quotes";
import type {
  AdminQuote,
  AdminQuotePagination,
  AdminQuotePresentation,
} from "@/types/admin-quote";

interface QuotesTableProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onPageChange?: (page: number) => void;
  pagination?: AdminQuotePagination;
  presentation: AdminQuotePresentation;
  quotes: readonly AdminQuote[];
}

export function QuotesTable({
  hasActiveFilters,
  onClearFilters,
  onPageChange,
  pagination,
  presentation,
  quotes,
}: QuotesTableProps): ReactElement {
  return (
    <div className="flex flex-col gap-4" data-slot="quotes-table">
      <QuotesTableBody
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        presentation={presentation}
        quotes={quotes}
      />
      {presentation.status === "ready" &&
      shouldRenderQuotePagination(pagination, quotes.length) &&
      pagination !== undefined ? (
        <QuotesPagination onPageChange={onPageChange} pagination={pagination} />
      ) : null}
    </div>
  );
}

interface QuotesTableBodyProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  presentation: AdminQuotePresentation;
  quotes: readonly AdminQuote[];
}

function QuotesTableBody({
  hasActiveFilters,
  onClearFilters,
  presentation,
  quotes,
}: QuotesTableBodyProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <QuotesLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <QuotesError onRetry={presentation.onRetry} />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <QuotesEmptyState />
      </Card>
    );
  }

  if (quotes.length === 0) {
    return (
      <Card className="p-6 shadow-none">
        {hasActiveFilters ? (
          <QuotesNoMatchesState onClearFilters={onClearFilters} />
        ) : (
          <QuotesEmptyState />
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
        <QuoteCardList quotes={quotes} />
        <QuotesDesktopTable quotes={quotes} />
      </motion.div>
    </AnimatePresence>
  );
}
