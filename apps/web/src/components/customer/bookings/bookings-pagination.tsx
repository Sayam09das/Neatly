import Link from "next/link";
import type { ReactElement } from "react";
import { customerBookingsCopy } from "@/config/customer";
import {
  type CustomerBookingsQuery,
  customerBookingsHref,
} from "@/lib/customer/booking";

interface BookingsPaginationProps {
  page: number;
  query: CustomerBookingsQuery;
  totalPages: number;
}

export function BookingsPagination({
  page,
  query,
  totalPages,
}: BookingsPaginationProps): ReactElement | null {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label={customerBookingsCopy.paginationLabel}
      className="mt-8 flex flex-wrap items-center gap-3"
    >
      {page > 1 ? (
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={customerBookingsHref({ ...query, page: page - 1 })}
        >
          {customerBookingsCopy.paginationPrevious}
        </Link>
      ) : (
        <span className="text-body-small text-muted-foreground">
          {customerBookingsCopy.paginationPrevious}
        </span>
      )}
      <p className="text-body-small text-muted-foreground">
        {page} / {totalPages}
      </p>
      {page < totalPages ? (
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={customerBookingsHref({ ...query, page: page + 1 })}
        >
          {customerBookingsCopy.paginationNext}
        </Link>
      ) : (
        <span className="text-body-small text-muted-foreground">
          {customerBookingsCopy.paginationNext}
        </span>
      )}
    </nav>
  );
}
