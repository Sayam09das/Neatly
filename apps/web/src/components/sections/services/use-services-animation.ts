"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useState } from "react";
import { useGsap } from "@/animations/hooks/use-gsap";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import {
  createServicesAnimation,
  SERVICES_MOBILE_QUERY,
} from "./services-animation";

interface UseServicesAnimationOptions {
  rootRef: RefObject<HTMLElement | null>;
}

export function useServicesAnimation({
  rootRef,
}: UseServicesAnimationOptions): void {
  const [isCompact, setIsCompact] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(SERVICES_MOBILE_QUERY);
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

      createServicesAnimation(root, {
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
