"use client";

import { Badge } from "@neatly/ui";
import type { ReactElement } from "react";
import { adminCustomerCopy } from "@/config/admin-customers";

interface CustomerStatusBadgeProps {
  label: string | null;
}

export function CustomerStatusBadge({
  label,
}: CustomerStatusBadgeProps): ReactElement {
  if (label === null || label.trim() === "") {
    return (
      <span data-slot="customer-status-badge">
        {adminCustomerCopy.emptyValue}
      </span>
    );
  }

  return (
    <Badge
      className="normal-case tracking-normal border-border bg-background text-foreground"
      data-slot="customer-status-badge"
      variant="outline"
    >
      {label}
    </Badge>
  );
}
