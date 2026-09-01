import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { CustomerEmptyState } from "@/components/customer/customer-states";
import { ServicesDiscoveryPagination } from "@/components/customer/services/services-discovery-pagination";
import { ServicesDiscoverySearch } from "@/components/customer/services/services-discovery-search";
import { BandCurve } from "@/components/sections/band-curve";
import { CatalogServiceCard } from "@/components/sections/catalog/catalog-service-card";
import {
  CUSTOMER_PATHS,
  CUSTOMER_SERVICES_PAGE_PARAM,
  CUSTOMER_SERVICES_SEARCH_PARAM,
  customerEmptyCopy,
  customerServicesCopy,
} from "@/config/customer";
import { landingServices } from "@/config/landing";
import {
  SERVICES_CATALOG_SECTION_ID,
  servicesPageCatalog,
  servicesPageEmpty,
  servicesPageError,
} from "@/config/services-page";
import type { CustomerServicesQuery } from "@/lib/customer/catalog";
import type { CustomerServiceList } from "@/types/customer";
import { ServicesCatalogScene } from "./services-catalog-scene";

interface ServicesCatalogSectionProps {
  list: CustomerServiceList | null;
  query: CustomerServicesQuery;
  status: "error" | "success";
}

export function ServicesCatalogSection({
  list,
  query,
  status,
}: ServicesCatalogSectionProps): ReactElement {
  return (
    <section
      aria-labelledby={servicesPageCatalog.headingId}
      className="relative scroll-mt-20 overflow-x-hidden bg-secondary text-secondary-foreground"
      id={SERVICES_CATALOG_SECTION_ID}
    >
      <BandCurve edges="top" />
      <div className="h-16 md:h-24 lg:h-28" />
      <ServicesCatalogScene>
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-label text-accent uppercase"
            data-catalog-header-item
          >
            {servicesPageCatalog.eyebrow}
          </p>
          <h2
            className="mt-4 text-display text-secondary-foreground tracking-tight"
            data-catalog-header-item
            id={servicesPageCatalog.headingId}
          >
            {landingServices.headingLead}{" "}
            <span className="text-accent">
              {landingServices.headingEmphasis}
            </span>
          </h2>
          <p
            className="mx-auto mt-6 max-w-xl text-body text-secondary-foreground/80"
            data-catalog-header-item
          >
            {servicesPageCatalog.description}
          </p>
          <div
            aria-hidden="true"
            className="mx-auto mt-8 h-px w-24 origin-left bg-accent/70"
            data-catalog-header-item
          />
        </div>
        <div
          className="mx-auto mt-10 max-w-xl text-secondary-foreground [&_[data-slot=label]]:text-secondary-foreground"
          data-catalog-header-item
        >
          <ServicesDiscoverySearch query={query} />
        </div>
        {status === "error" ? (
          <ServicesCatalogError query={query} />
        ) : (
          <ServicesCatalogResults list={list} query={query} />
        )}
      </ServicesCatalogScene>
      <div className="h-16 md:h-24 lg:h-28" />
    </section>
  );
}

interface ServicesCatalogErrorProps {
  query: CustomerServicesQuery;
}

function ServicesCatalogError({
  query,
}: ServicesCatalogErrorProps): ReactElement {
  return (
    <div
      className="mx-auto mt-12 max-w-prose text-center"
      data-slot="services-catalog-error"
      role="alert"
    >
      <h3 className="text-h3 text-secondary-foreground tracking-tight">
        {servicesPageError.heading}
      </h3>
      <p className="mt-2 text-body text-secondary-foreground/80">
        {servicesPageError.description}
      </p>
      <form action={CUSTOMER_PATHS.services} className="mt-8" method="get">
        {query.q === "" ? null : (
          <input
            name={CUSTOMER_SERVICES_SEARCH_PARAM}
            type="hidden"
            value={query.q}
          />
        )}
        {query.page > 1 ? (
          <input
            name={CUSTOMER_SERVICES_PAGE_PARAM}
            type="hidden"
            value={String(query.page)}
          />
        ) : null}
        <Button type="submit">{servicesPageError.action}</Button>
      </form>
    </div>
  );
}

interface ServicesCatalogResultsProps {
  list: CustomerServiceList | null;
  query: CustomerServicesQuery;
}

function ServicesCatalogResults({
  list,
  query,
}: ServicesCatalogResultsProps): ReactElement {
  if (list === null || list.services.length === 0) {
    return <ServicesCatalogEmpty query={query} />;
  }

  return (
    <>
      <ul className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {list.services.map((service, index) => (
          <li data-catalog-card key={service.id}>
            <CatalogServiceCard priority={index === 0} service={service} />
          </li>
        ))}
      </ul>
      <div className="text-secondary-foreground [&_[data-slot=customer-services-pagination]_p]:text-secondary-foreground/70 [&_[data-slot=customer-services-pagination]_span]:text-secondary-foreground/60">
        <ServicesDiscoveryPagination
          pagination={list.pagination}
          query={query}
        />
      </div>
    </>
  );
}

interface ServicesCatalogEmptyProps {
  query: CustomerServicesQuery;
}

function ServicesCatalogEmpty({
  query,
}: ServicesCatalogEmptyProps): ReactElement {
  const isSearchEmpty = query.q !== "";
  const copy = isSearchEmpty
    ? customerEmptyCopy.serviceSearch
    : servicesPageEmpty;

  return (
    <div className="mx-auto mt-12 max-w-prose text-center">
      <div className="[&_[data-slot=customer-empty]_h2]:text-secondary-foreground [&_[data-slot=customer-empty]_p]:text-secondary-foreground/80">
        <CustomerEmptyState description={copy.description} title={copy.title} />
      </div>
      {isSearchEmpty ? (
        <p className="mt-8">
          <Link
            className="inline-flex min-h-touch items-center text-button text-accent underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-accent-foreground"
            href={CUSTOMER_PATHS.services}
          >
            {customerServicesCopy.browseAll}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
