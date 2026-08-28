"use client";

import type { ReactElement } from "react";
import { AdminListPagination } from "@/components/admin/admin-list-pagination";
import { adminServiceCopy } from "@/config/admin-services";
import type { AdminServicePagination } from "@/types/admin-service";

interface ServicesPaginationProps {
  pagination: AdminServicePagination;
}

export function ServicesPagination({
  pagination,
}: ServicesPaginationProps): ReactElement {
  return (
    <AdminListPagination
      ariaLabel={adminServiceCopy.paginationLabel}
      nextLabel={adminServiceCopy.paginationNext}
      pageLabel={adminServiceCopy.paginationPageLabel}
      pagination={pagination}
      previousLabel={adminServiceCopy.paginationPrevious}
      slot="services-pagination"
    />
  );
}
