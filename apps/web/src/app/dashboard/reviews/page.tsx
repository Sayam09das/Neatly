import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerRefreshErrorState } from "@/components/customer/customer-refresh-error";
import { CustomerReviews } from "@/components/customer/reviews/customer-reviews";
import { CUSTOMER_LOGIN_PATH, customerSurfaceCopy } from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import { loadCustomerReviews } from "@/lib/customer/reviews";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: customerSurfaceCopy.reviews.title,
};

interface CustomerReviewsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CustomerReviewsPage({
  searchParams,
}: CustomerReviewsPageProps): Promise<ReactElement> {
  await requireCustomerPage();
  const params = await searchParams;
  const bookingValue = params.booking;
  const bookingId = Array.isArray(bookingValue)
    ? (bookingValue[0] ?? null)
    : (bookingValue ?? null);
  const result = await loadCustomerReviews(await readCustomerSessionToken());

  if (!result.ok && result.unauthorized) {
    redirect(CUSTOMER_LOGIN_PATH);
  }

  if (!result.ok) {
    return <CustomerRefreshErrorState />;
  }

  return (
    <CustomerReviews
      bookingId={bookingId === "" ? null : bookingId}
      workspace={result.workspace}
    />
  );
}
