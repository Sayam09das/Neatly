"use client";

import { Button } from "@neatly/ui";
import Link from "next/link";
import { type ReactElement, useRef } from "react";
import { useSectionReveal } from "@/animations/hooks/use-section-reveal";
import { landingFinalCta } from "@/config/landing";
import type { HomeCta } from "@/lib/customer/home";

interface FinalCtaSceneProps {
  accountCta?: HomeCta | null;
}

export function FinalCtaScene({
  accountCta = null,
}: FinalCtaSceneProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useSectionReveal({ rootRef });

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border bg-surface px-6 py-16 text-center md:px-12 md:py-20"
      ref={rootRef}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -bottom-8 origin-bottom-right scale-[4] select-none text-display font-semibold text-foreground/5 md:scale-[6]"
      >
        N
      </span>
      <div className="relative mx-auto max-w-2xl">
        <p className="text-label text-primary uppercase" data-reveal>
          {landingFinalCta.eyebrow}
        </p>
        <h2
          className="mt-4 text-balance text-display text-foreground tracking-tight"
          data-reveal
          id={landingFinalCta.headingId}
        >
          {landingFinalCta.heading}
        </h2>
        <p
          className="mx-auto mt-6 max-w-xl text-body text-muted-foreground"
          data-reveal
        >
          {landingFinalCta.description}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4" data-reveal>
          <Button asChild className="group min-h-touch w-full sm:w-auto">
            <Link href={landingFinalCta.primaryCta.href}>
              {landingFinalCta.primaryCta.label}
              <span className="inline-flex motion-safe:transition-transform motion-safe:duration-fast motion-safe:ease-standard motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1">
                <FinalCtaArrow />
              </span>
            </Link>
          </Button>
          <Link
            className="group/secondary inline-flex min-h-touch items-center gap-2 text-body-small text-muted-foreground underline-offset-4 motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={landingFinalCta.secondaryCta.href}
          >
            {landingFinalCta.secondaryCta.label}
            <span className="inline-flex motion-safe:transition-transform motion-safe:duration-normal motion-safe:ease-standard motion-safe:group-hover/secondary:translate-x-1">
              <FinalCtaArrow />
            </span>
          </Link>
          {accountCta === null ? null : (
            <Link
              className="inline-flex min-h-touch items-center text-body-small text-muted-foreground underline-offset-4 motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={accountCta.href}
            >
              {accountCta.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function FinalCtaArrow(): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
