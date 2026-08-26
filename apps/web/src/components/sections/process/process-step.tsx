"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type ReactElement, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import type { landingHowItWorks } from "@/config/landing";
import {
  PROCESS_FINE_POINTER_QUERY,
  PROCESS_HOVER_IMAGE_SCALE,
  PROCESS_HOVER_LIFT_PX,
  PROCESS_TAP_SCALE,
} from "./process-animation";

type ProcessStep = (typeof landingHowItWorks.steps)[number];

interface ProcessStepCardProps {
  step: ProcessStep;
}

const hoverTransition = {
  duration: durationSeconds.normal,
  ease: easings.standard.framer,
} as const;

const imageHoverTransition = {
  duration: durationSeconds.slow,
  ease: easings.enter.framer,
} as const;

function useFinePointer(): boolean {
  const [matches, setMatches] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(PROCESS_FINE_POINTER_QUERY);
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

export function ProcessStepCard({ step }: ProcessStepCardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;

  const cardClassName =
    "overflow-hidden rounded-xl border border-secondary-foreground/15 bg-background text-foreground";

  const image = (
    <div
      className="relative aspect-video overflow-hidden bg-muted"
      data-process-image-mask
    >
      <div className="absolute inset-0" data-process-image-reveal>
        <div className="absolute inset-0" data-process-image-parallax>
          {hoverEnabled ? (
            <motion.div
              className="absolute inset-0"
              transition={imageHoverTransition}
              variants={{
                hover: { scale: PROCESS_HOVER_IMAGE_SCALE },
                rest: { scale: 1 },
              }}
            >
              <ProcessStepImage step={step} />
            </motion.div>
          ) : (
            <div className="absolute inset-0">
              <ProcessStepImage step={step} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const body = (
    <div className="p-6">
      <p className="text-label text-primary uppercase" data-process-number>
        {step.number}
      </p>
      <h3 className="mt-3 text-h3 tracking-tight">{step.title}</h3>
      <p className="mt-3 text-body-small text-muted-foreground">{step.body}</p>
    </div>
  );

  if (prefersReducedMotion) {
    return (
      <article className={cardClassName}>
        {image}
        {body}
      </article>
    );
  }

  return (
    <motion.article
      className={cardClassName}
      initial="rest"
      transition={hoverTransition}
      variants={{
        hover: { y: -PROCESS_HOVER_LIFT_PX },
        rest: { y: 0 },
      }}
      whileHover={hoverEnabled ? "hover" : undefined}
      whileTap={{ scale: PROCESS_TAP_SCALE }}
    >
      {image}
      {body}
    </motion.article>
  );
}

function ProcessStepImage({ step }: ProcessStepCardProps): ReactElement {
  return (
    <Image
      alt={step.image.alt}
      className="object-cover"
      fill
      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
      src={step.image.src}
      style={{ objectPosition: step.image.objectPosition }}
    />
  );
}
