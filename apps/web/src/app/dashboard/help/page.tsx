import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerSurface } from "@/components/customer/customer-surface";
import { customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  title: customerSurfaceCopy.help.title,
};

export default function CustomerHelpPage(): ReactElement {
  return (
    <CustomerSurface
      description={customerSurfaceCopy.help.description}
      heading={customerSurfaceCopy.help.heading}
    />
  );
}
