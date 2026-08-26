"use client";

import gsap from "gsap";
import { type ReactElement, useEffect, useRef } from "react";
import { easings } from "@/animations/config/easings";
import { useGsap } from "@/animations/hooks/use-gsap";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import {
  ACCENT_STROKE_DURATION_MS,
  ACCENT_STROKE_PATH,
  ACCENT_STROKE_THRESHOLD,
  ACCENT_STROKE_VIEWBOX,
  prepareAccentPath,
  revealAccentPath,
} from "./accent-stroke";

interface HeadingAccentProps {
  className?: string;
}

export function HeadingAccent({ className }: HeadingAccentProps): ReactElement {
  const rootRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect((): void => {
    const path = pathRef.current;

    if (path === null || !prefersReducedMotion) {
      return;
    }

    revealAccentPath(path);
  }, [prefersReducedMotion]);

  useGsap(
    () => {
      const path = pathRef.current;

      if (path === null) {
        return;
      }

      const length = prepareAccentPath(path);

      if (length === 0) {
        revealAccentPath(path);
        return;
      }

      gsap.set(path, { strokeDashoffset: length });

      const tween = gsap.to(path, {
        duration: ACCENT_STROKE_DURATION_MS / 1000,
        ease: easings.enter.gsap,
        paused: true,
        strokeDashoffset: 0,
      });

      const observer = new IntersectionObserver(
        (entries): void => {
          if (entries.some((entry) => entry.isIntersecting)) {
            tween.play();
            observer.disconnect();
          }
        },
        { threshold: ACCENT_STROKE_THRESHOLD },
      );

      observer.observe(path);

      return (): void => {
        observer.disconnect();
        tween.kill();
      };
    },
    {
      dependencies: [],
      scope: rootRef,
    },
  );

  return (
    <span aria-hidden="true" className={className} ref={rootRef}>
      <svg
        aria-hidden="true"
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox={ACCENT_STROKE_VIEWBOX}
      >
        <path
          d={ACCENT_STROKE_PATH}
          ref={pathRef}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
    </span>
  );
}
