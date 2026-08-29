"use client";

import { Card } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { ServiceCardList } from "@/components/admin/services/service-card";
import { ServicesDesktopTable } from "@/components/admin/services/services-desktop-table";
import { ServicesPagination } from "@/components/admin/services/services-pagination";
import {
  ServicesEmptyState,
  ServicesError,
  ServicesLoading,
  ServicesNoMatchesState,
} from "@/components/admin/services/services-states";
import { shouldRenderServicePagination } from "@/lib/admin/services";
import type {
  AdminService,
  AdminServicePagination,
  AdminServicePresentation,
} from "@/types/admin-service";

interface ServicesTableProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  onMutated?: () => void;
  onPageChange?: (page: number) => void;
  pagination?: AdminServicePagination;
  presentation: AdminServicePresentation;
  services: readonly AdminService[];
}

export function ServicesTable({
  hasActiveFilters,
  onClearFilters,
  onCreate,
  onMutated,
  onPageChange,
  pagination,
  presentation,
  services,
}: ServicesTableProps): ReactElement {
  return (
    <div className="flex flex-col gap-4" data-slot="services-table">
      <ServicesTableBody
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onCreate={onCreate}
        onMutated={onMutated}
        presentation={presentation}
        services={services}
      />
      {presentation.status === "ready" &&
      shouldRenderServicePagination(pagination, services.length) &&
      pagination !== undefined ? (
        <ServicesPagination
          onPageChange={onPageChange}
          pagination={pagination}
        />
      ) : null}
    </div>
  );
}

interface ServicesTableBodyProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  onMutated?: () => void;
  presentation: AdminServicePresentation;
  services: readonly AdminService[];
}

function ServicesTableBody({
  hasActiveFilters,
  onClearFilters,
  onCreate,
  onMutated,
  presentation,
  services,
}: ServicesTableBodyProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <ServicesLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <ServicesError onRetry={presentation.onRetry} />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <ServicesEmptyState onCreate={onCreate} />
      </Card>
    );
  }

  if (services.length === 0) {
    return (
      <Card className="p-6 shadow-none">
        {hasActiveFilters ? (
          <ServicesNoMatchesState onClearFilters={onClearFilters} />
        ) : (
          <ServicesEmptyState onCreate={onCreate} />
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
        <ServiceCardList onMutated={onMutated} services={services} />
        <ServicesDesktopTable onMutated={onMutated} services={services} />
      </motion.div>
    </AnimatePresence>
  );
}
