"use client";

import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import Image from "next/image";
import Link from "next/link";
import { type ReactElement, type SVGProps, useCallback, useRef } from "react";
import { useAboutSectionAnimation } from "@/components/sections/about/use-about-section-animation";
import { servicesPageHero } from "@/config/services-page";
import { createServicesHeroAnimation } from "./services-hero-animation";

export function ServicesHero(): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createServicesHeroAnimation(root, {
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
      aria-labelledby={servicesPageHero.headingId}
      className="bg-background text-foreground"
      ref={rootRef}
    >
      <div className="mx-auto grid max-w-page items-center gap-12 px-gutter py-section lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <p
            className="text-label text-primary uppercase"
            data-services-hero-eyebrow
          >
            {servicesPageHero.eyebrow}
          </p>
          <h1
            aria-label={servicesPageHero.heading}
            className="mt-4 text-display tracking-tight"
            id={servicesPageHero.headingId}
          >
            {servicesPageHero.headingLines.map((line, index) => {
              const isAccent =
                index === servicesPageHero.headingLines.length - 1;

              return (
                <span
                  aria-hidden="true"
                  className={cn("block overflow-hidden", index > 0 && "mt-1")}
                  key={line}
                >
                  <span
                    className={cn("block", isAccent && "text-primary")}
                    data-services-hero-line
                  >
                    {line}
                  </span>
                </span>
              );
            })}
          </h1>
          <p
            className="mt-6 max-w-xl text-body text-muted-foreground"
            data-services-hero-copy
          >
            {servicesPageHero.description}
          </p>
          <div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            data-services-hero-cta
          >
            <Button asChild className="group uppercase">
              <Link href={servicesPageHero.catalogHref}>
                {servicesPageHero.catalogLabel}
                <span className="inline-flex motion-safe:transition-transform motion-safe:duration-fast motion-safe:ease-standard group-hover:translate-x-1 group-focus-visible:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={servicesPageHero.quoteHref}>
                {servicesPageHero.quoteLabel}
              </Link>
            </Button>
          </div>
        </div>
        <figure className="m-0 lg:col-span-6">
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted"
            data-services-hero-mask
          >
            <div
              className="absolute inset-0 origin-center"
              data-services-hero-image
            >
              <div className="absolute inset-0" data-services-hero-parallax>
                <Image
                  alt={servicesPageHero.image.alt}
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  src={servicesPageHero.image.src}
                  style={{
                    objectPosition: servicesPageHero.image.objectPosition,
                  }}
                />
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}

function ArrowIcon(props: SVGProps<SVGSVGElement>): ReactElement {
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
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
