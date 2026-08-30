import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { CUSTOMER_PATHS, customerDashboardCopy } from "@/config/customer";

interface DashboardAccountAlertProps {
  emailVerified: boolean | null;
}

export function DashboardAccountAlert({
  emailVerified,
}: DashboardAccountAlertProps): ReactElement | null {
  if (emailVerified !== false) {
    return null;
  }

  return (
    <section className="rounded-xl border border-border p-6" role="status">
      <h2 className="text-h3 text-foreground tracking-tight">
        {customerDashboardCopy.verificationHeading}
      </h2>
      <p className="mt-2 text-body text-muted-foreground">
        {customerDashboardCopy.verificationBody}
      </p>
      <p className="mt-4">
        <Button asChild variant="outline">
          <Link href={CUSTOMER_PATHS.settings}>
            {customerDashboardCopy.verificationAction}
          </Link>
        </Button>
      </p>
    </section>
  );
}
