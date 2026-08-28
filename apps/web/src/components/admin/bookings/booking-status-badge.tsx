"use client";

import { Badge } from "@neatly/ui";
import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { adminBookingStatusLabels } from "@/config/admin-bookings";
import type { AdminBookingStatus } from "@/types/admin-booking";

const statusBadgeClassName: Record<AdminBookingStatus, string> = {
  ASSIGNED: "border-border bg-muted text-foreground",
  CANCELLED: "border-border bg-background text-muted-foreground",
  COMPLETED: "border-transparent bg-secondary text-secondary-foreground",
  CONFIRMED: "border-transparent bg-secondary text-secondary-foreground",
  IN_PROGRESS: "border-transparent bg-primary/10 text-foreground",
  PENDING: "border-border bg-background text-foreground",
};

interface BookingStatusBadgeProps {
  status: AdminBookingStatus;
}

export function BookingStatusBadge({
  status,
}: BookingStatusBadgeProps): ReactElement {
  return (
    <Badge
      className={cn(
        "normal-case tracking-normal",
        statusBadgeClassName[status],
      )}
      data-slot="booking-status-badge"
      variant="outline"
    >
      {adminBookingStatusLabels[status]}
    </Badge>
  );
}
