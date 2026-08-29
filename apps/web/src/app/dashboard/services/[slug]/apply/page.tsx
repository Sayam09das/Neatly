import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerRefreshErrorState } from "@/components/customer/customer-refresh-error";
import { QuoteRequestForm } from "@/components/customer/quote/quote-request-form";
import { CUSTOMER_PATHS, customerSurfaceCopy } from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import { isSafeServiceSlug } from "@/lib/auth/paths";
import { loadPublicCatalogDetail } from "@/lib/customer/catalog";
import { loadCustomerProfile } from "@/lib/customer/profile";
import { readCustomerSessionToken } from "@/lib/customer/session-token";
import type { QuoteAccountContact } from "@/lib/validations/public-quote.schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: customerSurfaceCopy.quote.title,
  description: customerSurfaceCopy.quote.description,
};

interface CustomerDashboardServiceApplyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CustomerDashboardServiceApplyPage({
  params,
}: CustomerDashboardServiceApplyPageProps): Promise<ReactElement> {
  const user = await requireCustomerPage();
  const { slug } = await params;

  if (!isSafeServiceSlug(slug)) {
    notFound();
  }

  const [result, profile] = await Promise.all([
    loadPublicCatalogDetail(slug),
    loadCustomerProfile(await readCustomerSessionToken()),
  ]);

  if (!result.ok && result.notFound) {
    notFound();
  }

  if (!result.ok) {
    return <CustomerRefreshErrorState />;
  }

  const account: QuoteAccountContact = profile.ok
    ? {
        address: profile.profile.address,
        email: profile.profile.email,
        name: profile.profile.name,
        phone: profile.profile.phone,
      }
    : {
        address: null,
        email: user.email,
        name: user.name,
        phone: null,
      };

  return (
    <QuoteRequestForm
      account={account}
      catalogHref={CUSTOMER_PATHS.dashboardServices}
      service={result.service}
      serviceUnavailable={false}
    />
  );
}
