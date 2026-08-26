"use client";

import { type ReactElement, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import {
  COUNT_UP_DURATION_MS,
  COUNT_UP_THRESHOLD,
  formatCountFigure,
  playCountUp,
} from "./count-up";

interface CountUpFigureProps {
  pendingSrLabel?: string;
  pendingValue: string;
  suffix: string;
  value: number | null;
}

export function CountUpFigure({
  pendingSrLabel,
  pendingValue,
  suffix,
  value,
}: CountUpFigureProps): ReactElement {
  const rootRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(
    value === null ? pendingValue : formatCountFigure(0, suffix),
  );

  useEffect((): (() => void) | undefined => {
    if (value === null) {
      setDisplay(pendingValue);
      return undefined;
    }

    if (prefersReducedMotion) {
      setDisplay(formatCountFigure(value, suffix));
      return undefined;
    }

    const root = rootRef.current;

    if (root === null) {
      return undefined;
    }

    let played = false;
    let playback: ReturnType<typeof playCountUp> | null = null;

    const play = (): void => {
      if (played) {
        return;
      }

      played = true;
      playback = playCountUp({
        durationMs: COUNT_UP_DURATION_MS,
        from: 0,
        onUpdate: (next): void => {
          setDisplay(formatCountFigure(next, suffix));
        },
        to: value,
      });
    };

    const observer = new IntersectionObserver(
      (entries): void => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
          observer.disconnect();
        }
      },
      { threshold: COUNT_UP_THRESHOLD },
    );

    observer.observe(root);

    return (): void => {
      observer.disconnect();
      playback?.pause();
    };
  }, [pendingValue, prefersReducedMotion, suffix, value]);

  return (
    <span ref={rootRef}>
      <span aria-hidden={value === null}>{display}</span>
      {value === null && pendingSrLabel !== undefined ? (
        <span className="sr-only">{pendingSrLabel}</span>
      ) : null}
    </span>
  );
}
