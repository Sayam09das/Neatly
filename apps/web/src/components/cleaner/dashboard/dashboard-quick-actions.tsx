import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { CLEANER_PATHS, cleanerDashboardCopy } from "@/config/cleaner";

export function DashboardQuickActions(): ReactElement {
  return (
    <nav aria-label={cleanerDashboardCopy.quickActionsHeading}>
      <h2 className="text-h2 text-foreground tracking-tight">
        {cleanerDashboardCopy.quickActionsHeading}
      </h2>
      <ul className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <li>
          <Button asChild>
            <Link href={CLEANER_PATHS.jobs}>
              {cleanerDashboardCopy.viewJobs}
            </Link>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
