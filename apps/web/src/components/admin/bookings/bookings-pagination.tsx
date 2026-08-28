"use client";

import type { ReactElement } from "react";
import { AdminListPagination } from "@/components/admin/admin-list-pagination";
import { adminBookingCopy } from "@/config/admin-bookings";
import type { AdminBookingPagination } from "@/types/admin-booking";

interface BookingsPaginationProps {
  pagination: AdminBookingPagination;
}

export function BookingsPagination({
  pagination,
}: BookingsPaginationProps): ReactElement {
  return (
    <AdminListPagination
      ariaLabel={adminBookingCopy.paginationLabel}
      nextLabel={adminBookingCopy.paginationNext}
      pageLabel={adminBookingCopy.paginationPageLabel}
      pagination={pagination}
      previousLabel={adminBookingCopy.paginationPrevious}
      slot="bookings-pagination"
    />
  );
}
