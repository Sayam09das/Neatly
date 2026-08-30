"use client";

import { Badge } from "@neatly/ui";
import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { adminPortfolioCopy } from "@/config/admin-portfolio";

interface PortfolioStatusBadgeProps {
  isPublished: boolean;
}

export function PortfolioStatusBadge({
  isPublished,
}: PortfolioStatusBadgeProps): ReactElement {
  return (
    <Badge
      className={cn(
        "normal-case tracking-normal",
        isPublished
          ? "border-transparent bg-secondary text-secondary-foreground"
          : "border-border bg-background text-muted-foreground",
      )}
      data-slot="portfolio-status-badge"
      variant="outline"
    >
      {isPublished
        ? adminPortfolioCopy.visibilityPublished
        : adminPortfolioCopy.visibilityUnpublished}
    </Badge>
  );
}
