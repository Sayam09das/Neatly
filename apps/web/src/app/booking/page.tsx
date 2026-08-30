import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { BookingFlowForm } from "@/components/customer/booking/booking-flow-form";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import {
  CUSTOMER_BOOKING_QUOTE_PARAM,
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_PATHS,
  customerBookingCopy,
  customerBookingFromQuotePath,
  customerQuotesCopy,
  customerSurfaceCopy,
} from "@/config/customer";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  loadPublicCatalogDetail,
  parseCustomerQuoteServiceSlug,
} from "@/lib/customer/catalog";
import { loadCustomerQuote } from "@/lib/customer/quotes";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: customerSurfaceCopy.booking.title,
  description: customerSurfaceCopy.booking.description,
};

interface BookingPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BookingPage({
  searchParams,
}: BookingPageProps): Promise<ReactElement> {
  const user = await getCurrentUser();
  const params = await searchParams;
  const quoteId = readQuoteId(params);
  const nextPath =
    quoteId === ""
      ? CUSTOMER_PATHS.quotes
      : customerBookingFromQuotePath(
          quoteId,
          parseCustomerQuoteServiceSlug(params),
        );

  if (user === null) {
    redirect(
      `${CUSTOMER_LOGIN_PATH}?next=${encodeURIComponent(nextPath === CUSTOMER_PATHS.quotes ? CUSTOMER_PATHS.booking : nextPath)}`,
    );
  }

  if (quoteId === "") {
    return (
      <CustomerPublicFrame>
        <QuoteRequiredState />
      </CustomerPublicFrame>
    );
  }

  const quoteResult = await loadCustomerQuote(
    quoteId,
    await readCustomerSessionToken(),
  );

  if (!quoteResult.ok && quoteResult.unauthorized) {
    redirect(`${CUSTOMER_LOGIN_PATH}?next=${encodeURIComponent(nextPath)}`);
  }

  if (!quoteResult.ok || quoteResult.quote.status !== "ACCEPTED") {
    return (
      <CustomerPublicFrame>
        <QuoteNotAcceptedState />
      </CustomerPublicFrame>
    );
  }

  const slug =
    quoteResult.quote.service?.slug ?? parseCustomerQuoteServiceSlug(params);
  const detail =
    slug === ""
      ? { notFound: false as const, ok: false as const }
      : await loadPublicCatalogDetail(slug);

  return (
    <CustomerPublicFrame>
      <BookingFlowForm
        quote={quoteResult.quote}
        service={detail.ok ? detail.service : null}
        serviceUnavailable={slug !== "" && !detail.ok && detail.notFound}
      />
    </CustomerPublicFrame>
  );
}

function QuoteRequiredState(): ReactElement {
  return (
    <section className="w-full min-w-0 max-w-xl">
      <h1 className="text-h1 text-foreground tracking-tight">
        {customerBookingCopy.detailsHeading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {customerBookingCopy.quoteRequired}
      </p>
      <p className="mt-6">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CUSTOMER_PATHS.quotes}
        >
          {customerQuotesCopy.heading}
        </Link>
      </p>
    </section>
  );
}

function QuoteNotAcceptedState(): ReactElement {
  return (
    <section className="w-full min-w-0 max-w-xl">
      <h1 className="text-h1 text-foreground tracking-tight">
        {customerBookingCopy.detailsHeading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {customerBookingCopy.quoteNotAccepted}
      </p>
      <p className="mt-6">
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CUSTOMER_PATHS.quotes}
        >
          {customerQuotesCopy.heading}
        </Link>
      </p>
    </section>
  );
}

function readQuoteId(
  searchParams: Record<string, string | string[] | undefined>,
): string {
  const value = searchParams[CUSTOMER_BOOKING_QUOTE_PARAM];

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value?.trim() ?? "";
}
