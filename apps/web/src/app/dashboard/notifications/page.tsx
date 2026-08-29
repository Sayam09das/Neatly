import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CustomerSurface } from "@/components/customer/customer-surface";
import { customerSurfaceCopy } from "@/config/customer";

export const metadata: Metadata = {
  title: customerSurfaceCopy.notifications.title,
};

export default function CustomerNotificationsPage(): ReactElement {
  return (
    <CustomerSurface
      description={customerSurfaceCopy.notifications.description}
      heading={customerSurfaceCopy.notifications.heading}
    />
  );
}
