import { Skeleton } from "@neatly/ui";
import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import { customerShellCopy } from "@/config/customer";
import { servicesPageCatalog, servicesPageHero } from "@/config/services-page";
import type { CustomerNavbarSession } from "@/lib/customer/navbar";

interface ServicesPageSkeletonProps {
  session?: CustomerNavbarSession | null;
}

export function ServicesPageSkeleton({
  session = null,
}: ServicesPageSkeletonProps): ReactElement {
  return (
    <>
      <Navbar session={session} />
      <main id="main-content">
        <section
          aria-busy="true"
          aria-labelledby={servicesPageHero.headingId}
          aria-live="polite"
          className="bg-background text-foreground"
          data-slot="services-page-loading"
          role="status"
        >
          <p className="sr-only">{customerShellCopy.loadingLabel}</p>
          <div className="mx-auto grid max-w-page items-center gap-12 px-gutter py-section lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Skeleton className="h-3 w-28" />
              <h1
                className="mt-4 text-display tracking-tight"
                id={servicesPageHero.headingId}
              >
                {servicesPageHero.heading}
              </h1>
              <div className="mt-6 max-w-xl space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5 max-w-full" />
              </div>
              <div className="mt-8 flex gap-3">
                <Skeleton className="h-11 w-40 rounded-full" />
                <Skeleton className="h-11 w-40 rounded-full" />
              </div>
            </div>
            <Skeleton className="aspect-[4/3] w-full rounded-xl lg:col-span-6" />
          </div>
        </section>
        <section
          aria-labelledby={servicesPageCatalog.headingId}
          className="relative overflow-x-hidden bg-secondary text-secondary-foreground"
        >
          <div className="mx-auto max-w-page px-gutter py-section">
            <div className="mx-auto max-w-2xl text-center">
              <Skeleton className="mx-auto h-3 w-28" />
              <h2
                className="mt-4 text-display tracking-tight"
                id={servicesPageCatalog.headingId}
              >
                {servicesPageCatalog.heading}
              </h2>
            </div>
            <ul className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <CatalogCardSkeleton />
              <CatalogCardSkeleton />
              <CatalogCardSkeleton />
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}

function CatalogCardSkeleton(): ReactElement {
  return (
    <li className="overflow-hidden rounded-xl border border-border bg-background">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-2/3 max-w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2 max-w-full" />
      </div>
    </li>
  );
}
