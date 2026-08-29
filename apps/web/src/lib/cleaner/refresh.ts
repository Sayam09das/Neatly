"use client";

import { useRouter } from "next/navigation";

export function useCleanerRefresh(): () => void {
  const router = useRouter();

  return (): void => {
    router.refresh();
  };
}
