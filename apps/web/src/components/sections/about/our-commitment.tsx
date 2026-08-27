"use client";

import { type ReactElement, useCallback, useRef } from "react";
import { BandCurve } from "@/components/sections/band-curve";
import { aboutCommitment } from "@/config/about";
import { createAboutCommitmentAnimation } from "./our-commitment-animation";
import { useAboutSectionAnimation } from "./use-about-section-animation";

export function OurCommitment(): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createAboutCommitmentAnimation(root, {
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
      aria-labelledby={aboutCommitment.headingId}
      className="relative overflow-x-hidden bg-secondary text-secondary-foreground"
      id="commitment"
      ref={rootRef}
    >
      <BandCurve />
      <div className="h-16 md:h-24 lg:h-28" />
      <div className="mx-auto max-w-page px-gutter py-section">
        <p
          className="text-label text-accent uppercase"
          data-about-commitment-eyebrow
        >
          {aboutCommitment.eyebrow}
        </p>
        <div className="mt-6 max-w-3xl" data-about-commitment-heading-mask>
          <h2
            className="text-display tracking-tight"
            data-about-commitment-heading
            id={aboutCommitment.headingId}
          >
            {aboutCommitment.heading}
          </h2>
        </div>
        <div
          aria-hidden="true"
          className="mt-8 h-px w-24 origin-left bg-accent/70"
          data-about-commitment-rule
        />
        <p
          className="mt-8 max-w-2xl text-body text-secondary-foreground/80"
          data-about-commitment-copy
        >
          {aboutCommitment.intro}
        </p>
        <ul className="mt-16 grid gap-10 md:grid-cols-2 md:gap-12">
          {aboutCommitment.items.map((item) => (
            <li data-about-commitment-copy key={item.title}>
              <h3 className="text-h3 tracking-tight">{item.title}</h3>
              <p className="mt-3 text-body-small text-secondary-foreground/80">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-16 md:h-24 lg:h-28" />
    </section>
  );
}
