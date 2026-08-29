import type { ReactElement } from "react";
import { ServicesDiscoverySkeleton } from "@/components/customer/services/services-discovery-skeleton";

export default function CustomerDashboardServicesLoading(): ReactElement {
  return <ServicesDiscoverySkeleton />;
}
