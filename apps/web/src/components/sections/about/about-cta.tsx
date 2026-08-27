"use client";

import { Button } from "@neatly/ui";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement, useCallback, useRef } from "react";
import { BandCurve } from "@/components/sections/band-curve";
import { aboutCta } from "@/config/about";
import { createAboutCtaAnimation } from "./about-cta-animation";
import { useAboutSectionAnimation } from "./use-about-section-animation";

export function AboutCta(): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createAboutCtaAnimation(root, {
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
      aria-labelledby={aboutCta.headingId}
      className="relative overflow-hidden bg-secondary text-secondary-foreground"
      id="about-quote"
      ref={rootRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0" data-about-cta-image>
          <Image
            alt={aboutCta.image.alt}
            className="object-cover"
            fill
            sizes="100vw"
            src={aboutCta.image.src}
            style={{ objectPosition: aboutCta.image.objectPosition }}
          />
        </div>
        <div className="absolute inset-0 bg-secondary/75" />
      </div>
      <BandCurve edges="top" />
      <div className="relative z-base mx-auto max-w-page px-gutter py-section">
        <div className="mx-auto max-w-2xl py-8 text-center md:py-12">
          <div data-about-cta-heading-mask>
            <h2
              className="text-display tracking-tight"
              data-about-cta-heading
              id={aboutCta.headingId}
            >
              {aboutCta.heading}
            </h2>
          </div>
          <p
            className="mx-auto mt-6 max-w-xl text-body text-secondary-foreground/85"
            data-about-cta-copy
          >
            {aboutCta.description}
          </p>
          <div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            data-about-cta-actions
          >
            <Button asChild className="uppercase">
              <Link href={aboutCta.primaryHref}>{aboutCta.primaryLabel}</Link>
            </Button>
            <Link
              className="inline-flex min-h-touch items-center text-body-small text-secondary-foreground/80 underline-offset-4 transition-colors duration-normal ease-standard hover:text-secondary-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={aboutCta.secondaryHref}
            >
              {aboutCta.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
