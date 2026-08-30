"use client";

import type { ReactElement } from "react";
import { AdminListPagination } from "@/components/admin/admin-list-pagination";
import { adminContactCopy } from "@/config/admin-contacts";
import type { AdminContactPagination } from "@/types/admin-contact";

interface ContactsPaginationProps {
  onPageChange?: (page: number) => void;
  pagination: AdminContactPagination;
}

export function ContactsPagination({
  onPageChange,
  pagination,
}: ContactsPaginationProps): ReactElement {
  return (
    <AdminListPagination
      ariaLabel={adminContactCopy.paginationLabel}
      nextLabel={adminContactCopy.paginationNext}
      onPageChange={onPageChange}
      pageLabel={adminContactCopy.paginationPageLabel}
      pagination={pagination}
      previousLabel={adminContactCopy.paginationPrevious}
      slot="contacts-pagination"
    />
  );
}
