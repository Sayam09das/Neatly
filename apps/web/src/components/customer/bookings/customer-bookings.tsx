import Link from "next/link";
import type { ReactElement } from "react";
import { BookingsFilters } from "@/components/customer/bookings/bookings-filters";
import { BookingsList } from "@/components/customer/bookings/bookings-list";
import { BookingsPagination } from "@/components/customer/bookings/bookings-pagination";
import { CustomerRefreshErrorState } from "@/components/customer/customer-refresh-error";
import {
  CustomerBookingsEmptyState,
  CustomerEmptyState,
} from "@/components/customer/customer-states";
import {
  CUSTOMER_PATHS,
  customerBookingsCopy,
  customerDashboardCopy,
} from "@/config/customer";
import {
  type CustomerBookingsQuery,
  customerBookingsHasFilters,
} from "@/lib/customer/booking";
import type { CustomerBookingList } from "@/types/customer";

interface CustomerBookingsProps {
  list: CustomerBookingList | null;
  query: CustomerBookingsQuery;
}

export function CustomerBookings({
  list,
  query,
}: CustomerBookingsProps): ReactElement {
  const filtered = customerBookingsHasFilters(query);

  return (
    <div className="w-full min-w-0">
      <header className="max-w-prose">
        <h1 className="text-h1 text-foreground tracking-tight">
          {customerBookingsCopy.heading}
        </h1>
        <p className="mt-3 text-body text-muted-foreground">
          {customerBookingsCopy.description}
        </p>
      </header>
      <BookingsFilters query={query} />
      {list === null ? (
        <div className="mt-8">
          <CustomerRefreshErrorState />
        </div>
      ) : list.items.length === 0 ? (
        <div className="mt-8">
          {filtered ? (
            <div>
              <CustomerEmptyState
                description={customerBookingsCopy.filteredEmptyDescription}
                title={customerBookingsCopy.filteredEmptyTitle}
              />
              <p className="mt-6">
                <Link
                  className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={CUSTOMER_PATHS.bookings}
                >
                  {customerBookingsCopy.clearFilters}
                </Link>
              </p>
            </div>
          ) : (
            <div>
              <CustomerBookingsEmptyState />
              <p className="mt-6">
                <Link
                  className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={CUSTOMER_PATHS.dashboardServices}
                >
                  {customerDashboardCopy.servicesAction}
                </Link>
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          <BookingsList items={list.items} />
          <BookingsPagination
            page={list.pagination.page}
            query={query}
            totalPages={list.pagination.totalPages}
          />
        </>
      )}
    </div>
  );
}
