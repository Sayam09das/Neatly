"use client";

import { motion } from "framer-motion";
import { type ReactElement, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { CountUpFigure } from "@/animations/count-up-figure";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import type { landingStatistics } from "@/config/landing";
import {
  STATISTICS_FINE_POINTER_QUERY,
  STATISTICS_HOVER_LIFT_PX,
  STATISTICS_TAP_SCALE,
} from "./statistics-animation";

type StatisticsSlot = (typeof landingStatistics.slots)[number];

interface StatisticsCardProps {
  pendingValue: string;
  slot: StatisticsSlot;
}

const hoverTransition = {
  duration: durationSeconds.normal,
  ease: easings.standard.framer,
} as const;

function useFinePointer(): boolean {
  const [matches, setMatches] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(STATISTICS_FINE_POINTER_QUERY);
    const sync = (): void => {
      setMatches(media.matches);
    };

    sync();
    media.addEventListener("change", sync);

    return (): void => {
      media.removeEventListener("change", sync);
    };
  }, []);

  return matches;
}

function StatisticsCardBody({
  pendingValue,
  slot,
}: StatisticsCardProps): ReactElement {
  return (
    <>
      <div
        aria-hidden="true"
        className="h-1 w-10 origin-left bg-primary"
        data-statistics-accent
      />
      <p className="mt-6 text-display text-primary tracking-tight">
        <CountUpFigure
          pendingValue={pendingValue}
          suffix={slot.suffix}
          value={slot.value}
        />
      </p>
      <h3 className="mt-4 text-h4 text-foreground">{slot.label}</h3>
      <p className="mt-2 text-body-small text-muted-foreground">{slot.body}</p>
    </>
  );
}

export function StatisticsCard({
  pendingValue,
  slot,
}: StatisticsCardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;

  if (prefersReducedMotion) {
    return (
      <article>
        <StatisticsCardBody pendingValue={pendingValue} slot={slot} />
      </article>
    );
  }

  return (
    <motion.article
      initial="rest"
      tabIndex={-1}
      transition={hoverTransition}
      variants={{
        hover: { y: -STATISTICS_HOVER_LIFT_PX },
        rest: { y: 0 },
      }}
      whileHover={hoverEnabled ? "hover" : undefined}
      whileTap={{ scale: STATISTICS_TAP_SCALE }}
    >
      <StatisticsCardBody pendingValue={pendingValue} slot={slot} />
    </motion.article>
  );
}
