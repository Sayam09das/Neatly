"use client";

import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { CustomerErrorState } from "@/components/customer/customer-states";

export function CustomerRefreshErrorState(): ReactElement {
  const router = useRouter();

  return (
    <CustomerErrorState
      onRetry={(): void => {
        router.refresh();
      }}
    />
  );
}
