import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { customerBookingStatusLabels } from "@/config/customer";
import type { CustomerBookingStatus } from "@/types/customer";

interface BookingStatusBadgeProps {
  status: CustomerBookingStatus;
}

export function BookingStatusBadge({
  status,
}: BookingStatusBadgeProps): ReactElement {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full px-3 text-caption font-medium",
        status === "CANCELLED"
          ? "bg-muted text-muted-foreground"
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {customerBookingStatusLabels[status]}
    </span>
  );
}
