import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { BookingsLoading } from "@/components/admin/bookings/bookings-states";
import { adminBookingCopy } from "@/config/admin-bookings";

export default function AdminBookingsLoading(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page space-y-8">
      <div className="max-w-prose space-y-3">
        <h1 className="text-h1 text-foreground tracking-tight">
          {adminBookingCopy.heading}
        </h1>
        <p className="text-body text-muted-foreground">
          {adminBookingCopy.description}
        </p>
      </div>
      <Card className="p-6 shadow-none">
        <BookingsLoading />
      </Card>
    </div>
  );
}
