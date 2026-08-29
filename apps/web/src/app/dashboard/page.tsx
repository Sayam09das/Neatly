import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerSurface } from "@/components/customer/customer-surface";
import { customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  title: customerSurfaceCopy.dashboard.title,
};

export default function CustomerDashboardPage(): ReactElement {
  return (
    <CustomerSurface
      description={customerSurfaceCopy.dashboard.description}
      heading={customerSurfaceCopy.dashboard.heading}
    />
  );
}
