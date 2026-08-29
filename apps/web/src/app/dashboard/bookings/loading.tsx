import type { ReactElement } from "react";
import { CustomerLoadingState } from "@/components/customer/customer-states";

export default function CustomerBookingsLoading(): ReactElement {
  return <CustomerLoadingState variant="list" />;
}
