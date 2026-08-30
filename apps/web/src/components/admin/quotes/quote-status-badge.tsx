"use client";

import { Badge } from "@neatly/ui";
import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { adminQuoteStatusLabels } from "@/config/admin-quotes";
import type { AdminQuoteStatus } from "@/types/admin-quote";

const statusBadgeClassName: Record<AdminQuoteStatus, string> = {
  ACCEPTED: "border-transparent bg-secondary text-secondary-foreground",
  CLOSED: "border-border bg-background text-muted-foreground",
  CONTACTED: "border-transparent bg-secondary text-secondary-foreground",
  CONVERTED: "border-transparent bg-secondary text-secondary-foreground",
  DECLINED: "border-border bg-background text-muted-foreground",
  NEW: "border-border bg-background text-foreground",
  QUOTED: "border-transparent bg-primary/10 text-foreground",
  REVIEWING: "border-border bg-muted text-foreground",
};

interface QuoteStatusBadgeProps {
  status: AdminQuoteStatus;
}

export function QuoteStatusBadge({
  status,
}: QuoteStatusBadgeProps): ReactElement {
  return (
    <Badge
      className={cn(
        "normal-case tracking-normal",
        statusBadgeClassName[status],
      )}
      data-slot="quote-status-badge"
      variant="outline"
    >
      {adminQuoteStatusLabels[status]}
    </Badge>
  );
}
