import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerBookings } from "@/components/customer/bookings/customer-bookings";
import { CUSTOMER_LOGIN_PATH, customerSurfaceCopy } from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import {
  loadCustomerBookings,
  parseCustomerBookingsSearchParams,
} from "@/lib/customer/booking";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: customerSurfaceCopy.bookings.title,
};

interface CustomerBookingsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CustomerBookingsPage({
  searchParams,
}: CustomerBookingsPageProps): Promise<ReactElement> {
  await requireCustomerPage();
  const query = parseCustomerBookingsSearchParams(await searchParams);
  const result = await loadCustomerBookings(
    query,
    await readCustomerSessionToken(),
  );

  if (!result.ok && result.unauthorized) {
    redirect(CUSTOMER_LOGIN_PATH);
  }

  return (
    <CustomerBookings list={result.ok ? result.list : null} query={query} />
  );
}
