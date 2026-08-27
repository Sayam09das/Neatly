"use client";

import { cn } from "@neatly/utils";
import Image from "next/image";
import { type ReactElement, useCallback, useRef } from "react";
import { aboutStory } from "@/config/about";
import { createAboutStoryAnimation } from "./our-story-animation";
import { useAboutSectionAnimation } from "./use-about-section-animation";

export function OurStoryScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createAboutStoryAnimation(root, {
        compact: options.compact,
        enableParallax: !options.compact,
        enableScrollTrigger: true,
      });
    },
    [],
  );

  useAboutSectionAnimation({ create, rootRef });

  return (
    <div className="mx-auto max-w-page px-gutter py-section" ref={rootRef}>
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-12">
        <div className="lg:col-span-8">
          <p
            className="text-label text-primary uppercase"
            data-about-story-eyebrow
          >
            {aboutStory.eyebrow}
          </p>
          <h2
            aria-label={aboutStory.heading}
            className="mt-4 text-display tracking-tight"
            id={aboutStory.headingId}
          >
            {aboutStory.headingLines.map((line, index) => {
              const isAccent = index === aboutStory.headingLines.length - 1;

              return (
                <span
                  aria-hidden="true"
                  className={cn("block overflow-hidden", index > 0 && "mt-1")}
                  key={line}
                >
                  <span
                    className={cn("block", isAccent && "text-primary")}
                    data-about-story-line
                  >
                    {line}
                  </span>
                </span>
              );
            })}
          </h2>
        </div>
        <div className="lg:col-span-5 lg:row-start-2">
          <p
            className="max-w-xl text-body text-muted-foreground"
            data-about-story-copy
          >
            {aboutStory.intro}
          </p>
          <p
            className="mt-6 max-w-xl text-body text-muted-foreground"
            data-about-story-copy
          >
            {aboutStory.narrative}
          </p>
        </div>
        <div className="relative lg:col-span-7 lg:row-start-2 lg:pb-16">
          <figure className="m-0">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted sm:aspect-[5/4] lg:aspect-[4/5]"
              data-about-story-mask
            >
              <div
                className="absolute inset-0 origin-center"
                data-about-story-image
              >
                <div className="absolute inset-0" data-about-story-parallax>
                  <Image
                    alt={aboutStory.image.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    src={aboutStory.image.src}
                    style={{
                      objectPosition: aboutStory.image.objectPosition,
                    }}
                  />
                </div>
              </div>
            </div>
          </figure>
          <figure
            className="mt-6 w-2/3 max-w-xs sm:ml-auto lg:absolute lg:-bottom-4 lg:-left-10 lg:mt-0 lg:w-[42%] lg:max-w-none"
            data-about-story-detail
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
              <Image
                alt={aboutStory.detail.alt}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 22vw, 50vw"
                src={aboutStory.detail.src}
                style={{
                  objectPosition: aboutStory.detail.objectPosition,
                }}
              />
            </div>
            <figcaption className="mt-3 text-caption text-muted-foreground">
              {aboutStory.detail.caption}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
