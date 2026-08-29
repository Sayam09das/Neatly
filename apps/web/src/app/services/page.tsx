import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import { ServicesDiscovery } from "@/components/customer/services/services-discovery";
import { customerSurfaceCopy } from "@/config/customer";
import {
  loadPublicCatalog,
  parseCustomerServicesSearchParams,
} from "@/lib/customer/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: customerSurfaceCopy.services.description,
  title: customerSurfaceCopy.services.title,
};

interface ServicesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps): Promise<ReactElement> {
  const query = parseCustomerServicesSearchParams(await searchParams);
  const result = await loadPublicCatalog(query);

  return (
    <CustomerPublicFrame>
      {result.ok ? (
        <ServicesDiscovery list={result.list} query={query} status="success" />
      ) : (
        <ServicesDiscovery list={null} query={query} status="error" />
      )}
    </CustomerPublicFrame>
  );
}
