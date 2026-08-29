import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerSurface } from "@/components/customer/customer-surface";
import { customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  title: customerSurfaceCopy.bookings.title,
};

export default function CustomerBookingsPage(): ReactElement {
  return (
    <CustomerSurface
      description={customerSurfaceCopy.bookings.description}
      heading={customerSurfaceCopy.bookings.heading}
    />
  );
}
