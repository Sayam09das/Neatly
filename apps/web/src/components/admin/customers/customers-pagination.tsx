"use client";

import type { ReactElement } from "react";
import { AdminListPagination } from "@/components/admin/admin-list-pagination";
import { adminCustomerCopy } from "@/config/admin-customers";
import type { AdminCustomerPagination } from "@/types/admin-customer";

interface CustomersPaginationProps {
  pagination: AdminCustomerPagination;
}

export function CustomersPagination({
  pagination,
}: CustomersPaginationProps): ReactElement {
  return (
    <AdminListPagination
      ariaLabel={adminCustomerCopy.paginationLabel}
      nextLabel={adminCustomerCopy.paginationNext}
      pageLabel={adminCustomerCopy.paginationPageLabel}
      pagination={pagination}
      previousLabel={adminCustomerCopy.paginationPrevious}
      slot="customers-pagination"
    />
  );
}
