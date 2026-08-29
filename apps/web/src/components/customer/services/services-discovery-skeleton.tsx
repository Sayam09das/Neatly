import { Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { customerShellCopy, customerSurfaceCopy } from "@/config/customer";

export function ServicesDiscoverySkeleton(): ReactElement {
  return (
    <section
      aria-busy="true"
      aria-labelledby="customer-services-heading"
      aria-live="polite"
      className="w-full min-w-0"
      data-slot="customer-services-loading"
      role="status"
    >
      <p className="sr-only">{customerShellCopy.loadingLabel}</p>
      <h1
        className="text-h1 text-foreground tracking-tight"
        id="customer-services-heading"
      >
        {customerSurfaceCopy.services.heading}
      </h1>
      <div className="mt-4 max-w-prose space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 max-w-full" />
      </div>
      <div className="mt-8 max-w-xl">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-11 w-full" />
      </div>
      <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ServiceCardSkeleton />
        <ServiceCardSkeleton />
        <ServiceCardSkeleton />
      </ul>
    </section>
  );
}

function ServiceCardSkeleton(): ReactElement {
  return (
    <li className="overflow-hidden rounded-xl border border-border">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-6 w-2/3 max-w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2 max-w-full" />
      </div>
    </li>
  );
}
