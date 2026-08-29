import { Button, Input, Label } from "@neatly/ui";
import type { ReactElement } from "react";
import {
  CUSTOMER_BOOKINGS_SEARCH_INPUT_ID,
  CUSTOMER_BOOKINGS_SEARCH_PARAM,
  CUSTOMER_BOOKINGS_STATUS_INPUT_ID,
  CUSTOMER_BOOKINGS_STATUS_PARAM,
  CUSTOMER_BOOKINGS_WINDOW_INPUT_ID,
  CUSTOMER_BOOKINGS_WINDOW_PARAM,
  CUSTOMER_PATHS,
  customerBookingStatusLabels,
  customerBookingsCopy,
} from "@/config/customer";
import {
  CUSTOMER_BOOKING_STATUSES,
  type CustomerBookingsQuery,
} from "@/lib/customer/booking";

interface BookingsFiltersProps {
  query: CustomerBookingsQuery;
}

export function BookingsFilters({ query }: BookingsFiltersProps): ReactElement {
  return (
    <form
      action={CUSTOMER_PATHS.bookings}
      className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4"
      method="get"
    >
      <div className="md:col-span-2">
        <Label htmlFor={CUSTOMER_BOOKINGS_SEARCH_INPUT_ID}>
          {customerBookingsCopy.searchLabel}
        </Label>
        <Input
          autoComplete="off"
          className="mt-2"
          defaultValue={query.q}
          id={CUSTOMER_BOOKINGS_SEARCH_INPUT_ID}
          name={CUSTOMER_BOOKINGS_SEARCH_PARAM}
          placeholder={customerBookingsCopy.searchPlaceholder}
          type="search"
        />
      </div>
      <div>
        <Label htmlFor={CUSTOMER_BOOKINGS_STATUS_INPUT_ID}>
          {customerBookingsCopy.filterLabel}
        </Label>
        <select
          className="mt-2 flex min-h-touch w-full rounded-md border border-input bg-background px-3 text-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue={query.status}
          id={CUSTOMER_BOOKINGS_STATUS_INPUT_ID}
          name={CUSTOMER_BOOKINGS_STATUS_PARAM}
        >
          <option value="">{customerBookingsCopy.allStatuses}</option>
          {CUSTOMER_BOOKING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {customerBookingStatusLabels[status]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor={CUSTOMER_BOOKINGS_WINDOW_INPUT_ID}>
          {customerBookingsCopy.windowLabel}
        </Label>
        <select
          className="mt-2 flex min-h-touch w-full rounded-md border border-input bg-background px-3 text-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue={query.window}
          id={CUSTOMER_BOOKINGS_WINDOW_INPUT_ID}
          name={CUSTOMER_BOOKINGS_WINDOW_PARAM}
        >
          <option value="">{customerBookingsCopy.allWindows}</option>
          <option value="upcoming">
            {customerBookingsCopy.windowUpcoming}
          </option>
          <option value="past">{customerBookingsCopy.windowPast}</option>
        </select>
      </div>
      <div className="md:col-span-4">
        <Button type="submit">{customerBookingsCopy.searchLabel}</Button>
      </div>
    </form>
  );
}
