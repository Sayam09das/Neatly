import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerQuoteDetails } from "@/components/customer/quotes/customer-quote-details";
import {
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_PATHS,
  customerQuotesCopy,
} from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import { loadCustomerQuote } from "@/lib/customer/quotes";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: customerQuotesCopy.detailsHeading,
};

interface CustomerQuoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerQuoteDetailsPage({
  params,
}: CustomerQuoteDetailsPageProps): Promise<ReactElement> {
  await requireCustomerPage();
  const { id } = await params;
  const result = await loadCustomerQuote(id, await readCustomerSessionToken());

  if (!result.ok && result.unauthorized) {
    redirect(
      `${CUSTOMER_LOGIN_PATH}?next=${encodeURIComponent(`${CUSTOMER_PATHS.quotes}/${id}`)}`,
    );
  }

  if (!result.ok) {
    notFound();
  }

  return <CustomerQuoteDetails quote={result.quote} />;
}
