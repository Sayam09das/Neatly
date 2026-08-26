"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useState } from "react";
import { useGsap } from "@/animations/hooks/use-gsap";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import {
  createWhyNeatlyAnimation,
  WHY_MOBILE_QUERY,
} from "./why-neatly-animation";

interface UseBenefitCardAnimationOptions {
  rootRef: RefObject<HTMLElement | null>;
}

export function useBenefitCardAnimation({
  rootRef,
}: UseBenefitCardAnimationOptions): void {
  const [isCompact, setIsCompact] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(WHY_MOBILE_QUERY);
    const sync = (): void => {
      setIsCompact(media.matches);
    };

    sync();
    media.addEventListener("change", sync);

    return (): void => {
      media.removeEventListener("change", sync);
    };
  }, []);

  useGsap(
    () => {
      const root = rootRef.current;

      if (root === null) {
        return;
      }

      createWhyNeatlyAnimation(root, {
        compact: isCompact,
        enableParallax: !isCompact,
        enableScrollTrigger: true,
      });
      ScrollTrigger.refresh();
    },
    {
      dependencies: [isCompact],
      revertOnUpdate: true,
      scope: rootRef,
    },
  );
}
