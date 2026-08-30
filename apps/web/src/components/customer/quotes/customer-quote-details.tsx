"use client";

import { Button } from "@neatly/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactElement, useState } from "react";
import {
  CUSTOMER_PATHS,
  customerBookingDetailPath,
  customerBookingFromQuotePath,
  customerQuotesCopy,
} from "@/config/customer";
import {
  acceptCustomerQuote,
  declineCustomerQuote,
  formatCustomerQuoteDate,
  formatQuoteAmount,
} from "@/lib/customer/quotes";
import { handleCustomerApiFailure } from "@/lib/customer/session";
import type { CustomerQuoteView } from "@/types/customer";

interface CustomerQuoteDetailsProps {
  quote: CustomerQuoteView;
}

export function CustomerQuoteDetails({
  quote: initialQuote,
}: CustomerQuoteDetailsProps): ReactElement {
  const router = useRouter();
  const [quote, setQuote] = useState(initialQuote);
  const [submitting, setSubmitting] = useState<"accept" | "decline" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function handleAccept(): Promise<void> {
    setSubmitting("accept");
    setError(null);
    const result = await acceptCustomerQuote(quote.id);
    setSubmitting(null);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      setError(result.message || customerQuotesCopy.acceptError);
      return;
    }

    setQuote(result.data);
    router.refresh();
  }

  async function handleDecline(): Promise<void> {
    setSubmitting("decline");
    setError(null);
    const result = await declineCustomerQuote(quote.id);
    setSubmitting(null);

    if (!result.ok) {
      handleCustomerApiFailure(result);
      setError(result.message || customerQuotesCopy.declineError);
      return;
    }

    setQuote(result.data);
    router.refresh();
  }

  return (
    <article className="w-full min-w-0 max-w-xl">
      <p className="text-caption text-muted-foreground">{quote.id}</p>
      <h1 className="mt-2 text-h1 text-foreground tracking-tight">
        {customerQuotesCopy.detailsHeading}
      </h1>
      <p className="mt-3 text-body text-muted-foreground">
        {customerQuotesCopy.detailsDescription}
      </p>
      <dl className="mt-8 grid gap-3">
        <Detail
          label={customerQuotesCopy.preferredDate}
          value={formatCustomerQuoteDate(quote.preferredDate) ?? "—"}
        />
        <Detail
          label={customerQuotesCopy.amountLabel}
          value={formatQuoteAmount(quote.quotedAmount) ?? "—"}
        />
        <Detail
          label={customerQuotesCopy.statusLabel}
          value={statusCopy(quote)}
        />
      </dl>
      {error === null ? null : (
        <p className="mt-6 text-body text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {quote.status === "QUOTED" ? (
          <>
            <Button
              disabled={submitting !== null}
              isLoading={submitting === "accept"}
              onClick={(): void => {
                void handleAccept();
              }}
              type="button"
            >
              {customerQuotesCopy.acceptAction}
            </Button>
            <Button
              disabled={submitting !== null}
              onClick={(): void => {
                void handleDecline();
              }}
              type="button"
              variant="outline"
            >
              {customerQuotesCopy.declineAction}
            </Button>
          </>
        ) : null}
        {quote.status === "ACCEPTED" ? (
          <Button asChild>
            <Link
              href={customerBookingFromQuotePath(quote.id, quote.service?.slug)}
            >
              {customerQuotesCopy.bookAction}
            </Link>
          </Button>
        ) : null}
        {quote.status === "CONVERTED" && quote.bookingId !== null ? (
          <Button asChild>
            <Link href={customerBookingDetailPath(quote.bookingId)}>
              {customerQuotesCopy.viewBookingAction}
            </Link>
          </Button>
        ) : null}
        <Button asChild variant="outline">
          <Link href={CUSTOMER_PATHS.quotes}>
            {customerQuotesCopy.backToQuotes}
          </Link>
        </Button>
      </div>
    </article>
  );
}

function statusCopy(quote: CustomerQuoteView): string {
  if (quote.status === "NEW" || quote.status === "REVIEWING") {
    return customerQuotesCopy.waitingHint;
  }

  if (quote.status === "QUOTED") {
    return customerQuotesCopy.quotedHint;
  }

  if (quote.status === "ACCEPTED") {
    return customerQuotesCopy.acceptedHint;
  }

  if (quote.status === "CONVERTED") {
    return customerQuotesCopy.convertedHint;
  }

  return quote.status;
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}): ReactElement {
  return (
    <div className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)]">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="text-body text-foreground">{value}</dd>
    </div>
  );
}
