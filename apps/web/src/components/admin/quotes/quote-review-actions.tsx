"use client";

import { Button, Input, Label } from "@neatly/ui";
import Link from "next/link";
import { type FormEvent, type ReactElement, useId, useState } from "react";
import { ADMIN_PATHS } from "@/config/admin-nav";
import { adminQuoteCopy } from "@/config/admin-quotes";
import { formatQuoteAmount, updateAdminQuote } from "@/lib/admin/quotes";
import type { AdminQuote } from "@/types/admin-quote";

interface QuoteReviewActionsProps {
  onUpdated?: (quote: AdminQuote) => void;
  quote: AdminQuote;
}

export function QuoteReviewActions({
  onUpdated,
  quote,
}: QuoteReviewActionsProps): ReactElement {
  const amountId = useId();
  const [amount, setAmount] = useState(
    quote.quotedAmount === null ? "" : String(quote.quotedAmount),
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<
    "quote" | "review" | "decline" | null
  >(null);
  const canPrice =
    quote.status === "NEW" ||
    quote.status === "REVIEWING" ||
    quote.status === "CONTACTED" ||
    quote.status === "QUOTED";
  const canReview = quote.status === "NEW";
  const canDecline =
    quote.status === "NEW" ||
    quote.status === "REVIEWING" ||
    quote.status === "CONTACTED" ||
    quote.status === "QUOTED";

  async function submit(action: "quote" | "review" | "decline"): Promise<void> {
    setError(null);

    if (action === "quote") {
      const parsed = Number.parseFloat(amount);

      if (!Number.isFinite(parsed) || parsed <= 0) {
        setError(adminQuoteCopy.invalidAmount);
        return;
      }

      setSubmitting("quote");
      const result = await updateAdminQuote(quote.id, {
        quotedAmount: parsed,
        status: "QUOTED",
      });
      setSubmitting(null);

      if (!result.ok) {
        setError(result.message || adminQuoteCopy.saveError);
        return;
      }

      onUpdated?.(result.data);
      return;
    }

    if (action === "review") {
      setSubmitting("review");
      const result = await updateAdminQuote(quote.id, { status: "REVIEWING" });
      setSubmitting(null);

      if (!result.ok) {
        setError(result.message || adminQuoteCopy.saveError);
        return;
      }

      onUpdated?.(result.data);
      return;
    }

    if (!window.confirm(adminQuoteCopy.declineConfirm)) {
      return;
    }

    setSubmitting("decline");
    const result = await updateAdminQuote(quote.id, { status: "DECLINED" });
    setSubmitting(null);

    if (!result.ok) {
      setError(result.message || adminQuoteCopy.saveError);
      return;
    }

    onUpdated?.(result.data);
  }

  async function handleQuoteSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    await submit("quote");
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <StatusHint quote={quote} />
      {canPrice ? (
        <form className="flex flex-col gap-3" onSubmit={handleQuoteSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor={amountId}>{adminQuoteCopy.amountLabel}</Label>
            <Input
              id={amountId}
              inputMode="decimal"
              min="0.01"
              name="quotedAmount"
              onChange={(event): void => {
                setAmount(event.target.value);
              }}
              step="0.01"
              type="number"
              value={amount}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {canReview ? (
              <Button
                disabled={submitting !== null}
                onClick={(): void => {
                  void submit("review");
                }}
                type="button"
                variant="outline"
              >
                {adminQuoteCopy.reviewAction}
              </Button>
            ) : null}
            <Button
              disabled={submitting !== null}
              isLoading={submitting === "quote"}
              type="submit"
            >
              {submitting === "quote"
                ? adminQuoteCopy.sendingQuote
                : adminQuoteCopy.quoteAction}
            </Button>
            {canDecline ? (
              <Button
                disabled={submitting !== null}
                onClick={(): void => {
                  void submit("decline");
                }}
                type="button"
                variant="outline"
              >
                {adminQuoteCopy.declineAction}
              </Button>
            ) : null}
          </div>
        </form>
      ) : quote.bookingId !== null ? (
        <Button asChild variant="outline">
          <Link href={ADMIN_PATHS.bookings}>
            {adminQuoteCopy.createBookingAction}
          </Link>
        </Button>
      ) : null}
      {error === null ? null : (
        <p className="text-body text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function StatusHint({ quote }: { quote: AdminQuote }): ReactElement | null {
  if (quote.status === "QUOTED") {
    return (
      <p className="text-body-small text-muted-foreground">
        {formatQuoteAmount(quote.quotedAmount)} · {adminQuoteCopy.quotedHint}
      </p>
    );
  }

  if (quote.status === "ACCEPTED") {
    return (
      <p className="text-body-small text-muted-foreground">
        {adminQuoteCopy.acceptedHint}
      </p>
    );
  }

  if (quote.status === "CONVERTED") {
    return (
      <p className="text-body-small text-muted-foreground">
        {adminQuoteCopy.convertedHint}
      </p>
    );
  }

  if (quote.status === "REVIEWING") {
    return (
      <p className="text-body-small text-muted-foreground">
        {adminQuoteCopy.reviewHint}
      </p>
    );
  }

  return null;
}
