import Link from "next/link";
import type { ReactElement } from "react";
import { BookingStatusBadge } from "@/components/customer/booking-status-badge";
import {
  customerBookingDetailCopy,
  customerBookingDetailPath,
  customerBookingsCopy,
} from "@/config/customer";
import { formatCustomerSchedule } from "@/lib/customer/schedule";
import type { CustomerBookingView } from "@/types/customer";

interface BookingsListProps {
  items: readonly CustomerBookingView[];
}

export function BookingsList({ items }: BookingsListProps): ReactElement {
  return (
    <>
      <ul className="mt-8 flex flex-col gap-4 lg:hidden">
        {items.map((booking) => (
          <li className="rounded-xl border border-border p-4" key={booking.id}>
            <BookingCard booking={booking} />
          </li>
        ))}
      </ul>
      <div className="mt-8 hidden overflow-x-auto lg:block">
        <table className="w-full min-w-xl text-left">
          <caption className="sr-only">
            {customerBookingsCopy.tableCaption}
          </caption>
          <thead>
            <tr className="border-b border-border text-caption text-muted-foreground">
              <th className="py-3 pr-4 font-medium">Service</th>
              <th className="py-3 pr-4 font-medium">Schedule</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 font-medium">
                <span className="sr-only">
                  {customerBookingsCopy.viewBooking}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((booking) => (
              <tr className="border-b border-border" key={booking.id}>
                <td className="py-4 pr-4 text-body text-foreground">
                  {booking.service?.name ??
                    customerBookingDetailCopy.unnamedService}
                </td>
                <td className="py-4 pr-4 text-body text-muted-foreground">
                  {formatCustomerSchedule(booking.scheduledAt) ?? "—"}
                </td>
                <td className="py-4 pr-4">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="py-4">
                  <BookingViewLink id={booking.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function BookingCard({
  booking,
}: {
  booking: CustomerBookingView;
}): ReactElement {
  const schedule = formatCustomerSchedule(booking.scheduledAt);

  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-h3 text-foreground">
          {booking.service?.name ?? customerBookingDetailCopy.unnamedService}
        </h2>
        <BookingStatusBadge status={booking.status} />
      </div>
      {schedule === null ? null : (
        <p className="mt-2 text-body-small text-muted-foreground">{schedule}</p>
      )}
      <p className="mt-4">
        <BookingViewLink id={booking.id} />
      </p>
    </article>
  );
}

function BookingViewLink({ id }: { id: string }): ReactElement {
  return (
    <Link
      className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={customerBookingDetailPath(id)}
    >
      {customerBookingsCopy.viewBooking}
    </Link>
  );
}
