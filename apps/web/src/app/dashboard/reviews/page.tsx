import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerSurface } from "@/components/customer/customer-surface";
import { customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  title: customerSurfaceCopy.reviews.title,
};

export default function CustomerReviewsPage(): ReactElement {
  return (
    <CustomerSurface
      description={customerSurfaceCopy.reviews.description}
      heading={customerSurfaceCopy.reviews.heading}
    />
  );
}
