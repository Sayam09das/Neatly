import type { ReactElement } from "react";
import { CleanerLoadingState } from "@/components/cleaner/cleaner-states";

export default function CleanerSettingsLoading(): ReactElement {
  return <CleanerLoadingState variant="page" />;
}
