import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement } from "react";
import { DashboardSectionError } from "@/components/customer/dashboard/dashboard-section-error";
import {
  CUSTOMER_PATHS,
  customerDashboardCopy,
  customerQuoteServiceTypeLabels,
  customerQuoteStatusLabels,
} from "@/config/customer";
import type { CustomerDashboardSection } from "@/lib/customer/dashboard";
import { previewQuotes } from "@/lib/customer/dashboard";
import { formatCustomerQuoteDate } from "@/lib/customer/quotes";
import type { CustomerQuoteList, CustomerQuoteView } from "@/types/customer";

interface DashboardRecentQuotesProps {
  quotes: CustomerDashboardSection<CustomerQuoteList>;
}

export function DashboardRecentQuotes({
  quotes,
}: DashboardRecentQuotesProps): ReactElement {
  return (
    <section className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-h2 text-foreground tracking-tight">
          {customerDashboardCopy.quotesHeading}
        </h2>
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CUSTOMER_PATHS.quotes}
        >
          {customerDashboardCopy.quotesViewAll}
        </Link>
      </div>
      {quotes.status === "error" ? (
        <div className="mt-4">
          <DashboardSectionError message={customerDashboardCopy.quotesError} />
        </div>
      ) : quotes.data.items.length === 0 ? (
        <p className="mt-3 text-body text-muted-foreground">
          {customerDashboardCopy.quotesEmpty}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
          {previewQuotes(quotes.data.items).map((quote) => (
            <li className="p-4" key={quote.id}>
              <QuotePreview quote={quote} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function QuotePreview({ quote }: { quote: CustomerQuoteView }): ReactElement {
  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-medium text-body text-foreground">
          {customerQuoteServiceTypeLabels[quote.serviceType]}
        </p>
        <span
          className={cn(
            "inline-flex min-h-8 items-center rounded-full px-3 text-caption font-medium",
            quote.status === "DECLINED" || quote.status === "CLOSED"
              ? "bg-muted text-muted-foreground"
              : "bg-secondary text-secondary-foreground",
          )}
        >
          {customerQuoteStatusLabels[quote.status]}
        </span>
      </div>
      <p className="mt-2 text-body-small text-muted-foreground">
        {formatCustomerQuoteDate(quote.createdAt) ?? "—"}
      </p>
    </article>
  );
}
