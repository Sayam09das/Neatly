"use client";

import gsap from "gsap";
import Lenis from "lenis";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import "lenis/dist/lenis.css";
import type { ReactNode } from "react";

const LENIS_SMOOTH_DURATION_SECONDS = 1.2;
const LENIS_WHEEL_MULTIPLIER = 1;
const LENIS_TOUCH_MULTIPLIER = 1.5;
const GSAP_TICKER_LAG_SMOOTHING_MS = 500;
const GSAP_TICKER_LAG_SMOOTHING_FRAME_MS = 33;

function lenisEaseOutExpo(time: number): number {
  return Math.min(1, 1.001 - 2 ** (-10 * time));
}

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function hasLenisPreventAttribute(node: HTMLElement): boolean {
  return node.hasAttribute("data-lenis-prevent");
}

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect((): (() => void) | undefined => {
    if (prefersReducedMotion || lenisInstance !== null) {
      return undefined;
    }

    const lenis = new Lenis({
      anchors: true,
      autoRaf: false,
      duration: LENIS_SMOOTH_DURATION_SECONDS,
      easing: lenisEaseOutExpo,
      gestureOrientation: "vertical",
      orientation: "vertical",
      prevent: hasLenisPreventAttribute,
      respectReducedMotion: true,
      smoothWheel: true,
      touchMultiplier: LENIS_TOUCH_MULTIPLIER,
      wheelMultiplier: LENIS_WHEEL_MULTIPLIER,
    });

    lenisInstance = lenis;

    const updateRaf = (time: number): void => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    return (): void => {
      gsap.ticker.remove(updateRaf);
      gsap.ticker.lagSmoothing(
        GSAP_TICKER_LAG_SMOOTHING_MS,
        GSAP_TICKER_LAG_SMOOTHING_FRAME_MS,
      );
      lenis.destroy();
      if (lenisInstance === lenis) {
        lenisInstance = null;
      }
    };
  }, [prefersReducedMotion]);

  return children;
}
