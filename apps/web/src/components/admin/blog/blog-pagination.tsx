"use client";

import type { ReactElement } from "react";
import { AdminListPagination } from "@/components/admin/admin-list-pagination";
import { adminBlogCopy } from "@/config/admin-blog";
import type { AdminBlogPagination } from "@/types/admin-blog";

interface BlogPaginationProps {
  onPageChange?: (page: number) => void;
  pagination: AdminBlogPagination;
}

export function BlogPagination({
  onPageChange,
  pagination,
}: BlogPaginationProps): ReactElement {
  return (
    <AdminListPagination
      ariaLabel={adminBlogCopy.paginationLabel}
      nextLabel={adminBlogCopy.paginationNext}
      onPageChange={onPageChange}
      pageLabel={adminBlogCopy.paginationPageLabel}
      pagination={pagination}
      previousLabel={adminBlogCopy.paginationPrevious}
      slot="blog-pagination"
    />
  );
}
