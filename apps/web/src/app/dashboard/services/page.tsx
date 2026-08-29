import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ServicesDiscovery } from "@/components/customer/services/services-discovery";
import { CUSTOMER_PATHS, customerSurfaceCopy } from "@/config/customer";
import { requireCustomerPage } from "@/lib/auth/current-user";
import {
  loadPublicCatalog,
  parseCustomerServicesSearchParams,
} from "@/lib/customer/catalog";

export const metadata: Metadata = {
  description: customerSurfaceCopy.services.description,
  title: customerSurfaceCopy.services.title,
};

interface CustomerDashboardServicesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CustomerDashboardServicesPage({
  searchParams,
}: CustomerDashboardServicesPageProps): Promise<ReactElement> {
  await requireCustomerPage();
  const query = parseCustomerServicesSearchParams(await searchParams);
  const result = await loadPublicCatalog(query);

  return result.ok ? (
    <ServicesDiscovery
      catalogHref={CUSTOMER_PATHS.dashboardServices}
      list={result.list}
      query={query}
      status="success"
    />
  ) : (
    <ServicesDiscovery
      catalogHref={CUSTOMER_PATHS.dashboardServices}
      list={null}
      query={query}
      status="error"
    />
  );
}
