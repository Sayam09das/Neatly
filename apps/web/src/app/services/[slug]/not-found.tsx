import Link from "next/link";
import type { ReactElement } from "react";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import { CUSTOMER_PATHS, customerSurfaceCopy } from "@/config/customer";

export default function ServiceNotFound(): ReactElement {
  return (
    <CustomerPublicFrame>
      <section className="max-w-prose">
        <h1 className="text-h1 text-foreground tracking-tight">
          {customerSurfaceCopy.serviceDetail.heading}
        </h1>
        <p className="mt-4 text-body text-muted-foreground">
          {customerSurfaceCopy.serviceDetail.description}
        </p>
        <p className="mt-8">
          <Link
            className="inline-flex min-h-touch items-center text-button text-primary underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            href={CUSTOMER_PATHS.services}
          >
            Back to services
          </Link>
        </p>
      </section>
    </CustomerPublicFrame>
  );
}
