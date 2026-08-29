import type { ReactElement } from "react";
import { CleanerLoadingState } from "@/components/cleaner/cleaner-states";

export default function CleanerJobsLoading(): ReactElement {
  return <CleanerLoadingState variant="list" />;
}
