import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { CUSTOMER_PATHS, customerDashboardCopy } from "@/config/customer";

export function DashboardEmpty(): ReactElement {
  return (
    <section className="max-w-prose rounded-xl border border-border p-6">
      <h2 className="text-h2 text-foreground tracking-tight">
        {customerDashboardCopy.emptyHeading}
      </h2>
      <p className="mt-3 text-body text-foreground">
        {customerDashboardCopy.emptyTitle}
      </p>
      <p className="mt-2 text-body text-muted-foreground">
        {customerDashboardCopy.emptyDescription}
      </p>
      <p className="mt-6">
        <Button asChild>
          <Link href={CUSTOMER_PATHS.dashboardServices}>
            {customerDashboardCopy.emptyAction}
          </Link>
        </Button>
      </p>
    </section>
  );
}
