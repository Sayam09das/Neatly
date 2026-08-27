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

    const playIfVisible = (): void => {
      const node = rootRef.current;

      if (node === null) {
        return;
      }

      const rect = node.getBoundingClientRect();
      const height = Math.max(rect.height, 1);
      const visible =
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

      if (visible / height >= COUNT_UP_THRESHOLD) {
        play();
      }
    };

    const observer = new IntersectionObserver(
      (entries): void => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0 },
    );

    observer.observe(root);
    playIfVisible();

    window.addEventListener("scroll", playIfVisible, { passive: true });
    const retry = window.setTimeout(playIfVisible, 100);

    return (): void => {
      observer.disconnect();
      playback?.pause();
      window.removeEventListener("scroll", playIfVisible);
      window.clearTimeout(retry);
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
