"use client";

import Image from "next/image";
import { type ReactElement, useCallback, useRef } from "react";
import { aboutQuality } from "@/config/about";
import { createAboutQualityAnimation } from "./quality-details-animation";
import { useAboutSectionAnimation } from "./use-about-section-animation";

export function QualityDetails(): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createAboutQualityAnimation(root, {
        compact: options.compact,
        enableClipPath: !options.compact,
        enableParallax: !options.compact,
        enableScrollTrigger: true,
      });
    },
    [],
  );

  useAboutSectionAnimation({ create, rootRef });

  return (
    <section
      aria-labelledby={aboutQuality.headingId}
      className="bg-background text-foreground"
      id="quality"
      ref={rootRef}
    >
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="max-w-2xl">
          <p
            className="text-label text-primary uppercase"
            data-about-quality-copy
          >
            {aboutQuality.eyebrow}
          </p>
          <h2
            className="mt-4 text-display tracking-tight"
            data-about-quality-copy
            id={aboutQuality.headingId}
          >
            {aboutQuality.heading}
          </h2>
          <p
            className="mt-6 max-w-xl text-body text-muted-foreground"
            data-about-quality-copy
          >
            {aboutQuality.intro}
          </p>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <figure className="m-0 lg:col-span-8">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted sm:aspect-[16/10]"
              data-about-quality-mask
            >
              <div className="absolute inset-0" data-about-quality-primary>
                <div className="absolute inset-0" data-about-quality-parallax>
                  <Image
                    alt={aboutQuality.primary.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    src={aboutQuality.primary.src}
                    style={{
                      objectPosition: aboutQuality.primary.objectPosition,
                    }}
                  />
                </div>
              </div>
            </div>
          </figure>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <figure className="m-0" data-about-quality-secondary>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                <div className="absolute inset-0" data-about-quality-parallax>
                  <Image
                    alt={aboutQuality.secondary.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 28vw, 50vw"
                    src={aboutQuality.secondary.src}
                    style={{
                      objectPosition: aboutQuality.secondary.objectPosition,
                    }}
                  />
                </div>
              </div>
            </figure>
            <figure className="m-0" data-about-quality-secondary>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                <div className="absolute inset-0" data-about-quality-parallax>
                  <Image
                    alt={aboutQuality.tertiary.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 28vw, 50vw"
                    src={aboutQuality.tertiary.src}
                    style={{
                      objectPosition: aboutQuality.tertiary.objectPosition,
                    }}
                  />
                </div>
              </div>
            </figure>
          </div>
        </div>
        <ul className="mt-16 grid gap-8 md:grid-cols-3">
          {aboutQuality.statements.map((statement) => (
            <li
              className="max-w-sm text-body text-muted-foreground"
              data-about-quality-copy
              key={statement}
            >
              {statement}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
