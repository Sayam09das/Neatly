import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerRefreshErrorState } from "@/components/customer/customer-refresh-error";
import { CustomerHelp } from "@/components/customer/help/customer-help";
import { CUSTOMER_LOGIN_PATH, customerSurfaceCopy } from "@/config/customer";
import { getPublishedContact } from "@/config/landing";
import { requireCustomerPage } from "@/lib/auth/current-user";
import { loadCustomerHelp } from "@/lib/customer/help";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: customerSurfaceCopy.help.title,
};

export default async function CustomerHelpPage(): Promise<ReactElement> {
  await requireCustomerPage();
  const result = await loadCustomerHelp(await readCustomerSessionToken());

  if (!result.ok && result.unauthorized) {
    redirect(CUSTOMER_LOGIN_PATH);
  }

  if (!result.ok) {
    return <CustomerRefreshErrorState />;
  }

  return (
    <CustomerHelp
      contact={getPublishedContact()}
      workspace={result.workspace}
    />
  );
}
