import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import { QuoteRequestForm } from "@/components/customer/quote/quote-request-form";
import { customerSurfaceCopy } from "@/config/customer";
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
  title: customerSurfaceCopy.quote.title,
  description: customerSurfaceCopy.quote.description,
};

interface QuotePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function QuotePage({
  searchParams,
}: QuotePageProps): Promise<ReactElement> {
  const slug = parseCustomerQuoteServiceSlug(await searchParams);
  const detail =
    slug === ""
      ? { ok: false as const, notFound: false }
      : await loadPublicCatalogDetail(slug);

  return (
    <CustomerPublicFrame>
      <QuoteRequestForm
        service={detail.ok ? detail.service : null}
        serviceUnavailable={slug !== "" && !detail.ok && detail.notFound}
      />
    </CustomerPublicFrame>
  );
}
