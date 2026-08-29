import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { ReactElement } from "react";
import { BookingConfirmation } from "@/components/customer/booking/booking-confirmation";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import { AUTH_SESSION_COOKIE_NAME } from "@/config/auth";
import {
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_PATHS,
  customerSurfaceCopy,
} from "@/config/customer";
import { loadCustomerBooking } from "@/lib/customer/booking";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: customerSurfaceCopy.bookingConfirmation.title,
};

interface BookingConfirmationDetailPageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function BookingConfirmationDetailPage({
  params,
}: BookingConfirmationDetailPageProps): Promise<ReactElement> {
  const { bookingId } = await params;
  const jar = await cookies();
  const sessionToken = jar.get(AUTH_SESSION_COOKIE_NAME)?.value;

  if (sessionToken === undefined || sessionToken.trim() === "") {
    redirect(
      `${CUSTOMER_LOGIN_PATH}?next=${encodeURIComponent(`${CUSTOMER_PATHS.bookingConfirmation}/${bookingId}`)}`,
    );
  }

  const result = await loadCustomerBooking(bookingId, sessionToken);

  if (!result.ok && result.unauthorized) {
    redirect(
      `${CUSTOMER_LOGIN_PATH}?next=${encodeURIComponent(`${CUSTOMER_PATHS.bookingConfirmation}/${bookingId}`)}`,
    );
  }

  if (!result.ok) {
    notFound();
  }

  return (
    <CustomerPublicFrame>
      <BookingConfirmation booking={result.booking} />
    </CustomerPublicFrame>
  );
}
