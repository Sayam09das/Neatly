"use client";

import type { ReactElement } from "react";
import { AdminListPagination } from "@/components/admin/admin-list-pagination";
import { adminReviewCopy } from "@/config/admin-reviews";
import type { AdminReviewPagination } from "@/types/admin-review";

interface ReviewsPaginationProps {
  onPageChange?: (page: number) => void;
  pagination: AdminReviewPagination;
}

export function ReviewsPagination({
  onPageChange,
  pagination,
}: ReviewsPaginationProps): ReactElement {
  return (
    <AdminListPagination
      ariaLabel={adminReviewCopy.paginationLabel}
      nextLabel={adminReviewCopy.paginationNext}
      onPageChange={onPageChange}
      pageLabel={adminReviewCopy.paginationPageLabel}
      pagination={pagination}
      previousLabel={adminReviewCopy.paginationPrevious}
      slot="reviews-pagination"
    />
  );
}
