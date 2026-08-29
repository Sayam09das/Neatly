import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerSurface } from "@/components/customer/customer-surface";
import { customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  title: customerSurfaceCopy.settings.title,
};

export default function CustomerSettingsPage(): ReactElement {
  return (
    <CustomerSurface
      description={customerSurfaceCopy.settings.description}
      heading={customerSurfaceCopy.settings.heading}
    />
  );
}
