"use client";

import type { ReactElement } from "react";
import { AdminListPagination } from "@/components/admin/admin-list-pagination";
import { adminCustomerCopy } from "@/config/admin-customers";
import type { AdminCustomerPagination } from "@/types/admin-customer";

interface CustomersPaginationProps {
  onPageChange?: (page: number) => void;
  pagination: AdminCustomerPagination;
}

export function CustomersPagination({
  onPageChange,
  pagination,
}: CustomersPaginationProps): ReactElement {
  return (
    <AdminListPagination
      ariaLabel={adminCustomerCopy.paginationLabel}
      nextLabel={adminCustomerCopy.paginationNext}
      onPageChange={onPageChange}
      pageLabel={adminCustomerCopy.paginationPageLabel}
      pagination={pagination}
      previousLabel={adminCustomerCopy.paginationPrevious}
      slot="customers-pagination"
    />
  );
}
