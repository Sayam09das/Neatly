import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import { CustomerSurface } from "@/components/customer/customer-surface";
import { customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  title: customerSurfaceCopy.quote.title,
};

export default function QuotePage(): ReactElement {
  return (
    <CustomerPublicFrame>
      <CustomerSurface
        description={customerSurfaceCopy.quote.description}
        heading={customerSurfaceCopy.quote.heading}
      />
    </CustomerPublicFrame>
  );
}
