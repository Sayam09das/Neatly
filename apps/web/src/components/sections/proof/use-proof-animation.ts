"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useState } from "react";
import { useGsap } from "@/animations/hooks/use-gsap";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import {
  createProofAnimation,
  PROOF_MOBILE_QUERY,
  PROOF_STACKED_QUERY,
} from "./proof-animation";

interface UseProofAnimationOptions {
  rootRef: RefObject<HTMLElement | null>;
}

export function useProofAnimation({ rootRef }: UseProofAnimationOptions): void {
  const [isStacked, setIsStacked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const stackedMedia = window.matchMedia(PROOF_STACKED_QUERY);
    const mobileMedia = window.matchMedia(PROOF_MOBILE_QUERY);

    const sync = (): void => {
      setIsStacked(stackedMedia.matches);
      setIsMobile(mobileMedia.matches);
    };

    sync();
    stackedMedia.addEventListener("change", sync);
    mobileMedia.addEventListener("change", sync);

    return (): void => {
      stackedMedia.removeEventListener("change", sync);
      mobileMedia.removeEventListener("change", sync);
    };
  }, []);

  useGsap(
    () => {
      const root = rootRef.current;

      if (root === null) {
        return;
      }

      createProofAnimation(root, {
        compact: isStacked,
        enableActiveState: !isStacked,
        enableClipPath: !isMobile,
        enableParallax: !isStacked,
        enableScrollTrigger: true,
      });

      const images = Array.from(root.querySelectorAll("img"));
      const refresh = (): void => {
        ScrollTrigger.refresh();
      };

      for (const image of images) {
        if (!image.complete) {
          image.addEventListener("load", refresh);
        }
      }

      ScrollTrigger.refresh();

      return (): void => {
        for (const image of images) {
          image.removeEventListener("load", refresh);
        }
      };
    },
    {
      dependencies: [isMobile, isStacked],
      revertOnUpdate: true,
      scope: rootRef,
    },
  );
}
