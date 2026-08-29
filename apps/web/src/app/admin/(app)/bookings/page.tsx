import type { Metadata } from "next";
import { type ReactElement, Suspense } from "react";
import { AdminBookings } from "@/components/admin/bookings/admin-bookings";
import { adminBookingCopy } from "@/config/admin-bookings";

export const metadata: Metadata = {
  title: adminBookingCopy.title,
};

export default function AdminBookingsPage(): ReactElement {
  return (
    <Suspense fallback={<AdminBookings presentation={{ status: "loading" }} />}>
      <AdminBookings />
    </Suspense>
  );
}
