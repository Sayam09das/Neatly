"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useState } from "react";
import { useGsap } from "@/animations/hooks/use-gsap";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";

export const ABOUT_MOBILE_QUERY = "(max-width: 767px)";

interface UseAboutSectionAnimationOptions {
  compactQuery?: string;
  create: (root: HTMLElement, options: { compact: boolean }) => void;
  rootRef: RefObject<HTMLElement | null>;
}

export function useAboutSectionAnimation({
  compactQuery = ABOUT_MOBILE_QUERY,
  create,
  rootRef,
}: UseAboutSectionAnimationOptions): void {
  const [isCompact, setIsCompact] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(compactQuery);
    const sync = (): void => {
      setIsCompact(media.matches);
    };

    sync();
    media.addEventListener("change", sync);

    return (): void => {
      media.removeEventListener("change", sync);
    };
  }, [compactQuery]);

  useGsap(
    () => {
      const root = rootRef.current;

      if (root === null) {
        return;
      }

      create(root, { compact: isCompact });

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
      dependencies: [create, isCompact],
      revertOnUpdate: true,
      scope: rootRef,
    },
  );
}
