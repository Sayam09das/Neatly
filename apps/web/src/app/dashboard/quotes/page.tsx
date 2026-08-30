import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerQuotes } from "@/components/customer/quotes/customer-quotes";
import { CUSTOMER_LOGIN_PATH, customerSurfaceCopy } from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import { loadCustomerQuotes } from "@/lib/customer/quotes";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: customerSurfaceCopy.quotes.title,
};

export default async function CustomerQuotesPage(): Promise<ReactElement> {
  await requireCustomerPage();
  const result = await loadCustomerQuotes(await readCustomerSessionToken());

  if (!result.ok && result.unauthorized) {
    redirect(CUSTOMER_LOGIN_PATH);
  }

  return <CustomerQuotes list={result.ok ? result.list : null} />;
}
