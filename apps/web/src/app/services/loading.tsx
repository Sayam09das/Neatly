import type { ReactElement } from "react";
import { CustomerPublicFrame } from "@/components/customer/customer-public-frame";
import { ServicesDiscoverySkeleton } from "@/components/customer/services/services-discovery-skeleton";

export default function ServicesLoading(): ReactElement {
  return (
    <CustomerPublicFrame>
      <ServicesDiscoverySkeleton />
    </CustomerPublicFrame>
  );
}
