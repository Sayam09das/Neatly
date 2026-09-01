import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { CustomerEmptyState } from "@/components/customer/customer-states";
import { ServicesDiscoveryCard } from "@/components/customer/services/services-discovery-card";
import { ServicesDiscoveryPagination } from "@/components/customer/services/services-discovery-pagination";
import { ServicesDiscoverySearch } from "@/components/customer/services/services-discovery-search";
import {
  CUSTOMER_PATHS,
  CUSTOMER_SERVICES_PAGE_PARAM,
  CUSTOMER_SERVICES_SEARCH_PARAM,
  customerCatalogErrorCopy,
  customerEmptyCopy,
  customerServicesCopy,
  customerSurfaceCopy,
} from "@/config/customer";
import type { CustomerServicesQuery } from "@/lib/customer/catalog";
import type { CustomerServiceList } from "@/types/customer";

interface ServicesDiscoveryProps {
  catalogHref?: string;
  list: CustomerServiceList | null;
  query: CustomerServicesQuery;
  status: "error" | "success";
}

export function ServicesDiscovery({
  catalogHref = CUSTOMER_PATHS.services,
  list,
  query,
  status,
}: ServicesDiscoveryProps): ReactElement {
  return (
    <section
      aria-labelledby="customer-services-heading"
      className="w-full min-w-0"
      data-slot="customer-services"
    >
      <h1
        className="text-h1 text-foreground tracking-tight"
        id="customer-services-heading"
      >
        {customerSurfaceCopy.services.heading}
      </h1>
      <p className="mt-4 max-w-prose text-body text-muted-foreground">
        {customerSurfaceCopy.services.description}
      </p>
      <ServicesDiscoverySearch catalogHref={catalogHref} query={query} />
      {status === "error" ? (
        <ServicesDiscoveryError catalogHref={catalogHref} query={query} />
      ) : (
        <ServicesDiscoveryResults
          catalogHref={catalogHref}
          list={list}
          query={query}
        />
      )}
    </section>
  );
}

interface ServicesDiscoveryErrorProps {
  catalogHref: string;
  query: CustomerServicesQuery;
}

function ServicesDiscoveryError({
  catalogHref,
  query,
}: ServicesDiscoveryErrorProps): ReactElement {
  return (
    <div className="mt-10 max-w-prose" data-slot="customer-error" role="alert">
      <h2 className="text-h3 text-foreground tracking-tight">
        {customerCatalogErrorCopy.heading}
      </h2>
      <p className="mt-2 text-body text-muted-foreground">
        {customerCatalogErrorCopy.description}
      </p>
      <form action={catalogHref} className="mt-8" method="get">
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
        <Button type="submit" variant="link">
          {customerCatalogErrorCopy.action}
        </Button>
      </form>
    </div>
  );
}

interface ServicesDiscoveryResultsProps {
  catalogHref: string;
  list: CustomerServiceList | null;
  query: CustomerServicesQuery;
}

function ServicesDiscoveryResults({
  catalogHref,
  list,
  query,
}: ServicesDiscoveryResultsProps): ReactElement {
  if (list === null || list.services.length === 0) {
    return <ServicesDiscoveryEmpty catalogHref={catalogHref} query={query} />;
  }

  return (
    <>
      <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.services.map((service, index) => (
          <li key={service.id}>
            <ServicesDiscoveryCard priority={index === 0} service={service} />
          </li>
        ))}
      </ul>
      <ServicesDiscoveryPagination
        catalogHref={catalogHref}
        pagination={list.pagination}
        query={query}
      />
    </>
  );
}

interface ServicesDiscoveryEmptyProps {
  catalogHref: string;
  query: CustomerServicesQuery;
}

function ServicesDiscoveryEmpty({
  catalogHref,
  query,
}: ServicesDiscoveryEmptyProps): ReactElement {
  const isSearchEmpty = query.q !== "";
  const copy = isSearchEmpty
    ? customerEmptyCopy.serviceSearch
    : customerEmptyCopy.services;

  return (
    <div className="mt-10">
      <CustomerEmptyState description={copy.description} title={copy.title} />
      {isSearchEmpty ? (
        <p className="mt-8">
          <Link
            className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            href={catalogHref}
          >
            {customerServicesCopy.browseAll}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
