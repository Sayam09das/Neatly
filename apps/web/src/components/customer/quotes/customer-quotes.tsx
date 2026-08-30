import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement } from "react";
import { CustomerRefreshErrorState } from "@/components/customer/customer-refresh-error";
import { CustomerQuotesEmptyState } from "@/components/customer/customer-states";
import {
  CUSTOMER_PATHS,
  customerBookingDetailPath,
  customerBookingFromQuotePath,
  customerQuoteDetailPath,
  customerQuoteServiceTypeLabels,
  customerQuoteStatusLabels,
  customerQuotesCopy,
} from "@/config/customer";
import {
  formatCustomerQuoteDate,
  formatQuoteAmount,
} from "@/lib/customer/quotes";
import type { CustomerQuoteList, CustomerQuoteView } from "@/types/customer";

interface CustomerQuotesProps {
  list: CustomerQuoteList | null;
}

export function CustomerQuotes({ list }: CustomerQuotesProps): ReactElement {
  return (
    <div className="w-full min-w-0">
      <header className="max-w-prose">
        <h1 className="text-h1 text-foreground tracking-tight">
          {customerQuotesCopy.heading}
        </h1>
        <p className="mt-3 text-body text-muted-foreground">
          {customerQuotesCopy.description}
        </p>
      </header>
      {list === null ? (
        <div className="mt-8">
          <CustomerRefreshErrorState />
        </div>
      ) : list.items.length === 0 ? (
        <div className="mt-8">
          <CustomerQuotesEmptyState />
          <p className="mt-6">
            <Link
              className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={CUSTOMER_PATHS.quote}
            >
              {customerQuotesCopy.requestAction}
            </Link>
          </p>
        </div>
      ) : (
        <QuotesList items={list.items} />
      )}
    </div>
  );
}

interface QuotesListProps {
  items: readonly CustomerQuoteView[];
}

function QuotesList({ items }: QuotesListProps): ReactElement {
  return (
    <>
      <ul className="mt-8 flex flex-col gap-4 lg:hidden">
        {items.map((quote) => (
          <li className="rounded-xl border border-border p-4" key={quote.id}>
            <QuoteCard quote={quote} />
          </li>
        ))}
      </ul>
      <div className="mt-8 hidden overflow-x-auto lg:block">
        <table className="w-full min-w-xl text-left">
          <caption className="sr-only">
            {customerQuotesCopy.tableCaption}
          </caption>
          <thead>
            <tr className="border-b border-border text-caption text-muted-foreground">
              <th className="py-3 pr-4 font-medium">
                {customerQuotesCopy.serviceLabel}
              </th>
              <th className="py-3 pr-4 font-medium">
                {customerQuotesCopy.preferredDate}
              </th>
              <th className="py-3 pr-4 font-medium">
                {customerQuotesCopy.statusLabel}
              </th>
              <th className="py-3 pr-4 font-medium">
                {customerQuotesCopy.amountLabel}
              </th>
              <th className="py-3 font-medium">
                {customerQuotesCopy.referenceLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((quote) => (
              <tr className="border-b border-border" key={quote.id}>
                <td className="py-4 pr-4 text-body text-foreground">
                  {customerQuoteServiceTypeLabels[quote.serviceType]}
                </td>
                <td className="py-4 pr-4 text-body text-muted-foreground">
                  {formatCustomerQuoteDate(quote.preferredDate) ?? "—"}
                </td>
                <td className="py-4 pr-4">
                  <QuoteStatusBadge status={quote.status} />
                </td>
                <td className="py-4 pr-4 text-body text-muted-foreground">
                  {formatQuoteAmount(quote.quotedAmount) ?? "—"}
                </td>
                <td className="py-4">
                  <QuoteActions quote={quote} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function QuoteCard({ quote }: { quote: CustomerQuoteView }): ReactElement {
  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-h3 text-foreground">
          {customerQuoteServiceTypeLabels[quote.serviceType]}
        </h2>
        <QuoteStatusBadge status={quote.status} />
      </div>
      <p className="mt-2 text-body-small text-muted-foreground">
        {formatCustomerQuoteDate(quote.preferredDate) ?? "—"}
      </p>
      <p className="mt-1 text-caption text-muted-foreground">
        {customerQuotesCopy.referenceLabel}: {quote.id}
      </p>
      {quote.quotedAmount === null ? null : (
        <p className="mt-2 text-body text-foreground">
          {formatQuoteAmount(quote.quotedAmount)}
        </p>
      )}
      <div className="mt-3">
        <QuoteActions quote={quote} />
      </div>
    </article>
  );
}

function QuoteActions({ quote }: { quote: CustomerQuoteView }): ReactElement {
  if (quote.status === "CONVERTED" && quote.bookingId !== null) {
    return (
      <Link
        className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href={customerBookingDetailPath(quote.bookingId)}
      >
        {customerQuotesCopy.viewBookingAction}
      </Link>
    );
  }

  if (quote.status === "ACCEPTED") {
    return (
      <Link
        className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href={customerBookingFromQuotePath(quote.id, quote.service?.slug)}
      >
        {customerQuotesCopy.bookAction}
      </Link>
    );
  }

  return (
    <Link
      className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={customerQuoteDetailPath(quote.id)}
    >
      {customerQuotesCopy.viewAction}
    </Link>
  );
}

function QuoteStatusBadge({
  status,
}: {
  status: CustomerQuoteView["status"];
}): ReactElement {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full px-3 text-caption font-medium",
        status === "DECLINED" || status === "CLOSED"
          ? "bg-muted text-muted-foreground"
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {customerQuoteStatusLabels[status]}
    </span>
  );
}
