import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerDashboardOverview } from "@/components/customer/dashboard/customer-dashboard-overview";
import { CUSTOMER_LOGIN_PATH, customerSurfaceCopy } from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import { loadCustomerOverview } from "@/lib/customer/booking";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: customerSurfaceCopy.dashboard.title,
};

export default async function CustomerDashboardPage(): Promise<ReactElement> {
  const user = await requireCustomerPage();
  const result = await loadCustomerOverview(await readCustomerSessionToken());

  if (!result.ok && result.unauthorized) {
    redirect(CUSTOMER_LOGIN_PATH);
  }

  return (
    <CustomerDashboardOverview
      identity={{ email: user.email, name: user.name }}
      overview={result.ok ? result.overview : null}
    />
  );
}
