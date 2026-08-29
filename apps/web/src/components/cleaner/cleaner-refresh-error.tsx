"use client";

import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { CleanerErrorState } from "@/components/cleaner/cleaner-states";

export function CleanerRefreshErrorState(): ReactElement {
  const router = useRouter();

  return (
    <CleanerErrorState
      onRetry={(): void => {
        router.refresh();
      }}
    />
  );
}
