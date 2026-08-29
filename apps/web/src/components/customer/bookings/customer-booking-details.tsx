import Link from "next/link";
import type { ReactElement } from "react";
import { BookingStatusBadge } from "@/components/customer/booking-status-badge";
import { BookingManagement } from "@/components/customer/bookings/booking-management";
import {
  CUSTOMER_PATHS,
  customerBookingConfirmationCopy,
  customerBookingDetailCopy,
} from "@/config/customer";
import { formatCustomerSchedule } from "@/lib/customer/schedule";
import type { CustomerBookingView, CustomerReview } from "@/types/customer";

interface CustomerBookingDetailsProps {
  booking: CustomerBookingView;
  review: CustomerReview | null;
}

export function CustomerBookingDetails({
  booking,
  review,
}: CustomerBookingDetailsProps): ReactElement {
  const schedule = formatCustomerSchedule(booking.scheduledAt);

  return (
    <article className="w-full min-w-0 max-w-2xl">
      <nav aria-label={customerBookingDetailCopy.breadcrumbLabel}>
        <ol className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
          <li>
            <Link
              className="underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={CUSTOMER_PATHS.dashboard}
            >
              {customerBookingDetailCopy.breadcrumbDashboard}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              className="underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={CUSTOMER_PATHS.bookings}
            >
              {customerBookingDetailCopy.breadcrumbBookings}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {customerBookingDetailCopy.breadcrumbCurrent}
          </li>
        </ol>
      </nav>
      <p className="mt-6 mb-6">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CUSTOMER_PATHS.bookings}
        >
          {customerBookingDetailCopy.backToBookings}
        </Link>
      </p>
      <p className="text-label font-medium text-foreground uppercase tracking-wide">
        {customerBookingDetailCopy.statusLabel}
      </p>
      <div className="mt-3">
        <BookingStatusBadge status={booking.status} />
      </div>
      <h1 className="mt-6 text-h1 text-foreground tracking-tight">
        {booking.service?.name ?? customerBookingDetailCopy.unnamedService}
      </h1>
      <section className="mt-8">
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerBookingDetailCopy.referenceLabel}
        </h2>
        <p className="mt-3 break-all text-body text-muted-foreground">
          {booking.id}
        </p>
      </section>
      <section className="mt-8">
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerBookingDetailCopy.serviceHeading}
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          {booking.service?.name ?? customerBookingDetailCopy.unnamedService}
        </p>
      </section>
      {schedule === null ? null : (
        <section className="mt-8">
          <h2 className="text-h2 text-foreground tracking-tight">
            {customerBookingDetailCopy.scheduleHeading}
          </h2>
          <p className="mt-3 text-body text-muted-foreground">{schedule}</p>
        </section>
      )}
      {booking.serviceAddress === null ||
      booking.serviceAddress.trim() === "" ? null : (
        <section className="mt-8">
          <h2 className="text-h2 text-foreground tracking-tight">
            {customerBookingDetailCopy.addressHeading}
          </h2>
          <p className="mt-3 text-body text-muted-foreground">
            {booking.serviceAddress}
          </p>
        </section>
      )}
      {booking.notes === null || booking.notes.trim() === "" ? null : (
        <section className="mt-8">
          <h2 className="text-h2 text-foreground tracking-tight">
            {customerBookingDetailCopy.notesHeading}
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-body text-muted-foreground">
            {booking.notes}
          </p>
        </section>
      )}
      {booking.linkedToQuote ? (
        <p className="mt-8 text-body text-muted-foreground">
          {customerBookingDetailCopy.linkedQuote}
        </p>
      ) : null}
      {booking.status === "COMPLETED" ? (
        <p className="mt-8">
          <Link
            className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={
              review === null
                ? `${CUSTOMER_PATHS.reviews}?booking=${encodeURIComponent(booking.id)}`
                : CUSTOMER_PATHS.reviews
            }
          >
            {review === null
              ? customerBookingDetailCopy.leaveReview
              : customerBookingDetailCopy.viewReview}
          </Link>
        </p>
      ) : null}
      <BookingManagement booking={booking} />
      <section className="mt-10">
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerBookingConfirmationCopy.nextStepsHeading}
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          {customerBookingConfirmationCopy.nextStepsBody}
        </p>
      </section>
    </article>
  );
}
