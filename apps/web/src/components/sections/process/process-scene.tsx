"use client";

import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement, useRef } from "react";
import { landingHowItWorks } from "@/config/landing";
import { ProcessStepItem } from "./process-step";
import { useProcessAnimation } from "./use-process-animation";

interface ProcessSceneProps {
  quotesHref?: string;
}

export function ProcessScene({ quotesHref }: ProcessSceneProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useProcessAnimation({ rootRef });

  return (
    <div
      className="relative mx-auto flex max-w-page flex-col px-gutter py-section lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-16"
      ref={rootRef}
    >
      <div className="contents lg:sticky lg:top-28 lg:col-span-5 lg:flex lg:flex-col lg:gap-10">
        <div className="order-1 max-w-xl" data-process-header>
          <p
            className="text-label text-accent uppercase dark:text-accent-foreground"
            data-process-eyebrow
          >
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
            className="mt-6 max-w-xl text-body text-secondary-foreground/80"
            data-process-intro
          >
            {landingHowItWorks.intro}
          </p>
          <div
            aria-hidden="true"
            className="mt-8 h-px w-24 origin-left bg-accent/70 dark:bg-accent-foreground/70"
            data-process-rule
          />
        </div>
        <div className="order-3 mt-12 overflow-hidden rounded-xl lg:order-none lg:mt-0">
          <ProcessMedia />
        </div>
        <ProcessActions className="order-4 mt-10 lg:order-none lg:mt-0" />
      </div>
      <div className="order-2 mt-16 lg:order-none lg:col-span-7 lg:mt-0">
        <ProcessTimeline quotesHref={quotesHref} />
      </div>
    </div>
  );
}

function ProcessTimeline({ quotesHref }: ProcessSceneProps): ReactElement {
  return (
    <ol className="relative" data-process-timeline>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-3 left-3 w-px bg-secondary-foreground/20 lg:left-1/2 lg:-translate-x-1/2"
        data-process-progress
      >
        <div
          className="h-full w-full origin-top bg-accent/70 dark:bg-accent-foreground/70"
          data-process-progress-line
        />
      </div>
      {landingHowItWorks.steps.map((step, index) => {
        const alignEnd = index % 2 === 1;
        const cta = resolveStepCta(step, quotesHref);

        return (
          <li
            className="group grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 py-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-10 lg:py-8"
            data-process-step
            key={step.id}
          >
            <div className="relative z-10 col-start-1 row-start-1 mt-1.5 flex size-6 items-center justify-center lg:col-start-2">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-accent motion-safe:transition-transform motion-safe:duration-normal motion-safe:ease-standard motion-safe:group-hover:scale-110 dark:bg-accent-foreground"
                data-process-dot
              />
            </div>
            <div
              className={cn(
                "col-start-2 min-w-0",
                alignEnd ? "lg:col-start-3" : "lg:col-start-1 lg:row-start-1",
              )}
            >
              <ProcessStepItem alignEnd={alignEnd} cta={cta} step={step} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ProcessMedia(): ReactElement {
  return (
    <div
      className="relative aspect-video overflow-hidden bg-muted"
      data-process-media-mask
    >
      <div className="absolute inset-0" data-process-media-reveal>
        <div className="absolute inset-0" data-process-image-parallax>
          <Image
            alt={landingHowItWorks.image.alt}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 32vw, 100vw"
            src={landingHowItWorks.image.src}
            style={{ objectPosition: landingHowItWorks.image.objectPosition }}
          />
        </div>
      </div>
    </div>
  );
}

interface ProcessActionsProps {
  className?: string;
}

function ProcessActions({ className }: ProcessActionsProps): ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
        className,
      )}
    >
      <Button asChild>
        <Link href={landingHowItWorks.primaryCta.href}>
          {landingHowItWorks.primaryCta.label}
        </Link>
      </Button>
      <Button
        asChild
        className="border-secondary-foreground/40 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground focus-visible:ring-offset-secondary"
        variant="outline"
      >
        <Link href={landingHowItWorks.secondaryCta.href}>
          {landingHowItWorks.secondaryCta.label}
        </Link>
      </Button>
    </div>
  );
}

function resolveStepCta(
  step: (typeof landingHowItWorks.steps)[number],
  quotesHref: string | undefined,
): { href: string; label: string } | undefined {
  if ("cta" in step) {
    return step.cta;
  }

  if (step.id === "accept" && quotesHref !== undefined) {
    return {
      href: quotesHref,
      label: landingHowItWorks.quotesCta.label,
    };
  }

  return undefined;
}
