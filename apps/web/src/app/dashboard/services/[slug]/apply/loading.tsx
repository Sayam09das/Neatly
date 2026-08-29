import type { ReactElement } from "react";
import { CustomerLoadingState } from "@/components/customer/customer-states";

export default function CustomerDashboardServiceApplyLoading(): ReactElement {
  return <CustomerLoadingState variant="detail" />;
}
