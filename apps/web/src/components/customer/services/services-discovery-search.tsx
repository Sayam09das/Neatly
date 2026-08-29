import { Button, Input, Label } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import {
  CUSTOMER_PATHS,
  CUSTOMER_SERVICES_SEARCH_INPUT_ID,
  CUSTOMER_SERVICES_SEARCH_MAX_LENGTH,
  CUSTOMER_SERVICES_SEARCH_PARAM,
  customerServicesCopy,
} from "@/config/customer";
import type { CustomerServicesQuery } from "@/lib/customer/catalog";

interface ServicesDiscoverySearchProps {
  catalogHref?: string;
  query: CustomerServicesQuery;
}

export function ServicesDiscoverySearch({
  catalogHref = CUSTOMER_PATHS.services,
  query,
}: ServicesDiscoverySearchProps): ReactElement {
  return (
    <search className="mt-8">
      <form
        action={catalogHref}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        method="get"
      >
        <div className="min-w-0 flex-1">
          <Label htmlFor={CUSTOMER_SERVICES_SEARCH_INPUT_ID}>
            {customerServicesCopy.searchLabel}
          </Label>
          <Input
            autoComplete="off"
            className="mt-2"
            defaultValue={query.q}
            id={CUSTOMER_SERVICES_SEARCH_INPUT_ID}
            maxLength={CUSTOMER_SERVICES_SEARCH_MAX_LENGTH}
            name={CUSTOMER_SERVICES_SEARCH_PARAM}
            placeholder={customerServicesCopy.searchPlaceholder}
            type="search"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit">{customerServicesCopy.searchSubmit}</Button>
          {query.q === "" ? null : (
            <Link
              className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              href={catalogHref}
            >
              {customerServicesCopy.searchClear}
            </Link>
          )}
        </div>
      </form>
    </search>
  );
}
