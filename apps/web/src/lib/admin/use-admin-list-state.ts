"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useAdminListState<T extends { [K in keyof T]: string }>(input: {
  defaults: T;
}): {
  filters: T;
  page: number;
  setFilters: (filters: T) => void;
  setPage: (page: number) => void;
} {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();

  const filters = useMemo((): T => {
    const next = { ...input.defaults };

    for (const key of Object.keys(input.defaults) as (keyof T)[]) {
      const value = searchParams?.get(String(key));
      if (value !== null) {
        next[key] = value as T[keyof T];
      }
    }

    return next;
  }, [input.defaults, searchParams]);

  const page = useMemo((): number => {
    const raw = searchParams?.get("page");
    const parsed = raw === null ? 1 : Number(raw);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  }, [searchParams]);

  const replace = useCallback(
    (nextFilters: T, nextPage: number): void => {
      const params = new URLSearchParams();

      for (const key of Object.keys(nextFilters) as (keyof T)[]) {
        const value = nextFilters[key];
        if (value !== input.defaults[key] && value !== "") {
          params.set(String(key), value);
        }
      }

      if (nextPage > 1) {
        params.set("page", String(nextPage));
      }

      const query = params.toString();
      router.replace(query === "" ? pathname : `${pathname}?${query}`, {
        scroll: false,
      });
    },
    [input.defaults, pathname, router],
  );

  return {
    filters,
    page,
    setFilters: (next): void => {
      replace(next, 1);
    },
    setPage: (nextPage): void => {
      replace(filters, nextPage);
    },
  };
}
