import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { BookingFlowForm } from "@/components/customer/booking/booking-flow-form";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import {
  CUSTOMER_LOGIN_PATH,
  CUSTOMER_PATHS,
  customerSurfaceCopy,
} from "@/config/customer";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  loadPublicCatalogDetail,
  parseCustomerQuoteServiceSlug,
} from "@/lib/customer/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: customerSurfaceCopy.booking.title,
  description: customerSurfaceCopy.booking.description,
};

interface BookingPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BookingPage({
  searchParams,
}: BookingPageProps): Promise<ReactElement> {
  const user = await getCurrentUser();

  if (user === null) {
    redirect(
      `${CUSTOMER_LOGIN_PATH}?next=${encodeURIComponent(CUSTOMER_PATHS.booking)}`,
    );
  }

  const slug = parseCustomerQuoteServiceSlug(await searchParams);
  const detail =
    slug === ""
      ? { notFound: false as const, ok: false as const }
      : await loadPublicCatalogDetail(slug);

  return (
    <CustomerPublicFrame>
      <BookingFlowForm
        service={detail.ok ? detail.service : null}
        serviceUnavailable={slug !== "" && !detail.ok && detail.notFound}
      />
    </CustomerPublicFrame>
  );
}
