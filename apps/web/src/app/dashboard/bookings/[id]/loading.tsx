import type { ReactElement } from "react";
import { CustomerLoadingState } from "@/components/customer/customer-states";

export default function CustomerBookingDetailLoading(): ReactElement {
  return <CustomerLoadingState variant="detail" />;
}
