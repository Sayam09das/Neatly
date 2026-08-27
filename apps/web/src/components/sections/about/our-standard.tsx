"use client";

import { type ReactElement, useCallback, useRef } from "react";
import { BandCurve } from "@/components/sections/band-curve";
import { aboutStandard } from "@/config/about";
import { createAboutStandardAnimation } from "./our-standard-animation";
import { useAboutSectionAnimation } from "./use-about-section-animation";

export function OurStandard(): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createAboutStandardAnimation(root, {
        compact: options.compact,
        enableScrollTrigger: true,
      });
    },
    [],
  );

  useAboutSectionAnimation({ create, rootRef });

  return (
    <section
      aria-labelledby={aboutStandard.headingId}
      className="relative overflow-x-hidden bg-secondary text-secondary-foreground"
      id="standard"
      ref={rootRef}
    >
      <BandCurve />
      <div className="h-16 md:h-24 lg:h-28" />
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="max-w-2xl" data-about-standard-header-block>
          <p
            className="text-label text-accent uppercase"
            data-about-standard-header
          >
            {aboutStandard.eyebrow}
          </p>
          <h2
            className="mt-4 text-display tracking-tight"
            data-about-standard-header
            id={aboutStandard.headingId}
          >
            {aboutStandard.heading}
          </h2>
          <p
            className="mt-6 max-w-xl text-body text-secondary-foreground/80"
            data-about-standard-header
          >
            {aboutStandard.intro}
          </p>
        </div>
        <ol className="mt-16 space-y-10 md:space-y-12">
          {aboutStandard.principles.map((principle) => (
            <li data-about-standard-item key={principle.number}>
              <p
                className="text-label text-accent uppercase"
                data-about-standard-number
              >
                {principle.number}
              </p>
              <div
                aria-hidden="true"
                className="mt-4 h-px w-16 origin-left bg-accent/70"
                data-about-standard-rule
              />
              <h3
                className="mt-4 text-h2 uppercase tracking-tight"
                data-about-standard-title
              >
                {principle.title}
              </h3>
              <p
                className="mt-3 max-w-2xl text-body text-secondary-foreground/80"
                data-about-standard-body
              >
                {principle.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <div className="h-16 md:h-24 lg:h-28" />
    </section>
  );
}
