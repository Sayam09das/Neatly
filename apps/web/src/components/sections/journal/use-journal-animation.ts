"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useState } from "react";
import { useGsap } from "@/animations/hooks/use-gsap";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import {
  createJournalAnimation,
  JOURNAL_MOBILE_QUERY,
} from "./journal-animation";

interface UseJournalAnimationOptions {
  rootRef: RefObject<HTMLElement | null>;
}

export function useJournalAnimation({
  rootRef,
}: UseJournalAnimationOptions): void {
  const [isCompact, setIsCompact] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(JOURNAL_MOBILE_QUERY);
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

      createJournalAnimation(root, {
        compact: isCompact,
        enableClipPath: !isCompact,
        enableParallax: !isCompact,
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
      dependencies: [isCompact],
      revertOnUpdate: true,
      scope: rootRef,
    },
  );
}
