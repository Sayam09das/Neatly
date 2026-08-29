import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerBookingDetails } from "@/components/customer/bookings/customer-booking-details";
import { CustomerRefreshErrorState } from "@/components/customer/customer-refresh-error";
import { CUSTOMER_LOGIN_PATH, customerSurfaceCopy } from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import { loadCustomerBooking } from "@/lib/customer/booking";
import { loadCustomerReviews } from "@/lib/customer/reviews";
import { readCustomerSessionToken } from "@/lib/customer/session-token";

export const metadata: Metadata = {
  title: customerSurfaceCopy.bookingDetail.title,
};

interface CustomerBookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerBookingDetailPage({
  params,
}: CustomerBookingDetailPageProps): Promise<ReactElement> {
  await requireCustomerPage();
  const { id } = await params;

  if (id.trim() === "") {
    notFound();
  }

  const sessionToken = await readCustomerSessionToken();
  const [result, reviews] = await Promise.all([
    loadCustomerBooking(id, sessionToken),
    loadCustomerReviews(sessionToken),
  ]);

  if (!result.ok && result.unauthorized) {
    redirect(CUSTOMER_LOGIN_PATH);
  }

  if (!result.ok && result.notFound) {
    notFound();
  }

  if (!result.ok) {
    return <CustomerRefreshErrorState />;
  }

  const review = reviews.ok
    ? (reviews.workspace.reviews.find((item) => item.bookingId === id) ?? null)
    : null;

  return <CustomerBookingDetails booking={result.booking} review={review} />;
}
