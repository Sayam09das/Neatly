import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { CUSTOMER_PATHS, customerDashboardCopy } from "@/config/customer";

export function DashboardQuickActions(): ReactElement {
  return (
    <nav aria-label={customerDashboardCopy.quickActionsHeading}>
      <h2 className="text-h2 text-foreground tracking-tight">
        {customerDashboardCopy.quickActionsHeading}
      </h2>
      <ul className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <li>
          <Button asChild>
            <Link href={CUSTOMER_PATHS.booking}>
              {customerDashboardCopy.bookAction}
            </Link>
          </Button>
        </li>
        <li>
          <Button asChild variant="outline">
            <Link href={CUSTOMER_PATHS.quote}>
              {customerDashboardCopy.quoteAction}
            </Link>
          </Button>
        </li>
        <li>
          <Button asChild variant="ghost">
            <Link href={CUSTOMER_PATHS.dashboardServices}>
              {customerDashboardCopy.servicesAction}
            </Link>
          </Button>
        </li>
        <li>
          <Button asChild variant="ghost">
            <Link href={CUSTOMER_PATHS.help}>
              {customerDashboardCopy.helpAction}
            </Link>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
