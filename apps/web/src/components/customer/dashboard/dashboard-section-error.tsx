"use client";

import { Button } from "@neatly/ui";
import type { ReactElement } from "react";
import { customerDashboardCopy } from "@/config/customer";
import { useCustomerRefresh } from "@/lib/customer/refresh";

interface DashboardSectionErrorProps {
  message: string;
}

export function DashboardSectionError({
  message,
}: DashboardSectionErrorProps): ReactElement {
  const refresh = useCustomerRefresh();

  return (
    <div className="max-w-prose" role="alert">
      <p className="text-body text-muted-foreground">{message}</p>
      <Button
        className="mt-4"
        onClick={refresh}
        type="button"
        variant="outline"
      >
        {customerDashboardCopy.loadErrorAction}
      </Button>
    </div>
  );
}
