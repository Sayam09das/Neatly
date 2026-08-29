import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerRefreshErrorState } from "@/components/customer/customer-refresh-error";
import { CustomerProfileForm } from "@/components/customer/profile/customer-profile";
import { CUSTOMER_LOGIN_PATH, customerSurfaceCopy } from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import { loadCustomerProfile } from "@/lib/customer/profile";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: customerSurfaceCopy.profile.title,
};

export default async function CustomerProfilePage(): Promise<ReactElement> {
  await requireCustomerPage();
  const result = await loadCustomerProfile(await readCustomerSessionToken());

  if (!result.ok && result.unauthorized) {
    redirect(CUSTOMER_LOGIN_PATH);
  }

  if (!result.ok) {
    return <CustomerRefreshErrorState />;
  }

  return <CustomerProfileForm profile={result.profile} />;
}
