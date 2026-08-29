import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import { ServiceDetails } from "@/components/customer/services/service-details";
import { ServiceDetailsError } from "@/components/customer/services/service-details-error";
import { ServiceJsonLd } from "@/components/seo/service-json-ld";
import { customerServicePath, customerSurfaceCopy } from "@/config/customer";
import { loadPublicCatalogDetail } from "@/lib/customer/catalog";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadPublicCatalogDetail(slug);

  if (!result.ok) {
    return {
      robots: { follow: true, index: false },
      title: customerSurfaceCopy.serviceDetail.title,
    };
  }

  const service = result.service;
  const description =
    service.seoDescription?.trim() ||
    service.shortDescription.trim() ||
    customerSurfaceCopy.serviceDetail.description;
  const title = service.seoTitle?.trim() || service.name;
  const siteUrl = getSiteUrl();
  const canonical =
    siteUrl === undefined
      ? undefined
      : `${siteUrl}${customerServicePath(service.slug)}`;

  return {
    description,
    title,
    ...(canonical === undefined
      ? {}
      : {
          alternates: {
            canonical,
          },
        }),
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps): Promise<ReactElement> {
  const { slug } = await params;
  const result = await loadPublicCatalogDetail(slug);

  if (!result.ok && result.notFound) {
    notFound();
  }

  if (!result.ok) {
    return (
      <CustomerPublicFrame>
        <ServiceDetailsError slug={slug} />
      </CustomerPublicFrame>
    );
  }

  const siteUrl = getSiteUrl();
  const url =
    siteUrl === undefined
      ? undefined
      : `${siteUrl}${customerServicePath(result.service.slug)}`;

  return (
    <CustomerPublicFrame>
      <ServiceJsonLd service={result.service} url={url} />
      <ServiceDetails service={result.service} />
    </CustomerPublicFrame>
  );
}
