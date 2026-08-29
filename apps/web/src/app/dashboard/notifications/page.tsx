import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerNotifications } from "@/components/customer/notifications/customer-notifications";
import { CUSTOMER_LOGIN_PATH, customerSurfaceCopy } from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import {
  loadCustomerNotifications,
  parseCustomerNotificationsSearchParams,
} from "@/lib/customer/notifications";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: customerSurfaceCopy.notifications.title,
};

interface CustomerNotificationsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CustomerNotificationsPage({
  searchParams,
}: CustomerNotificationsPageProps): Promise<ReactElement> {
  await requireCustomerPage();
  const query = parseCustomerNotificationsSearchParams(await searchParams);
  const result = await loadCustomerNotifications(
    query,
    await readCustomerSessionToken(),
  );

  if (!result.ok && result.unauthorized) {
    redirect(CUSTOMER_LOGIN_PATH);
  }

  return (
    <CustomerNotifications
      list={result.ok ? result.list : null}
      query={query}
    />
  );
}
