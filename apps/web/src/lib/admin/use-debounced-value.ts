"use client";

import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect((): (() => void) => {
    const timeout = window.setTimeout((): void => {
      setDebounced(value);
    }, delayMs);

    return (): void => {
      window.clearTimeout(timeout);
    };
  }, [delayMs, value]);

  return debounced;
}
