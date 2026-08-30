"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fade } from "@/animations/motion/variants";
import { CustomerAvatar } from "@/components/admin/customers/customer-avatar";
import { QuoteRowActions } from "@/components/admin/quotes/quote-row-actions";
import { QuoteStatusBadge } from "@/components/admin/quotes/quote-status-badge";
import { adminQuoteCopy } from "@/config/admin-quotes";
import {
  formatQuoteInstant,
  formatQuoteRequestedAt,
  getQuoteCustomerName,
  getQuoteIdLabel,
  getQuotePropertyLabel,
  getQuoteServiceLabel,
} from "@/lib/admin/quotes";
import type { AdminQuote } from "@/types/admin-quote";

interface QuotesDesktopTableProps {
  quotes: readonly AdminQuote[];
}

export function QuotesDesktopTable({
  quotes,
}: QuotesDesktopTableProps): ReactElement {
  return (
    <Card className="hidden overflow-x-auto shadow-none md:block">
      <table className="w-full min-w-0 border-collapse text-left">
        <caption className="sr-only">{adminQuoteCopy.tableLabel}</caption>
        <thead className="border-b border-border">
          <tr className="text-caption text-muted-foreground">
            <th className="px-4 py-3 font-medium" scope="col">
              {adminQuoteCopy.tableQuote}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminQuoteCopy.tableCustomer}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminQuoteCopy.tableService}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminQuoteCopy.tableProperty}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminQuoteCopy.tableRequested}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminQuoteCopy.tableStatus}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminQuoteCopy.tableCreated}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminQuoteCopy.tableActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <QuoteTableRow key={quote.id} quote={quote} />
          ))}
        </tbody>
      </table>
    </Card>
  );
}

interface QuoteTableRowProps {
  quote: AdminQuote;
}

function QuoteTableRow({ quote }: QuoteTableRowProps): ReactElement {
  return (
    <motion.tr
      className="border-b border-border last:border-b-0"
      data-slot="quote-table-row"
      variants={fade}
    >
      <td className="px-4 py-3 text-body-small text-foreground">
        {getQuoteIdLabel(quote.id)}
      </td>
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <CustomerAvatar name={quote.fullName} />
          <div className="min-w-0">
            <p className="truncate text-body-small text-foreground">
              {getQuoteCustomerName(quote.fullName)}
            </p>
            <p className="truncate text-caption text-muted-foreground">
              {quote.email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {getQuoteServiceLabel(quote.serviceType)}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {getQuotePropertyLabel(quote.propertyType)}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {formatQuoteRequestedAt(quote.preferredDate, quote.preferredTime)}
      </td>
      <td className="px-4 py-3">
        <QuoteStatusBadge status={quote.status} />
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {formatQuoteInstant(quote.createdAt, { dateStyle: "medium" })}
      </td>
      <td className="px-4 py-3">
        <QuoteRowActions quote={quote} />
      </td>
    </motion.tr>
  );
}
