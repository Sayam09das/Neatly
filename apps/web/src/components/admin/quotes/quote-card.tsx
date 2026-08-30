"use client";

import { Button, Card } from "@neatly/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactElement } from "react";
import { fadeUp } from "@/animations/motion/variants";
import { CustomerAvatar } from "@/components/admin/customers/customer-avatar";
import { QuoteRowActions } from "@/components/admin/quotes/quote-row-actions";
import { QuoteStatusBadge } from "@/components/admin/quotes/quote-status-badge";
import {
  adminQuoteCopy,
  getAdminQuoteDetailsPath,
} from "@/config/admin-quotes";
import {
  formatQuoteRequestedAt,
  getQuoteCustomerName,
  getQuoteServiceLabel,
} from "@/lib/admin/quotes";
import type { AdminQuote } from "@/types/admin-quote";

interface QuoteCardProps {
  quote: AdminQuote;
}

export function QuoteCard({ quote }: QuoteCardProps): ReactElement {
  return (
    <motion.article
      className="rounded-lg border border-border bg-surface p-4"
      data-slot="quote-card"
      variants={fadeUp}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <CustomerAvatar name={quote.fullName} />
          <div className="min-w-0">
            <p className="truncate text-body-small font-medium text-foreground">
              {getQuoteCustomerName(quote.fullName)}
            </p>
            <p className="mt-1 truncate text-caption text-muted-foreground">
              {quote.email}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <QuoteStatusBadge status={quote.status} />
          <QuoteRowActions quote={quote} />
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-2">
        <QuoteCardField
          label={adminQuoteCopy.tableService}
          value={getQuoteServiceLabel(quote.serviceType)}
        />
        <QuoteCardField
          label={adminQuoteCopy.tableRequested}
          value={formatQuoteRequestedAt(
            quote.preferredDate,
            quote.preferredTime,
          )}
        />
      </dl>
      <Button asChild className="mt-4 w-full" variant="outline">
        <Link href={getAdminQuoteDetailsPath(quote.id)}>
          {adminQuoteCopy.viewAction}
        </Link>
      </Button>
    </motion.article>
  );
}

interface QuoteCardFieldProps {
  label: string;
  value: string;
}

function QuoteCardField({ label, value }: QuoteCardFieldProps): ReactElement {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="truncate text-body-small text-foreground">{value}</dd>
    </div>
  );
}

interface QuoteCardListProps {
  quotes: readonly AdminQuote[];
}

export function QuoteCardList({ quotes }: QuoteCardListProps): ReactElement {
  return (
    <Card
      className="flex flex-col gap-3 p-3 shadow-none md:hidden"
      data-slot="quote-card-list"
    >
      {quotes.map((quote) => (
        <QuoteCard key={quote.id} quote={quote} />
      ))}
    </Card>
  );
}
