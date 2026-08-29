import type { ReactElement } from "react";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import { ServiceDetailsSkeleton } from "@/components/customer/services/service-details-skeleton";

export default function BookingConfirmationLoading(): ReactElement {
  return (
    <CustomerPublicFrame>
      <ServiceDetailsSkeleton />
    </CustomerPublicFrame>
  );
}
