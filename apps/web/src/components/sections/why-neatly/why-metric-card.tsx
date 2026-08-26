"use client";

import { motion } from "framer-motion";
import { type ReactElement, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { CountUpFigure } from "@/animations/count-up-figure";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import type { landingWhyNeatly } from "@/config/landing";
import {
  WHY_FINE_POINTER_QUERY,
  WHY_METRIC_HOVER_LIFT_PX,
  WHY_METRIC_TAP_SCALE,
} from "./why-neatly-animation";

type WhyMetric = (typeof landingWhyNeatly.metrics)[number];

interface WhyMetricCardProps {
  metric: WhyMetric;
  pendingSrLabel: string;
  pendingValue: string;
}

const hoverTransition = {
  duration: durationSeconds.normal,
  ease: easings.standard.framer,
} as const;

function useFinePointer(): boolean {
  const [matches, setMatches] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(WHY_FINE_POINTER_QUERY);
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

function WhyMetricCardBody({
  metric,
  pendingSrLabel,
  pendingValue,
}: WhyMetricCardProps): ReactElement {
  return (
    <>
      <p className="text-display text-primary tracking-tight">
        <CountUpFigure
          pendingSrLabel={pendingSrLabel}
          pendingValue={pendingValue}
          suffix={metric.suffix}
          value={metric.value}
        />
      </p>
      <div
        aria-hidden="true"
        className="mt-4 h-1 w-10 origin-left bg-primary"
        data-why-metric-accent
      />
      <p className="mt-4 text-h4 text-foreground">{metric.label}</p>
      <p className="mt-2 max-w-xs text-caption text-muted-foreground">
        {metric.body}
      </p>
    </>
  );
}

export function WhyMetricCard({
  metric,
  pendingSrLabel,
  pendingValue,
}: WhyMetricCardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;

  if (prefersReducedMotion) {
    return (
      <div>
        <WhyMetricCardBody
          metric={metric}
          pendingSrLabel={pendingSrLabel}
          pendingValue={pendingValue}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="rest"
      tabIndex={-1}
      transition={hoverTransition}
      variants={{
        hover: { y: -WHY_METRIC_HOVER_LIFT_PX },
        rest: { y: 0 },
      }}
      whileHover={hoverEnabled ? "hover" : undefined}
      whileTap={{ scale: WHY_METRIC_TAP_SCALE }}
    >
      <WhyMetricCardBody
        metric={metric}
        pendingSrLabel={pendingSrLabel}
        pendingValue={pendingValue}
      />
    </motion.div>
  );
}
