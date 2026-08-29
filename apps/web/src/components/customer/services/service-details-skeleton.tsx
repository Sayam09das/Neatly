import { Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { customerShellCopy, customerSurfaceCopy } from "@/config/customer";

export function ServiceDetailsSkeleton(): ReactElement {
  return (
    <article
      aria-busy="true"
      aria-labelledby="customer-service-heading"
      aria-live="polite"
      className="w-full min-w-0"
      data-slot="customer-service-loading"
      role="status"
    >
      <p className="sr-only">{customerShellCopy.loadingLabel}</p>
      <Skeleton className="h-4 w-48 max-w-full" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <div>
          <h1
            className="text-h1 text-foreground tracking-tight"
            id="customer-service-heading"
          >
            {customerSurfaceCopy.serviceDetail.heading}
          </h1>
          <div className="mt-4 max-w-prose space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 max-w-full" />
          </div>
          <Skeleton className="mt-8 h-11 w-40" />
        </div>
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      </div>
      <div className="mt-16 max-w-prose space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 max-w-full" />
      </div>
    </article>
  );
}
