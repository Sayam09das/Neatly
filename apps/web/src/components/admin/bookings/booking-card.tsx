"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fadeUp } from "@/animations/motion/variants";
import { BookingRowActions } from "@/components/admin/bookings/booking-row-actions";
import { BookingStatusBadge } from "@/components/admin/bookings/booking-status-badge";
import { adminBookingCopy } from "@/config/admin-bookings";
import {
  formatBookingSchedule,
  getBookingCleanerLabel,
  getBookingCustomerLabel,
  getBookingIdLabel,
  getBookingServiceLabel,
} from "@/lib/admin/bookings";
import type { AdminBooking } from "@/types/admin-booking";

interface BookingCardProps {
  booking: AdminBooking;
}

export function BookingCard({ booking }: BookingCardProps): ReactElement {
  return (
    <motion.article
      className="rounded-lg border border-border bg-surface p-4"
      data-slot="booking-card"
      variants={fadeUp}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-body-small font-medium text-foreground">
            {getBookingIdLabel(booking.id)}
          </p>
          <p className="mt-1 truncate text-caption text-muted-foreground">
            {getBookingCustomerLabel(booking.customerName)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <BookingStatusBadge status={booking.status} />
          <BookingRowActions />
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-2">
        <BookingCardField
          label={adminBookingCopy.tableService}
          value={getBookingServiceLabel(booking.serviceName)}
        />
        <BookingCardField
          label={adminBookingCopy.tableScheduled}
          value={formatBookingSchedule(booking.scheduledAt)}
        />
        <BookingCardField
          label={adminBookingCopy.tableCleaner}
          value={getBookingCleanerLabel(booking.cleanerName)}
        />
      </dl>
    </motion.article>
  );
}

interface BookingCardFieldProps {
  label: string;
  value: string;
}

function BookingCardField({
  label,
  value,
}: BookingCardFieldProps): ReactElement {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="truncate text-body-small text-foreground">{value}</dd>
    </div>
  );
}

interface BookingCardListProps {
  bookings: readonly AdminBooking[];
}

export function BookingCardList({
  bookings,
}: BookingCardListProps): ReactElement {
  return (
    <Card
      className="flex flex-col gap-3 p-3 shadow-none md:hidden"
      data-slot="booking-card-list"
    >
      {bookings.map((booking) => (
        <BookingCard booking={booking} key={booking.id} />
      ))}
    </Card>
  );
}
