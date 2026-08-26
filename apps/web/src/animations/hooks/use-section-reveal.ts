"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { createSectionReveal } from "@/animations/gsap/section-reveal";
import { useGsap } from "@/animations/hooks/use-gsap";

interface UseSectionRevealOptions {
  rootRef: RefObject<HTMLElement | null>;
  selector?: string;
}

export function useSectionReveal({
  rootRef,
  selector,
}: UseSectionRevealOptions): void {
  useGsap(
    () => {
      const root = rootRef.current;

      if (root === null) {
        return;
      }

      createSectionReveal(root, { selector });
      ScrollTrigger.refresh();
    },
    {
      revertOnUpdate: true,
      scope: rootRef,
    },
  );
}
