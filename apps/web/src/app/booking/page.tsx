import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import { CustomerSurface } from "@/components/customer/customer-surface";
import { customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  title: customerSurfaceCopy.booking.title,
};

export default function BookingPage(): ReactElement {
  return (
    <CustomerPublicFrame>
      <CustomerSurface
        description={customerSurfaceCopy.booking.description}
        heading={customerSurfaceCopy.booking.heading}
      />
    </CustomerPublicFrame>
  );
}
