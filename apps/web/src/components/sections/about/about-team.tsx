"use client";

import Image from "next/image";
import { type ReactElement, useCallback, useRef } from "react";
import { aboutTeam } from "@/config/about";
import { createAboutTeamAnimation } from "./about-team-animation";
import { useAboutSectionAnimation } from "./use-about-section-animation";

export function AboutTeam(): ReactElement {
  const rootRef = useRef<HTMLElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createAboutTeamAnimation(root, {
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
      aria-labelledby={aboutTeam.headingId}
      className="bg-muted text-foreground"
      id="people"
      ref={rootRef}
    >
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <figure className="m-0">
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-xl bg-background sm:aspect-[5/4] lg:aspect-[4/5]"
                data-about-team-mask
              >
                <div className="absolute inset-0" data-about-team-image>
                  <div className="absolute inset-0" data-about-team-parallax>
                    <Image
                      alt={aboutTeam.image.alt}
                      className="object-cover"
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      src={aboutTeam.image.src}
                      style={{ objectPosition: aboutTeam.image.objectPosition }}
                    />
                  </div>
                </div>
              </div>
            </figure>
          </div>
          <div className="lg:col-span-5">
            <p
              className="text-label text-primary uppercase"
              data-about-team-copy
            >
              {aboutTeam.eyebrow}
            </p>
            <h2
              className="mt-4 text-display tracking-tight"
              data-about-team-copy
              id={aboutTeam.headingId}
            >
              {aboutTeam.heading}
            </h2>
            <p
              className="mt-6 text-body text-muted-foreground"
              data-about-team-copy
            >
              {aboutTeam.intro}
            </p>
            <p
              className="mt-6 text-body-small text-muted-foreground"
              data-about-team-copy
            >
              {aboutTeam.emptyMessage}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
