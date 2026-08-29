"use client";

import { Card } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { CustomerCardList } from "@/components/admin/customers/customer-card";
import { CustomersDesktopTable } from "@/components/admin/customers/customers-desktop-table";
import { CustomersPagination } from "@/components/admin/customers/customers-pagination";
import {
  CustomersEmptyState,
  CustomersError,
  CustomersLoading,
  CustomersNoMatchesState,
} from "@/components/admin/customers/customers-states";
import { shouldRenderCustomerPagination } from "@/lib/admin/customers";
import type {
  AdminCustomer,
  AdminCustomerPagination,
  AdminCustomerPresentation,
} from "@/types/admin-customer";

interface CustomersTableProps {
  customers: readonly AdminCustomer[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  onMutated?: () => void;
  onPageChange?: (page: number) => void;
  pagination?: AdminCustomerPagination;
  presentation: AdminCustomerPresentation;
}

export function CustomersTable({
  customers,
  hasActiveFilters,
  onClearFilters,
  onCreate,
  onMutated,
  onPageChange,
  pagination,
  presentation,
}: CustomersTableProps): ReactElement {
  return (
    <div className="flex flex-col gap-4" data-slot="customers-table">
      <CustomersTableBody
        customers={customers}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onCreate={onCreate}
        onMutated={onMutated}
        presentation={presentation}
      />
      {presentation.status === "ready" &&
      shouldRenderCustomerPagination(pagination, customers.length) &&
      pagination !== undefined ? (
        <CustomersPagination
          onPageChange={onPageChange}
          pagination={pagination}
        />
      ) : null}
    </div>
  );
}

interface CustomersTableBodyProps {
  customers: readonly AdminCustomer[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  onMutated?: () => void;
  presentation: AdminCustomerPresentation;
}

function CustomersTableBody({
  customers,
  hasActiveFilters,
  onClearFilters,
  onCreate,
  onMutated,
  presentation,
}: CustomersTableBodyProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <CustomersLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <CustomersError onRetry={presentation.onRetry} />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <CustomersEmptyState onCreate={onCreate} />
      </Card>
    );
  }

  if (customers.length === 0) {
    return (
      <Card className="p-6 shadow-none">
        {hasActiveFilters ? (
          <CustomersNoMatchesState onClearFilters={onClearFilters} />
        ) : (
          <CustomersEmptyState onCreate={onCreate} />
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
        <CustomerCardList customers={customers} onMutated={onMutated} />
        <CustomersDesktopTable customers={customers} onMutated={onMutated} />
      </motion.div>
    </AnimatePresence>
  );
}
