"use client";

import { Button } from "@neatly/ui";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement, useCallback, useRef } from "react";
import { HeroCurve } from "@/components/sections/hero/hero-curve";
import { aboutHero } from "@/config/about";
import { createAboutHeroAnimation } from "./about-hero-animation";
import { useAboutSectionAnimation } from "./use-about-section-animation";

export function AboutHero(): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createAboutHeroAnimation(root, {
        compact: options.compact,
        enableParallax: !options.compact,
        enableScrollTrigger: true,
      });
    },
    [],
  );

  useAboutSectionAnimation({ create, rootRef });

  return (
    <section
      aria-labelledby={aboutHero.headingId}
      className="relative -mt-16 overflow-x-hidden text-secondary-foreground"
      id="about"
      ref={rootRef}
    >
      <div className="relative min-h-svh overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-base overflow-hidden"
        >
          <div className="absolute inset-0 bg-secondary">
            <div
              className="absolute inset-0 origin-center"
              data-about-hero-image
            >
              <div className="absolute inset-0" data-about-hero-parallax>
                <Image
                  alt={aboutHero.image.alt}
                  className="object-cover"
                  fill
                  priority
                  sizes="100vw"
                  src={aboutHero.image.src}
                  style={{ objectPosition: aboutHero.image.objectPosition }}
                />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-secondary/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/45 to-secondary/20" />
        </div>
        <div className="relative z-base mx-auto flex min-h-svh max-w-page flex-col justify-end px-gutter pt-28 pb-28 md:justify-center md:pt-32 md:pb-32 lg:pb-36">
          <div className="max-w-2xl">
            <p
              className="text-label text-secondary-foreground/70 uppercase"
              data-about-hero-eyebrow
            >
              {aboutHero.eyebrow}
            </p>
            <div className="mt-4" data-about-hero-heading-mask>
              <h1
                aria-label={aboutHero.heading}
                className="text-display tracking-tight"
                data-about-hero-heading
                id={aboutHero.headingId}
              >
                <span aria-hidden="true" className="block">
                  {aboutHero.headingLead}
                </span>
                <span aria-hidden="true" className="mt-1 block text-primary">
                  {aboutHero.headingEmphasis}
                </span>
                <span aria-hidden="true" className="mt-1 block">
                  {aboutHero.headingTail}
                </span>
              </h1>
            </div>
            <p
              className="mt-6 max-w-xl text-body text-secondary-foreground/90"
              data-about-hero-copy
            >
              {aboutHero.description}
            </p>
            <div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              data-about-hero-cta
            >
              <Button asChild className="uppercase">
                <Link href={aboutHero.ctaHref}>{aboutHero.ctaLabel}</Link>
              </Button>
              <Link
                className="inline-flex min-h-touch items-center text-body-small text-secondary-foreground/80 underline-offset-4 transition-colors duration-normal ease-standard hover:text-secondary-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={aboutHero.secondaryHref}
              >
                {aboutHero.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
        <HeroCurve />
      </div>
    </section>
  );
}
