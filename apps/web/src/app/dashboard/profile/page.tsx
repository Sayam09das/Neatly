import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerSurface } from "@/components/customer/customer-surface";
import { customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  title: customerSurfaceCopy.profile.title,
};

export default function CustomerProfilePage(): ReactElement {
  return (
    <CustomerSurface
      description={customerSurfaceCopy.profile.description}
      heading={customerSurfaceCopy.profile.heading}
    />
  );
}
