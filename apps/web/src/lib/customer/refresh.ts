"use client";

import { useRouter } from "next/navigation";

export function useCustomerRefresh(): () => void {
  const router = useRouter();

  return (): void => {
    router.refresh();
  };
}
