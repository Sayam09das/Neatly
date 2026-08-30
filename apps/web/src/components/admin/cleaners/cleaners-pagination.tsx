"use client";

import type { ReactElement } from "react";
import { AdminListPagination } from "@/components/admin/admin-list-pagination";
import { adminCleanerCopy } from "@/config/admin-cleaners";
import type { AdminCleanerPagination } from "@/types/admin-cleaner";

interface CleanersPaginationProps {
  onPageChange?: (page: number) => void;
  pagination: AdminCleanerPagination;
}

export function CleanersPagination({
  onPageChange,
  pagination,
}: CleanersPaginationProps): ReactElement {
  return (
    <AdminListPagination
      ariaLabel={adminCleanerCopy.paginationLabel}
      nextLabel={adminCleanerCopy.paginationNext}
      onPageChange={onPageChange}
      pageLabel={adminCleanerCopy.paginationPageLabel}
      pagination={pagination}
      previousLabel={adminCleanerCopy.paginationPrevious}
      slot="cleaners-pagination"
    />
  );
}
