"use client";

import Image from "next/image";
import { type ReactElement, useCallback, useRef } from "react";
import { aboutStory } from "@/config/about";
import { createAboutStoryAnimation } from "./our-story-animation";
import { useAboutSectionAnimation } from "./use-about-section-animation";

export function OurStory(): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createAboutStoryAnimation(root, {
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
      aria-labelledby={aboutStory.headingId}
      className="bg-background text-foreground"
      id="story"
      ref={rootRef}
    >
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p
              className="text-label text-primary uppercase"
              data-about-story-copy
            >
              {aboutStory.eyebrow}
            </p>
            <h2
              className="mt-4 max-w-xl text-display tracking-tight"
              data-about-story-copy
              id={aboutStory.headingId}
            >
              {aboutStory.heading}
            </h2>
            <p
              className="mt-6 max-w-xl text-body text-muted-foreground"
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
          <div className="lg:col-span-7">
            <figure className="m-0">
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted sm:aspect-[5/4] lg:aspect-[4/5]"
                data-about-story-mask
              >
                <div className="absolute inset-0" data-about-story-image>
                  <div className="absolute inset-0" data-about-story-parallax>
                    <Image
                      alt={aboutStory.image.alt}
                      className="object-cover"
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
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
              className="mt-6 ml-auto w-2/3 max-w-xs sm:w-1/2"
              data-about-story-detail
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                <Image
                  alt={aboutStory.detail.alt}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 18vw, 40vw"
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
    </section>
  );
}
