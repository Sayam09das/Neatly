import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { CUSTOMER_PATHS, customerDashboardCopy } from "@/config/customer";

export function DashboardServicesCta(): ReactElement {
  return (
    <section className="rounded-xl border border-border p-6">
      <h2 className="text-h2 text-foreground tracking-tight">
        {customerDashboardCopy.servicesCtaHeading}
      </h2>
      <p className="mt-3 max-w-prose text-body text-muted-foreground">
        {customerDashboardCopy.servicesCtaBody}
      </p>
      <p className="mt-6">
        <Button asChild>
          <Link href={CUSTOMER_PATHS.dashboardServices}>
            {customerDashboardCopy.servicesCtaAction}
          </Link>
        </Button>
      </p>
    </section>
  );
}
