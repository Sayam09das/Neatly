import Link from "next/link";
import type { ReactElement } from "react";
import { ServiceDetailHero } from "@/components/customer/services/service-detail-hero";
import { ServiceDetailSections } from "@/components/customer/services/service-detail-sections";
import { CUSTOMER_PATHS, customerServiceDetailCopy } from "@/config/customer";
import type { CustomerServiceDetail } from "@/types/customer";

interface ServiceDetailsProps {
  service: CustomerServiceDetail;
}

export function ServiceDetails({ service }: ServiceDetailsProps): ReactElement {
  return (
    <article
      aria-labelledby="customer-service-heading"
      className="w-full min-w-0"
      data-slot="customer-service-detail"
    >
      <nav aria-label={customerServiceDetailCopy.breadcrumbLabel}>
        <ol className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
          <li>
            <Link
              className="underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="/"
            >
              {customerServiceDetailCopy.breadcrumbHome}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              className="underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={CUSTOMER_PATHS.services}
            >
              {customerServiceDetailCopy.breadcrumbServices}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground" aria-current="page">
            {service.name}
          </li>
        </ol>
      </nav>
      <div className="mt-10">
        <ServiceDetailHero service={service} />
      </div>
      <ServiceDetailSections service={service} />
    </article>
  );
}
