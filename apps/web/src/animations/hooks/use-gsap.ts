"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";

export interface UseGsapOptions {
  dependencies?: Array<unknown>;
  revertOnUpdate?: boolean;
  scope?: RefObject<Element | null> | Element | string;
}

export function useGsap(
  setup: (context: ReturnType<typeof useGSAP>["context"]) => void,
  options: UseGsapOptions = {},
): ReturnType<typeof useGSAP> {
  const prefersReducedMotion = useReducedMotion();
  const { dependencies = [], revertOnUpdate, scope } = options;

  return useGSAP(
    (context) => {
      if (prefersReducedMotion) {
        return;
      }

      setup(context);
    },
    {
      dependencies: [...dependencies, prefersReducedMotion],
      revertOnUpdate,
      scope,
    },
  );
}
