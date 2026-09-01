import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import {
  CUSTOMER_PATHS,
  customerCatalogErrorCopy,
  customerServicePath,
  customerServicesCopy,
  customerSurfaceCopy,
} from "@/config/customer";

interface ServiceDetailsErrorProps {
  slug: string;
}

export function ServiceDetailsError({
  slug,
}: ServiceDetailsErrorProps): ReactElement {
  return (
    <section className="max-w-prose" data-slot="customer-service-error">
      <h1 className="text-h1 text-foreground tracking-tight">
        {customerSurfaceCopy.serviceDetail.heading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {customerCatalogErrorCopy.description}
      </p>
      <p className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button asChild>
          <Link href={customerServicePath(slug)}>
            {customerCatalogErrorCopy.action}
          </Link>
        </Button>
        <Link
          className="inline-flex min-h-touch items-center text-button text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={CUSTOMER_PATHS.services}
        >
          {customerServicesCopy.backToServices}
        </Link>
      </p>
    </section>
  );
}
