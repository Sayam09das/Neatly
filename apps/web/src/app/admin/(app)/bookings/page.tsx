import type { Metadata } from "next";
import type { ReactElement } from "react";
import { AdminBookings } from "@/components/admin/bookings/admin-bookings";
import { adminBookingCopy } from "@/config/admin-bookings";

export const metadata: Metadata = {
  title: adminBookingCopy.title,
};

export default function AdminBookingsPage(): ReactElement {
  return <AdminBookings presentation={{ status: "empty" }} />;
}
