"use client";

import { type RefObject, useState } from "react";
import { useGsap } from "@/animations/hooks/use-gsap";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { createFooterAnimation, FOOTER_MOBILE_QUERY } from "./footer-animation";

interface UseFooterAnimationOptions {
  rootRef: RefObject<HTMLElement | null>;
}

export function useFooterAnimation({
  rootRef,
}: UseFooterAnimationOptions): void {
  const [isCompact, setIsCompact] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(FOOTER_MOBILE_QUERY);
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

      createFooterAnimation(root, {
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
