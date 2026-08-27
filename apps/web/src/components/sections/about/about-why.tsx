"use client";

import { motion } from "framer-motion";
import { type ReactElement, useCallback, useRef, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useIsomorphicLayoutEffect } from "@/animations/hooks/use-isomorphic-layout-effect";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { type AboutDifferentiator, aboutWhy } from "@/config/about";
import {
  ABOUT_WHY_FINE_POINTER_QUERY,
  ABOUT_WHY_HOVER_LIFT_PX,
  ABOUT_WHY_HOVER_SCALE,
  createAboutWhyAnimation,
} from "./about-why-animation";
import { useAboutSectionAnimation } from "./use-about-section-animation";

const hoverTransition = {
  duration: durationSeconds.normal,
  ease: easings.standard.framer,
} as const;

export function AboutWhy(): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createAboutWhyAnimation(root, {
        compact: options.compact,
        enableScrollTrigger: true,
      });
    },
    [],
  );

  useAboutSectionAnimation({ create, rootRef });

  return (
    <section
      aria-labelledby={aboutWhy.headingId}
      className="bg-background text-foreground"
      id="why"
      ref={rootRef}
    >
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="max-w-2xl">
          <p
            className="text-label text-primary uppercase"
            data-about-why-header
          >
            {aboutWhy.eyebrow}
          </p>
          <h2
            className="mt-4 text-display tracking-tight"
            data-about-why-header
            id={aboutWhy.headingId}
          >
            {aboutWhy.heading}
          </h2>
          <p
            className="mt-6 max-w-xl text-body text-muted-foreground"
            data-about-why-header
          >
            {aboutWhy.intro}
          </p>
        </div>
        <ul className="mt-16 space-y-6">
          {aboutWhy.items.map((item) => (
            <li data-about-why-item key={item.title}>
              <WhyItem item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WhyItem({ item }: { item: AboutDifferentiator }): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const hoverEnabled = useFinePointer() && !prefersReducedMotion;
  const body = (
    <article className="rounded-xl border border-border bg-background p-6 md:p-8">
      <h3 className="text-h3 tracking-tight">{item.title}</h3>
      <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-10">
        <p className="text-body-small text-muted-foreground">
          <span className="mb-2 block text-label text-muted-foreground uppercase">
            {aboutWhy.expectationLabel}
          </span>
          {item.expectation}
        </p>
        <p className="text-body-small text-foreground">
          <span className="mb-2 block text-label text-primary uppercase">
            {aboutWhy.neatlyLabel}
          </span>
          {item.neatly}
        </p>
      </div>
    </article>
  );

  if (prefersReducedMotion) {
    return body;
  }

  return (
    <motion.div
      initial="rest"
      transition={hoverTransition}
      variants={{
        hover: { scale: ABOUT_WHY_HOVER_SCALE, y: -ABOUT_WHY_HOVER_LIFT_PX },
        rest: { scale: 1, y: 0 },
      }}
      whileHover={hoverEnabled ? "hover" : undefined}
    >
      {body}
    </motion.div>
  );
}

function useFinePointer(): boolean {
  const [matches, setMatches] = useState(false);

  useIsomorphicLayoutEffect((): (() => void) => {
    const media = window.matchMedia(ABOUT_WHY_FINE_POINTER_QUERY);
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
