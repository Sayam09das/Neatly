"use client";

import { useCallback, useState } from "react";
import { handleAdminApiFailure } from "@/lib/admin/session";
import type { AdminApiFailure, AdminApiResult } from "@/lib/api/admin-request";

export type AdminMutationStatus = "idle" | "submitting" | "error";

export interface AdminMutationState<T> {
  error: AdminApiFailure | null;
  reset: () => void;
  status: AdminMutationStatus;
  submit: (input: T) => Promise<AdminApiResult<unknown>>;
}

export function useAdminMutation<T, R>(
  request: (input: T) => Promise<AdminApiResult<R>>,
): AdminMutationState<T> {
  const [status, setStatus] = useState<AdminMutationStatus>("idle");
  const [error, setError] = useState<AdminApiFailure | null>(null);

  const reset = useCallback((): void => {
    setStatus("idle");
    setError(null);
  }, []);

  const submit = useCallback(
    async (input: T): Promise<AdminApiResult<R>> => {
      setStatus("submitting");
      setError(null);

      const result = await request(input);

      if (!result.ok) {
        handleAdminApiFailure(result);
        setError(result);
        setStatus("error");
        return result;
      }

      setStatus("idle");
      return result;
    },
    [request],
  );

  return {
    error,
    reset,
    status,
    submit,
  };
}
