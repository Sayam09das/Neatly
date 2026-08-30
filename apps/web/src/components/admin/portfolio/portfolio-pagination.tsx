"use client";

import type { ReactElement } from "react";
import { AdminListPagination } from "@/components/admin/admin-list-pagination";
import { adminPortfolioCopy } from "@/config/admin-portfolio";
import type { AdminPortfolioPagination } from "@/types/admin-portfolio";

interface PortfolioPaginationProps {
  onPageChange?: (page: number) => void;
  pagination: AdminPortfolioPagination;
}

export function PortfolioPagination({
  onPageChange,
  pagination,
}: PortfolioPaginationProps): ReactElement {
  return (
    <AdminListPagination
      ariaLabel={adminPortfolioCopy.paginationLabel}
      nextLabel={adminPortfolioCopy.paginationNext}
      onPageChange={onPageChange}
      pageLabel={adminPortfolioCopy.paginationPageLabel}
      pagination={pagination}
      previousLabel={adminPortfolioCopy.paginationPrevious}
      slot="portfolio-pagination"
    />
  );
}
