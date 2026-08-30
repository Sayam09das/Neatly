"use client";

import { Card } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { NewsletterCardList } from "@/components/admin/newsletter/newsletter-card";
import { NewsletterDesktopTable } from "@/components/admin/newsletter/newsletter-desktop-table";
import { NewsletterPagination } from "@/components/admin/newsletter/newsletter-pagination";
import {
  NewsletterEmptyState,
  NewsletterError,
  NewsletterLoading,
  NewsletterNoMatchesState,
} from "@/components/admin/newsletter/newsletter-states";
import { shouldRenderNewsletterPagination } from "@/lib/admin/newsletter";
import type {
  AdminNewsletterPagination,
  AdminNewsletterPresentation,
  AdminNewsletterSubscriber,
} from "@/types/admin-newsletter";

interface NewsletterTableProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onPageChange?: (page: number) => void;
  pagination?: AdminNewsletterPagination;
  presentation: AdminNewsletterPresentation;
  subscribers: readonly AdminNewsletterSubscriber[];
}

export function NewsletterTable({
  hasActiveFilters,
  onClearFilters,
  onPageChange,
  pagination,
  presentation,
  subscribers,
}: NewsletterTableProps): ReactElement {
  return (
    <div className="flex flex-col gap-4" data-slot="newsletter-table">
      <NewsletterTableBody
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        presentation={presentation}
        subscribers={subscribers}
      />
      {presentation.status === "ready" &&
      shouldRenderNewsletterPagination(pagination, subscribers.length) &&
      pagination !== undefined ? (
        <NewsletterPagination
          onPageChange={onPageChange}
          pagination={pagination}
        />
      ) : null}
    </div>
  );
}

interface NewsletterTableBodyProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  presentation: AdminNewsletterPresentation;
  subscribers: readonly AdminNewsletterSubscriber[];
}

function NewsletterTableBody({
  hasActiveFilters,
  onClearFilters,
  presentation,
  subscribers,
}: NewsletterTableBodyProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <NewsletterLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <NewsletterError onRetry={presentation.onRetry} />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <NewsletterEmptyState />
      </Card>
    );
  }

  if (subscribers.length === 0) {
    return (
      <Card className="p-6 shadow-none">
        {hasActiveFilters ? (
          <NewsletterNoMatchesState onClearFilters={onClearFilters} />
        ) : (
          <NewsletterEmptyState />
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
        <NewsletterCardList subscribers={subscribers} />
        <NewsletterDesktopTable subscribers={subscribers} />
      </motion.div>
    </AnimatePresence>
  );
}
