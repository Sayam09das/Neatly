"use client";

import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement, type SVGProps, useCallback, useRef } from "react";
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
      className="bg-background text-foreground"
      id="about"
      ref={rootRef}
    >
      <div className="mx-auto grid max-w-page items-center gap-12 px-gutter py-section lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p
            className="text-label text-primary uppercase"
            data-about-hero-eyebrow
          >
            {aboutHero.eyebrow}
          </p>
          <h1
            aria-label={aboutHero.heading}
            className="mt-4 text-display tracking-tight"
            id={aboutHero.headingId}
          >
            {aboutHero.headingLines.map((line, index) => {
              const isAccent = index === aboutHero.headingLines.length - 1;

              return (
                <span
                  aria-hidden="true"
                  className={cn("block overflow-hidden", index > 0 && "mt-1")}
                  key={line}
                >
                  <span
                    className={cn("block", isAccent && "text-primary")}
                    data-about-hero-line
                  >
                    {line}
                  </span>
                </span>
              );
            })}
          </h1>
          <p
            className="mt-6 max-w-xl text-body text-muted-foreground"
            data-about-hero-copy
          >
            {aboutHero.description}
          </p>
          <div className="mt-8" data-about-hero-cta>
            <Button asChild className="group uppercase">
              <Link href={aboutHero.ctaHref}>
                {aboutHero.ctaLabel}
                <span className="inline-flex motion-safe:transition-transform motion-safe:duration-fast motion-safe:ease-standard group-hover:translate-x-1 group-focus-visible:translate-x-1">
                  <ArrowUpRightIcon />
                </span>
              </Link>
            </Button>
          </div>
        </div>
        <figure className="m-0 lg:col-span-7">
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted sm:aspect-[5/4] lg:aspect-[4/5]"
            data-about-hero-mask
          >
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
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  src={aboutHero.image.src}
                  style={{ objectPosition: aboutHero.image.objectPosition }}
                />
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}

function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      viewBox="0 0 16 16"
      width="14"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
