import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import {
  CUSTOMER_PATHS,
  customerQuoteLabel,
  customerQuotePath,
  customerServiceDetailCopy,
  customerServicesCopy,
} from "@/config/customer";
import { isLocalCustomerServiceImage } from "@/lib/customer/catalog";
import type { CustomerServiceDetail } from "@/types/customer";

interface ServiceDetailHeroProps {
  service: CustomerServiceDetail;
}

export function ServiceDetailHero({
  service,
}: ServiceDetailHeroProps): ReactElement {
  const quoteHref = customerQuotePath(service.slug);
  const quoteLabel = customerQuoteLabel(service.name);

  return (
    <header className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
      <div className="min-w-0">
        <h1
          className="text-h1 text-foreground tracking-tight"
          id="customer-service-heading"
        >
          {service.name}
        </h1>
        {service.shortDescription.trim() === "" ? null : (
          <p className="mt-4 max-w-prose text-body text-muted-foreground">
            {service.shortDescription}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            aria-label={quoteLabel}
            className="inline-flex min-h-touch items-center justify-center rounded-full bg-primary px-5 py-2.5 text-button font-semibold text-primary-foreground motion-safe:transition-colors motion-safe:duration-normal hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            href={quoteHref}
          >
            {customerServiceDetailCopy.quoteCta}
          </Link>
          <Link
            className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={CUSTOMER_PATHS.services}
          >
            {customerServicesCopy.backToServices}
          </Link>
        </div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <ServiceCoverImage service={service} />
      </div>
    </header>
  );
}

function ServiceCoverImage({ service }: ServiceDetailHeroProps): ReactElement {
  if (!isLocalCustomerServiceImage(service.coverImageUrl)) {
    return (
      <div
        className="flex size-full items-center justify-center text-muted-foreground"
        data-slot="customer-service-image-fallback"
      >
        <span className="sr-only">{customerServicesCopy.imageUnavailable}</span>
      </div>
    );
  }

  const alt =
    service.coverImageAlt !== null && service.coverImageAlt.trim() !== ""
      ? service.coverImageAlt
      : service.name;

  return (
    <Image
      alt={alt}
      className="object-cover"
      fill
      priority
      sizes="(min-width: 1024px) 40vw, 100vw"
      src={service.coverImageUrl}
    />
  );
}
