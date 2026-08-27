"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useState } from "react";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";
import { useGsap } from "@/animations/hooks/use-gsap";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import {
  NEWSLETTER_IMAGE_SCALE_FROM,
  NEWSLETTER_MOBILE_QUERY,
  NEWSLETTER_PARALLAX_SCRUB,
  NEWSLETTER_PARALLAX_Y_PERCENT,
  NEWSLETTER_SCROLL_START,
} from "@/components/sections/newsletter/newsletter-animation";

interface UseClosingBandAnimationOptions {
  rootRef: RefObject<HTMLElement | null>;
}

export function useClosingBandAnimation({
  rootRef,
}: UseClosingBandAnimationOptions): void {
  const [isCompact, setIsCompact] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(NEWSLETTER_MOBILE_QUERY);
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

      const mediaLayer = root.querySelector<HTMLElement>(
        "[data-closing-band-media]",
      );
      const parallax = root.querySelector<HTMLElement>(
        "[data-closing-band-parallax]",
      );

      registerGsapPlugins(ScrollTrigger);

      if (mediaLayer !== null) {
        gsap.fromTo(
          mediaLayer,
          { force3D: true, scale: NEWSLETTER_IMAGE_SCALE_FROM },
          {
            ease: easings.enter.gsap,
            scale: 1,
            scrollTrigger: {
              fastScrollEnd: true,
              invalidateOnRefresh: true,
              start: NEWSLETTER_SCROLL_START,
              toggleActions: "play none none reverse",
              trigger: root,
            },
          },
        );
      }

      if (parallax !== null && !isCompact) {
        gsap.fromTo(
          parallax,
          { yPercent: -NEWSLETTER_PARALLAX_Y_PERCENT },
          {
            ease: "none",
            scrollTrigger: {
              end: "bottom top",
              invalidateOnRefresh: true,
              scrub: NEWSLETTER_PARALLAX_SCRUB,
              start: "top bottom",
              trigger: root,
            },
            yPercent: NEWSLETTER_PARALLAX_Y_PERCENT,
          },
        );
      }

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
