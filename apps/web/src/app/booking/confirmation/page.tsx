import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import { CustomerSurface } from "@/components/customer/customer-surface";
import { customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: customerSurfaceCopy.bookingConfirmation.title,
};

export default function BookingConfirmationPage(): ReactElement {
  return (
    <CustomerPublicFrame>
      <CustomerSurface
        description={customerSurfaceCopy.bookingConfirmation.description}
        heading={customerSurfaceCopy.bookingConfirmation.heading}
      />
    </CustomerPublicFrame>
  );
}
