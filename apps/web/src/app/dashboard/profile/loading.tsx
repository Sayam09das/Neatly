import type { ReactElement } from "react";
import { CustomerLoadingState } from "@/components/customer/customer-states";

export default function CustomerProfileLoading(): ReactElement {
  return <CustomerLoadingState variant="detail" />;
}
