"use client";

import { type RefObject, useState } from "react";
import { useGsap } from "@/animations/hooks/use-gsap";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { createTrustAnimation, TRUST_MOBILE_QUERY } from "./trust-animation";

interface UseTrustAnimationOptions {
  rootRef: RefObject<HTMLElement | null>;
}

export function useTrustAnimation({ rootRef }: UseTrustAnimationOptions): void {
  const [isCompact, setIsCompact] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(TRUST_MOBILE_QUERY);
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

      createTrustAnimation(root, {
        compact: isCompact,
        enableScrollTrigger: true,
      });
    },
    {
      dependencies: [isCompact],
      revertOnUpdate: true,
      scope: rootRef,
    },
  );
}
