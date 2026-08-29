import type { ReactElement } from "react";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import { ServiceDetailsSkeleton } from "@/components/customer/services/service-details-skeleton";

export default function ServiceDetailLoading(): ReactElement {
  return (
    <CustomerPublicFrame>
      <ServiceDetailsSkeleton />
    </CustomerPublicFrame>
  );
}
