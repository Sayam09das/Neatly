"use client";

import { cn } from "@neatly/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { type ReactElement, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import type { landingWhyNeatly } from "@/config/landing";
import {
  WHY_FINE_POINTER_QUERY,
  WHY_HOVER_IMAGE_SCALE,
  WHY_HOVER_LIFT_PX,
  WHY_TAP_SCALE,
} from "./why-neatly-animation";

type WhyBenefit = (typeof landingWhyNeatly.benefits)[number];

interface BenefitCardProps {
  benefit: WhyBenefit;
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

export function BenefitCard({ benefit }: BenefitCardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const hoverEnabled = finePointer && !prefersReducedMotion;

  const cardClassName = cn(
    "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background",
    "motion-safe:transition-shadow motion-safe:duration-normal motion-safe:ease-standard",
    benefit.featured
      ? "shadow-md motion-safe:hover:shadow-lg"
      : "shadow-sm motion-safe:hover:shadow-md",
  );

  const imageFrame = (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        benefit.featured ? "aspect-[4/5]" : "aspect-[4/3]",
      )}
    >
      <div className="absolute inset-0" data-why-image-reveal>
        <div className="absolute inset-0" data-why-image-parallax>
          {hoverEnabled ? (
            <motion.div
              className="absolute inset-0"
              transition={imageHoverTransition}
              variants={{
                hover: { scale: WHY_HOVER_IMAGE_SCALE },
                rest: { scale: 1 },
              }}
            >
              <BenefitCardImage benefit={benefit} />
            </motion.div>
          ) : (
            <div className="absolute inset-0">
              <BenefitCardImage benefit={benefit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const body = (
    <div className="flex flex-1 flex-col p-6" data-why-card-content>
      <p className="text-label text-primary uppercase">{benefit.index}</p>
      <h3 className="mt-3 text-h3 text-foreground tracking-tight">
        {benefit.title}
      </h3>
      <p className="mt-2 text-body-small text-muted-foreground">
        {benefit.body}
      </p>
    </div>
  );

  if (prefersReducedMotion) {
    return (
      <article className={cardClassName}>
        {imageFrame}
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
        hover: { y: -WHY_HOVER_LIFT_PX },
        rest: { y: 0 },
      }}
      whileHover={hoverEnabled ? "hover" : undefined}
      whileTap={{ scale: WHY_TAP_SCALE }}
    >
      {imageFrame}
      {body}
    </motion.article>
  );
}

function BenefitCardImage({ benefit }: BenefitCardProps): ReactElement {
  return (
    <Image
      alt={benefit.image.alt}
      className="object-cover"
      fill
      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
      src={benefit.image.src}
      style={{ objectPosition: benefit.image.objectPosition }}
    />
  );
}
