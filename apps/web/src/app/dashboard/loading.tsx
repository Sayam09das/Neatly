import type { ReactElement } from "react";
import { CustomerLoadingState } from "@/components/customer/customer-states";

export default function CustomerLoading(): ReactElement {
  return <CustomerLoadingState variant="page" />;
}
