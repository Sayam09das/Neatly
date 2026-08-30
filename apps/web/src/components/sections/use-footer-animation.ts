"use client";

import { type RefObject, useEffect, useState } from "react";
import { useGsap } from "@/animations/hooks/use-gsap";
import { createFooterAnimation, FOOTER_MOBILE_QUERY } from "./footer-animation";

interface UseFooterAnimationOptions {
  rootRef: RefObject<HTMLElement | null>;
}

export function useFooterAnimation({
  rootRef,
}: UseFooterAnimationOptions): void {
  const [isCompact, setIsCompact] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect((): void => {
    setIsReady(true);
  }, []);

  useEffect((): (() => void) => {
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
      if (!isReady) {
        return;
      }

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
      dependencies: [isCompact, isReady],
      revertOnUpdate: true,
      scope: rootRef,
    },
  );
}
