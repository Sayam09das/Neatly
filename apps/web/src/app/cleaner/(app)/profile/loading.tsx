import type { ReactElement } from "react";
import { CleanerLoadingState } from "@/components/cleaner/cleaner-states";

export default function CleanerProfileLoading(): ReactElement {
  return <CleanerLoadingState variant="page" />;
}
