import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerRefreshErrorState } from "@/components/customer/customer-refresh-error";
import { CustomerSettings } from "@/components/customer/settings/customer-settings";
import { CUSTOMER_LOGIN_PATH, customerSurfaceCopy } from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import { loadCustomerAccount } from "@/lib/customer/account";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: customerSurfaceCopy.settings.title,
};

export default async function CustomerSettingsPage(): Promise<ReactElement> {
  await requireCustomerPage();
  const result = await loadCustomerAccount(await readCustomerSessionToken());

  if (!result.ok && result.unauthorized) {
    redirect(CUSTOMER_LOGIN_PATH);
  }

  if (!result.ok) {
    return <CustomerRefreshErrorState />;
  }

  return <CustomerSettings account={result.account} />;
}
