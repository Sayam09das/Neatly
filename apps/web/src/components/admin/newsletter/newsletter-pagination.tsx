"use client";

import type { ReactElement } from "react";
import { AdminListPagination } from "@/components/admin/admin-list-pagination";
import { adminNewsletterCopy } from "@/config/admin-newsletter";
import type { AdminNewsletterPagination } from "@/types/admin-newsletter";

interface NewsletterPaginationProps {
  onPageChange?: (page: number) => void;
  pagination: AdminNewsletterPagination;
}

export function NewsletterPagination({
  onPageChange,
  pagination,
}: NewsletterPaginationProps): ReactElement {
  return (
    <AdminListPagination
      ariaLabel={adminNewsletterCopy.paginationLabel}
      nextLabel={adminNewsletterCopy.paginationNext}
      onPageChange={onPageChange}
      pageLabel={adminNewsletterCopy.paginationPageLabel}
      pagination={pagination}
      previousLabel={adminNewsletterCopy.paginationPrevious}
      slot="newsletter-pagination"
    />
  );
}
