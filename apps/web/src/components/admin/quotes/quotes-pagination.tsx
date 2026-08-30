"use client";

import type { ReactElement } from "react";
import { AdminListPagination } from "@/components/admin/admin-list-pagination";
import { adminQuoteCopy } from "@/config/admin-quotes";
import type { AdminQuotePagination } from "@/types/admin-quote";

interface QuotesPaginationProps {
  onPageChange?: (page: number) => void;
  pagination: AdminQuotePagination;
}

export function QuotesPagination({
  onPageChange,
  pagination,
}: QuotesPaginationProps): ReactElement {
  return (
    <AdminListPagination
      ariaLabel={adminQuoteCopy.paginationLabel}
      nextLabel={adminQuoteCopy.paginationNext}
      onPageChange={onPageChange}
      pageLabel={adminQuoteCopy.paginationPageLabel}
      pagination={pagination}
      previousLabel={adminQuoteCopy.paginationPrevious}
      slot="quotes-pagination"
    />
  );
}
