import { cn } from "@neatly/utils";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import {
  customerServiceDetailsLabel,
  customerServicePath,
  customerServicesCopy,
} from "@/config/customer";
import { isLocalCustomerServiceImage } from "@/lib/customer/catalog";
import type { CustomerService } from "@/types/customer";

interface ServicesDiscoveryCardProps {
  priority?: boolean;
  service: CustomerService;
}

export function ServicesDiscoveryCard({
  priority = false,
  service,
}: ServicesDiscoveryCardProps): ReactElement {
  const detailsHref = customerServicePath(service.slug);
  const detailsLabel = customerServiceDetailsLabel(service.name);

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background text-foreground",
        "motion-safe:transition-shadow motion-safe:duration-normal motion-safe:ease-standard",
        "motion-safe:hover:shadow-md",
      )}
      data-slot="customer-service-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <ServiceCoverImage priority={priority} service={service} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-h3 text-foreground tracking-tight">
          {service.name}
        </h2>
        <p className="mt-3 max-w-prose text-body-small text-muted-foreground">
          {service.shortDescription}
        </p>
        <p className="mt-6">
          <Link
            aria-label={detailsLabel}
            className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            href={detailsHref}
          >
            {customerServicesCopy.viewDetails}
          </Link>
        </p>
      </div>
    </article>
  );
}

function ServiceCoverImage({
  priority,
  service,
}: ServicesDiscoveryCardProps): ReactElement {
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
      priority={priority}
      sizes={
        service.isFeatured
          ? "(min-width: 768px) 66vw, 100vw"
          : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      }
      src={service.coverImageUrl}
    />
  );
}
