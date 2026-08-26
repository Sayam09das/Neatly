"use client";

import { motion } from "framer-motion";
import { type ReactElement, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import type { landingTrustProof } from "@/config/landing";
import {
  PROOF_FINE_POINTER_QUERY,
  PROOF_HOVER_LIFT_PX,
  PROOF_TAP_SCALE,
} from "./proof-animation";

type TrustPoint = (typeof landingTrustProof.items)[number];

interface TrustItemProps {
  item: TrustPoint;
}

const hoverTransition = {
  duration: durationSeconds.normal,
  ease: easings.standard.framer,
} as const;

function useFinePointer(): boolean {
  const [matches, setMatches] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(PROOF_FINE_POINTER_QUERY);
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

function TrustItemContent({ item }: TrustItemProps): ReactElement {
  return (
    <>
      <div className="flex items-center gap-4">
        <p className="text-label text-primary uppercase" data-proof-number>
          {item.number}
        </p>
        <div
          aria-hidden="true"
          className="h-px min-w-0 flex-1 origin-left bg-border"
          data-proof-item-rule
        />
      </div>
      <h3 className="mt-4 text-h3 tracking-tight">{item.title}</h3>
      <p className="mt-2 max-w-prose text-body-small text-muted-foreground">
        {item.body}
      </p>
    </>
  );
}

export function TrustItem({ item }: TrustItemProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;

  if (prefersReducedMotion) {
    return (
      <article data-proof-item-body>
        <TrustItemContent item={item} />
      </article>
    );
  }

  return (
    <motion.article
      data-proof-item-body
      initial="rest"
      tabIndex={-1}
      transition={hoverTransition}
      variants={{
        hover: { y: -PROOF_HOVER_LIFT_PX },
        rest: { y: 0 },
      }}
      whileHover={hoverEnabled ? "hover" : undefined}
      whileTap={{ scale: PROOF_TAP_SCALE }}
    >
      <TrustItemContent item={item} />
    </motion.article>
  );
}
