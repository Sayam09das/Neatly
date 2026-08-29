"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fade } from "@/animations/motion/variants";
import { BookingRowActions } from "@/components/admin/bookings/booking-row-actions";
import { BookingStatusBadge } from "@/components/admin/bookings/booking-status-badge";
import {
  adminBookingCopy,
  emptyAdminBookingFilterCatalog,
} from "@/config/admin-bookings";
import {
  formatBookingSchedule,
  getBookingCleanerLabel,
  getBookingCustomerLabel,
  getBookingIdLabel,
  getBookingServiceLabel,
} from "@/lib/admin/bookings";
import type {
  AdminBooking,
  AdminBookingFilterCatalog,
} from "@/types/admin-booking";

interface BookingsDesktopTableProps {
  bookings: readonly AdminBooking[];
  catalog?: AdminBookingFilterCatalog;
  onMutated?: () => void;
}

export function BookingsDesktopTable({
  bookings,
  catalog = emptyAdminBookingFilterCatalog,
  onMutated,
}: BookingsDesktopTableProps): ReactElement {
  return (
    <Card className="hidden overflow-x-auto shadow-none md:block">
      <table className="w-full min-w-0 border-collapse text-left">
        <caption className="sr-only">{adminBookingCopy.tableLabel}</caption>
        <thead className="border-b border-border">
          <tr className="text-caption text-muted-foreground">
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBookingCopy.tableBooking}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBookingCopy.tableCustomer}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBookingCopy.tableService}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBookingCopy.tableScheduled}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBookingCopy.tableCleaner}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBookingCopy.tableStatus}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBookingCopy.tableActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <BookingTableRow
              booking={booking}
              catalog={catalog}
              key={booking.id}
              onMutated={onMutated}
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}

interface BookingTableRowProps {
  booking: AdminBooking;
  catalog: AdminBookingFilterCatalog;
  onMutated?: () => void;
}

function BookingTableRow({
  booking,
  catalog,
  onMutated,
}: BookingTableRowProps): ReactElement {
  return (
    <motion.tr
      className="border-b border-border last:border-b-0"
      data-slot="booking-table-row"
      variants={fade}
    >
      <td className="px-4 py-3 text-body-small text-foreground">
        {getBookingIdLabel(booking.id)}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {getBookingCustomerLabel(booking.customerName)}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {getBookingServiceLabel(booking.serviceName)}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {formatBookingSchedule(booking.scheduledAt)}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {getBookingCleanerLabel(booking.cleanerName)}
      </td>
      <td className="px-4 py-3">
        <BookingStatusBadge status={booking.status} />
      </td>
      <td className="px-4 py-3">
        <BookingRowActions
          booking={booking}
          catalog={catalog}
          onMutated={onMutated}
        />
      </td>
    </motion.tr>
  );
}
