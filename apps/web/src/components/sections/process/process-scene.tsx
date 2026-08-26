"use client";

import { type ReactElement, useRef } from "react";
import { landingHowItWorks } from "@/config/landing";
import { ProcessStepCard } from "./process-step";
import { useProcessAnimation } from "./use-process-animation";

export function ProcessScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useProcessAnimation({ rootRef });

  return (
    <div
      className="relative mx-auto max-w-page px-gutter py-section"
      ref={rootRef}
    >
      <div className="mx-auto max-w-2xl text-center" data-process-header>
        <p className="text-label text-accent uppercase" data-process-eyebrow>
          {landingHowItWorks.eyebrow}
        </p>
        <h2
          className="mt-4 text-display text-secondary-foreground tracking-tight"
          data-process-heading
          id={landingHowItWorks.headingId}
        >
          {landingHowItWorks.heading}
        </h2>
        <p
          className="mx-auto mt-6 max-w-xl text-body text-secondary-foreground/80"
          data-process-intro
        >
          {landingHowItWorks.intro}
        </p>
        <div
          aria-hidden="true"
          className="mx-auto mt-8 h-px w-24 origin-left bg-accent/70"
          data-process-rule
        />
      </div>
      <div className="relative mt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden md:block"
          data-process-progress
        >
          <div className="relative flex items-center">
            <div className="absolute inset-x-0 h-px bg-secondary-foreground/20">
              <div
                className="h-full w-full origin-left bg-accent/70"
                data-process-progress-line
              />
            </div>
            <div className="grid w-full grid-cols-3 gap-grid">
              {landingHowItWorks.steps.map((step) => (
                <div className="flex justify-center" key={step.number}>
                  <span
                    className="size-1.5 rounded-full bg-accent"
                    data-process-dot
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <ol className="grid gap-grid md:grid-cols-3">
          {landingHowItWorks.steps.map((step) => (
            <li data-process-step key={step.title}>
              <ProcessStepCard step={step} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
