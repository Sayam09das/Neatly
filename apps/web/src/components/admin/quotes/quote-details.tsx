"use client";

import { Button, Card } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { QuotesIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { QuoteStatusBadge } from "@/components/admin/quotes/quote-status-badge";
import { QuotesLoading } from "@/components/admin/quotes/quotes-states";
import { ADMIN_PATHS } from "@/config/admin-nav";
import { adminQuoteCopy } from "@/config/admin-quotes";
import {
  formatQuoteInstant,
  formatQuoteRequestedAt,
  getQuoteCustomerName,
  getQuoteFrequencyLabel,
  getQuoteIdLabel,
  getQuotePropertyLabel,
  getQuoteServiceLabel,
} from "@/lib/admin/quotes";
import type {
  AdminQuote,
  AdminQuoteDetailsPresentation,
} from "@/types/admin-quote";

interface AdminQuoteDetailsProps {
  presentation?: AdminQuoteDetailsPresentation;
  quoteId: string;
}

export function AdminQuoteDetails({
  presentation,
  quoteId,
}: AdminQuoteDetailsProps): ReactElement {
  return (
    <QuoteDetails
      presentation={presentation ?? { status: "empty" }}
      quoteId={quoteId}
    />
  );
}

interface QuoteDetailsProps {
  presentation: AdminQuoteDetailsPresentation;
  quoteId: string;
}

export function QuoteDetails({
  presentation,
  quoteId,
}: QuoteDetailsProps): ReactElement {
  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-quote-details"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <p className="text-caption text-muted-foreground">
              {getQuoteIdLabel(quoteId)}
            </p>
            <h1 className="mt-2 text-h1 text-foreground tracking-tight">
              {adminQuoteCopy.detailsHeading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminQuoteCopy.detailsDescription}
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href={ADMIN_PATHS.quotes}>
                {adminQuoteCopy.backToQuotes}
              </Link>
            </Button>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <QuoteDetailsBody presentation={presentation} />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

interface QuoteDetailsBodyProps {
  presentation: AdminQuoteDetailsPresentation;
}

function QuoteDetailsBody({
  presentation,
}: QuoteDetailsBodyProps): ReactElement {
  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <QuotesLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <AdminRetryState
          actionLabel={adminQuoteCopy.retryLabel}
          description={adminQuoteCopy.errorDescription}
          onRetry={presentation.onRetry}
          title={adminQuoteCopy.errorTitle}
        />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <AdminEmptyState
          description={adminQuoteCopy.detailsNotFoundDescription}
          icon={QuotesIcon}
          title={adminQuoteCopy.detailsNotFoundTitle}
        />
      </Card>
    );
  }

  return <QuoteDetailsContent quote={presentation.quote} />;
}

interface QuoteDetailsContentProps {
  quote: AdminQuote;
}

function QuoteDetailsContent({
  quote,
}: QuoteDetailsContentProps): ReactElement {
  const notes =
    quote.additionalNotes === null || quote.additionalNotes.trim() === ""
      ? adminQuoteCopy.notesEmpty
      : quote.additionalNotes;
  const showUpdated = quote.updatedAt !== quote.createdAt;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-6 shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-h3 text-foreground tracking-tight">
              {getQuoteCustomerName(quote.fullName)}
            </h2>
            <p className="mt-1 text-caption text-muted-foreground">
              {getQuoteIdLabel(quote.id)}
            </p>
          </div>
          <QuoteStatusBadge status={quote.status} />
        </div>
        <Button className="mt-6" disabled type="button" variant="outline">
          {adminQuoteCopy.createBookingAction}
        </Button>
        <p className="mt-2 text-caption text-muted-foreground">
          {adminQuoteCopy.createBookingUnavailable}
        </p>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminQuoteCopy.customerSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminQuoteCopy.customerNameLabel,
              value: getQuoteCustomerName(quote.fullName),
            },
            { label: adminQuoteCopy.customerEmailLabel, value: quote.email },
            { label: adminQuoteCopy.customerPhoneLabel, value: quote.phone },
          ]}
        />
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminQuoteCopy.requestedServiceSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminQuoteCopy.tableService,
              value: getQuoteServiceLabel(quote.serviceType),
            },
            {
              label: adminQuoteCopy.tableProperty,
              value: getQuotePropertyLabel(quote.propertyType),
            },
            {
              label: adminQuoteCopy.tableRequested,
              value: formatQuoteRequestedAt(
                quote.preferredDate,
                quote.preferredTime,
              ),
            },
            {
              label: adminQuoteCopy.frequencyLabel,
              value: getQuoteFrequencyLabel(quote.frequency),
            },
          ]}
        />
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminQuoteCopy.requestSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminQuoteCopy.addressLabel,
              value: quote.serviceAddress,
            },
            {
              label: adminQuoteCopy.sizeLabel,
              value: quote.approximateSize,
            },
            ...optionalCountItem(adminQuoteCopy.bedroomsLabel, quote.bedrooms),
            ...optionalCountItem(
              adminQuoteCopy.bathroomsLabel,
              quote.bathrooms,
            ),
            {
              label: adminQuoteCopy.notesLabel,
              value: notes,
            },
          ]}
        />
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminQuoteCopy.statusSection}
        </h2>
        <div className="mt-4">
          <QuoteStatusBadge status={quote.status} />
        </div>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminQuoteCopy.timelineSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminQuoteCopy.timelineCreated,
              value: formatQuoteInstant(quote.createdAt, {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            },
            ...(showUpdated
              ? [
                  {
                    label: adminQuoteCopy.timelineUpdated,
                    value: formatQuoteInstant(quote.updatedAt, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }),
                  },
                ]
              : []),
          ]}
        />
      </Card>
    </div>
  );
}

interface DetailListProps {
  items: readonly { label: string; value: string }[];
}

function optionalCountItem(
  label: string,
  value: number | null,
): readonly { label: string; value: string }[] {
  if (value === null) {
    return [];
  }

  return [{ label, value: String(value) }];
}

function DetailList({ items }: DetailListProps): ReactElement {
  return (
    <dl className="mt-4 grid gap-3">
      {items.map((item) => (
        <div
          className="grid gap-1 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4"
          key={item.label}
        >
          <dt className="text-caption text-muted-foreground">{item.label}</dt>
          <dd className="text-body-small text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
