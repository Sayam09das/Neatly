import type { ReactElement } from "react";
import { CleanerLoadingState } from "@/components/cleaner/cleaner-states";

export default function CleanerScheduleLoading(): ReactElement {
  return (
    <div className="space-y-8">
      <CleanerLoadingState variant="page" />
      <CleanerLoadingState variant="list" />
    </div>
  );
}
