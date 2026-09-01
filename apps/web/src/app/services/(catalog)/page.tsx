import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ServicesPage } from "@/components/services-page";
import { servicesPageMetadata } from "@/config/services-page";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  loadPublicCatalog,
  parseCustomerServicesSearchParams,
} from "@/lib/customer/catalog";
import { toCustomerNavbarSession } from "@/lib/customer/navbar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: servicesPageMetadata.description,
  openGraph: {
    description: servicesPageMetadata.description,
    title: servicesPageMetadata.title,
  },
  title: servicesPageMetadata.title,
};

interface ServicesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ServicesRoute({
  searchParams,
}: ServicesPageProps): Promise<ReactElement> {
  const query = parseCustomerServicesSearchParams(await searchParams);
  const [result, user] = await Promise.all([
    loadPublicCatalog(query),
    getCurrentUser(),
  ]);

  return (
    <ServicesPage
      list={result.ok ? result.list : null}
      query={query}
      session={toCustomerNavbarSession(user)}
      status={result.ok ? "success" : "error"}
    />
  );
}
