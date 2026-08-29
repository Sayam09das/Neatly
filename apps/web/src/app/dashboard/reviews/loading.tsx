import type { ReactElement } from "react";
import { CustomerLoadingState } from "@/components/customer/customer-states";

export default function CustomerReviewsLoading(): ReactElement {
  return <CustomerLoadingState variant="list" />;
}
