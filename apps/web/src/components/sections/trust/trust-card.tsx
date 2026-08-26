"use client";

import { motion } from "framer-motion";
import { type ReactElement, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { CountUpFigure } from "@/animations/count-up-figure";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import type { landingTrustIndicators } from "@/config/landing";
import {
  TRUST_FINE_POINTER_QUERY,
  TRUST_HOVER_LIFT_PX,
  TRUST_TAP_SCALE,
} from "./trust-animation";

type TrustItem = (typeof landingTrustIndicators.items)[number];

interface TrustCardProps {
  item: TrustItem;
  pendingValue: string;
}

const hoverTransition = {
  duration: durationSeconds.normal,
  ease: easings.standard.framer,
} as const;

function useFinePointer(): boolean {
  const [matches, setMatches] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(TRUST_FINE_POINTER_QUERY);
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

function TrustCardBody({ item, pendingValue }: TrustCardProps): ReactElement {
  return (
    <>
      <div
        aria-hidden="true"
        className="h-1 w-10 origin-left bg-primary"
        data-trust-accent
      />
      <p className="mt-6 text-display text-primary tracking-tight">
        <CountUpFigure
          pendingValue={pendingValue}
          suffix={item.suffix}
          value={item.value}
        />
      </p>
      <h3 className="mt-4 text-h4 text-foreground">{item.title}</h3>
      <p className="mt-2 text-body-small text-muted-foreground">{item.body}</p>
    </>
  );
}

export function TrustCard({
  item,
  pendingValue,
}: TrustCardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;

  if (prefersReducedMotion) {
    return (
      <article>
        <TrustCardBody item={item} pendingValue={pendingValue} />
      </article>
    );
  }

  return (
    <motion.article
      initial="rest"
      tabIndex={-1}
      transition={hoverTransition}
      variants={{
        hover: { y: -TRUST_HOVER_LIFT_PX },
        rest: { y: 0 },
      }}
      whileHover={hoverEnabled ? "hover" : undefined}
      whileTap={{ scale: TRUST_TAP_SCALE }}
    >
      <TrustCardBody item={item} pendingValue={pendingValue} />
    </motion.article>
  );
}
