"use client";

import { Button } from "@neatly/ui";
import type { ReactElement } from "react";
import { customerDashboardCopy } from "@/config/customer";
import { useCustomerRefresh } from "@/lib/customer/refresh";

export function DashboardLoadError(): ReactElement {
  const refresh = useCustomerRefresh();

  return (
    <div className="max-w-prose" role="alert">
      <h1 className="text-h1 text-foreground tracking-tight">
        {customerDashboardCopy.loadErrorHeading}
      </h1>
      <p className="mt-4 text-body text-muted-foreground">
        {customerDashboardCopy.loadErrorDescription}
      </p>
      <Button className="mt-8" onClick={refresh} type="button">
        {customerDashboardCopy.loadErrorAction}
      </Button>
    </div>
  );
}
