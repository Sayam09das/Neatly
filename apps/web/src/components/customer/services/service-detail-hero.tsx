import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { ServiceDetailCover } from "@/components/customer/services/service-detail-cover";
import {
  CUSTOMER_PATHS,
  customerQuoteLabel,
  customerServiceApplyPath,
  customerServiceDetailCopy,
  customerServicesCopy,
} from "@/config/customer";
import type { CustomerServiceDetail } from "@/types/customer";

interface ServiceDetailHeroProps {
  service: CustomerServiceDetail;
}

export function ServiceDetailHero({
  service,
}: ServiceDetailHeroProps): ReactElement {
  const quoteHref = customerServiceApplyPath(service.slug);
  const quoteLabel = customerQuoteLabel(service.name);

  return (
    <header className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
      <div className="min-w-0 lg:col-span-6">
        {service.isFeatured ? (
          <p className="text-label text-primary uppercase">
            {customerServicesCopy.featuredLabel}
          </p>
        ) : null}
        <h1
          className="text-display text-foreground tracking-tight"
          id="customer-service-heading"
        >
          {service.name}
        </h1>
        {service.shortDescription.trim() === "" ? null : (
          <p className="mt-6 max-w-prose text-body text-muted-foreground">
            {service.shortDescription}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild>
            <Link aria-label={quoteLabel} href={quoteHref}>
              {customerServiceDetailCopy.quoteCta}
            </Link>
          </Button>
          <Link
            className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={CUSTOMER_PATHS.services}
          >
            {customerServicesCopy.backToServices}
          </Link>
        </div>
      </div>
      <div className="lg:col-span-6">
        <ServiceDetailCover service={service} />
      </div>
    </header>
  );
}
