"use client";

import { Button } from "@neatly/ui";
import Link from "next/link";
import { type ReactElement, useState } from "react";
import {
  CUSTOMER_PATHS,
  customerBookingConfirmationCopy,
  customerBookingStatusLabels,
} from "@/config/customer";
import type { CustomerBookingView } from "@/types/customer";

interface BookingConfirmationProps {
  booking: CustomerBookingView;
}

export function BookingConfirmation({
  booking,
}: BookingConfirmationProps): ReactElement {
  const [copied, setCopied] = useState(false);
  const isConfirmed = booking.status === "CONFIRMED";
  const heading = isConfirmed
    ? customerBookingConfirmationCopy.confirmedHeading
    : customerBookingConfirmationCopy.pendingHeading;
  const body = isConfirmed
    ? customerBookingConfirmationCopy.confirmedBody
    : customerBookingConfirmationCopy.pendingBody;
  const schedule = formatSchedule(booking.scheduledAt);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(booking.id);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article
      aria-labelledby="booking-confirm-heading"
      className="w-full min-w-0 max-w-xl"
      data-slot="customer-booking-confirmation"
    >
      <p className="text-label font-medium text-foreground uppercase tracking-wide">
        {customerBookingConfirmationCopy.statusLabel}:{" "}
        {customerBookingStatusLabels[booking.status]}
      </p>
      <h1
        className="mt-4 text-h1 text-foreground tracking-tight"
        id="booking-confirm-heading"
      >
        {heading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">{body}</p>
      <div className="mt-8 rounded-xl border border-border p-6">
        <p className="text-label font-medium text-foreground uppercase tracking-wide">
          {customerBookingConfirmationCopy.referenceLabel}
        </p>
        <p className="mt-2 font-medium text-body text-foreground">
          {booking.id}
        </p>
        <Button
          className="mt-4"
          onClick={handleCopy}
          type="button"
          variant="outline"
        >
          {customerBookingConfirmationCopy.copyReference}
        </Button>
        {copied ? (
          <p className="mt-2 text-caption text-muted-foreground" role="status">
            {customerBookingConfirmationCopy.copied}
          </p>
        ) : null}
      </div>
      <section className="mt-10 max-w-prose">
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerBookingConfirmationCopy.serviceHeading}
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          {booking.service?.name ??
            "This booking does not include a service name."}
        </p>
      </section>
      {schedule === null ? null : (
        <section className="mt-10 max-w-prose">
          <h2 className="text-h2 text-foreground tracking-tight">
            {customerBookingConfirmationCopy.scheduleHeading}
          </h2>
          <p className="mt-3 text-body text-muted-foreground">{schedule}</p>
        </section>
      )}
      {booking.serviceAddress === null ||
      booking.serviceAddress.trim() === "" ? null : (
        <section className="mt-10 max-w-prose">
          <h2 className="text-h2 text-foreground tracking-tight">
            {customerBookingConfirmationCopy.addressHeading}
          </h2>
          <p className="mt-3 text-body text-muted-foreground">
            {booking.serviceAddress}
          </p>
        </section>
      )}
      {booking.linkedToQuote ? (
        <p className="mt-8 text-body text-muted-foreground">
          {customerBookingConfirmationCopy.linkedQuote}
        </p>
      ) : null}
      <section className="mt-10 max-w-prose">
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerBookingConfirmationCopy.nextStepsHeading}
        </h2>
        <p className="mt-3 text-body text-muted-foreground">
          {customerBookingConfirmationCopy.nextStepsBody}
        </p>
      </section>
      <p className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          {customerBookingConfirmationCopy.home}
        </Link>
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CUSTOMER_PATHS.services}
        >
          {customerBookingConfirmationCopy.services}
        </Link>
      </p>
    </article>
  );
}

function formatSchedule(iso: string | null): string | null {
  if (iso === null || iso === "") {
    return null;
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}
