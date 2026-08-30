"use client";

import { Badge } from "@neatly/ui";
import type { ReactElement } from "react";
import { adminCleanerCopy } from "@/config/admin-cleaners";

interface CleanerStatusBadgeProps {
  label: string | null;
}

export function CleanerStatusBadge({
  label,
}: CleanerStatusBadgeProps): ReactElement {
  if (label === null || label.trim() === "") {
    return (
      <span data-slot="cleaner-status-badge">
        {adminCleanerCopy.emptyValue}
      </span>
    );
  }

  return (
    <Badge
      className="normal-case tracking-normal border-border bg-background text-foreground"
      data-slot="cleaner-status-badge"
      variant="outline"
    >
      {label}
    </Badge>
  );
}
