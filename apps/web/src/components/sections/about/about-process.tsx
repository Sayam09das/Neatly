"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type ReactElement, useCallback, useRef, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { type AboutProcessStep, aboutProcess } from "@/config/about";
import {
  ABOUT_PROCESS_FINE_POINTER_QUERY,
  ABOUT_PROCESS_HOVER_LIFT_PX,
  createAboutProcessAnimation,
} from "./about-process-animation";
import { useAboutSectionAnimation } from "./use-about-section-animation";

const hoverTransition = {
  duration: durationSeconds.normal,
  ease: easings.standard.framer,
} as const;

export function AboutProcess(): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createAboutProcessAnimation(root, {
        compact: options.compact,
        enableClipPath: !options.compact,
        enableScrollTrigger: true,
      });
    },
    [],
  );

  useAboutSectionAnimation({ create, rootRef });

  return (
    <section
      aria-labelledby={aboutProcess.headingId}
      className="bg-background text-foreground"
      id="how-we-work"
      ref={rootRef}
    >
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="max-w-2xl" data-about-process-header-block>
          <p
            className="text-label text-primary uppercase"
            data-about-process-header
          >
            {aboutProcess.eyebrow}
          </p>
          <h2
            className="mt-4 text-display tracking-tight"
            data-about-process-header
            id={aboutProcess.headingId}
          >
            {aboutProcess.heading}
          </h2>
          <p
            className="mt-6 max-w-xl text-body text-muted-foreground"
            data-about-process-header
          >
            {aboutProcess.intro}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="mt-12 hidden h-px origin-left bg-border md:block"
        >
          <div
            className="h-full w-full origin-left bg-primary/70"
            data-about-process-progress
          />
        </div>
        <ol className="mt-12 space-y-16 md:mt-16">
          {aboutProcess.steps.map((step, index) => (
            <li data-about-process-step key={step.number}>
              <ProcessStage index={index} step={step} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProcessStage({
  index,
  step,
}: {
  index: number;
  step: AboutProcessStep;
}): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;
  const imageFirst = index % 2 === 0;

  const media = (
    <div
      className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted"
      data-about-process-mask
    >
      <div className="absolute inset-0" data-about-process-image>
        <Image
          alt={step.image.alt}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 48vw, 100vw"
          src={step.image.src}
          style={{ objectPosition: step.image.objectPosition }}
        />
      </div>
    </div>
  );

  const copy = (
    <div>
      <p className="text-label text-primary uppercase">{step.number}</p>
      <h3 className="mt-3 text-h2 tracking-tight">{step.title}</h3>
      <p className="mt-4 max-w-md text-body text-muted-foreground">
        {step.body}
      </p>
    </div>
  );

  const layout = (
    <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
      <div
        className={imageFirst ? "lg:col-span-7" : "lg:order-2 lg:col-span-7"}
      >
        {media}
      </div>
      <div
        className={imageFirst ? "lg:col-span-5" : "lg:order-1 lg:col-span-5"}
      >
        {copy}
      </div>
    </div>
  );

  if (prefersReducedMotion) {
    return layout;
  }

  return (
    <motion.div
      initial="rest"
      transition={hoverTransition}
      variants={{
        hover: { y: -ABOUT_PROCESS_HOVER_LIFT_PX },
        rest: { y: 0 },
      }}
      whileHover={hoverEnabled ? "hover" : undefined}
    >
      {layout}
    </motion.div>
  );
}

function useFinePointer(): boolean {
  const [matches, setMatches] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(ABOUT_PROCESS_FINE_POINTER_QUERY);
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
