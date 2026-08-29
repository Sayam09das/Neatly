"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { handleAdminApiFailure } from "@/lib/admin/session";
import type { AdminApiFailure, AdminApiResult } from "@/lib/api/admin-request";

export type AdminQueryStatus = "loading" | "success" | "error";

export interface AdminQueryState<T> {
  data: T | null;
  error: AdminApiFailure | null;
  retry: () => void;
  status: AdminQueryStatus;
}

export function useAdminQuery<T>(input: {
  enabled: boolean;
  request: (signal: AbortSignal) => Promise<AdminApiResult<T>>;
  requestKey: string;
}): AdminQueryState<T> {
  const [generation, setGeneration] = useState(0);
  const [state, setState] = useState<Omit<AdminQueryState<T>, "retry">>({
    data: null,
    error: null,
    status: input.enabled ? "loading" : "success",
  });

  const requestRef = useRef(input.request);
  requestRef.current = input.request;

  const retry = useCallback((): void => {
    setGeneration((current) => current + 1);
  }, []);

  const enabled = input.enabled;
  const requestKey = input.requestKey;

  useEffect((): (() => void) | undefined => {
    if (!enabled) {
      return undefined;
    }

    void requestKey;
    void generation;

    const controller = new AbortController();
    let cancelled = false;

    setState({
      data: null,
      error: null,
      status: "loading",
    });

    void requestRef
      .current(controller.signal)
      .then((result): void => {
        if (cancelled || controller.signal.aborted) {
          return;
        }

        if (!result.ok) {
          handleAdminApiFailure(result);
          setState({
            data: null,
            error: result,
            status: "error",
          });
          return;
        }

        setState({
          data: result.data,
          error: null,
          status: "success",
        });
      })
      .catch((error: unknown): void => {
        if (cancelled || controller.signal.aborted) {
          return;
        }

        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setState({
          data: null,
          error: {
            code: "INTERNAL_ERROR",
            fields: {},
            forbidden: false,
            message: "Unable to complete this request. Please try again.",
            ok: false,
            status: 500,
            unauthorized: false,
          },
          status: "error",
        });
      });

    return (): void => {
      cancelled = true;
      controller.abort();
    };
  }, [enabled, generation, requestKey]);

  return {
    ...state,
    retry,
  };
}
