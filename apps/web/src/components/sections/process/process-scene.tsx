"use client";

import Image from "next/image";
import { type ReactElement, useRef } from "react";
import { landingHowItWorks } from "@/config/landing";
import { ProcessTimeline } from "./process-timeline";
import { useProcessAnimation } from "./use-process-animation";

interface ProcessSceneProps {
  headingLevel?: "h1" | "h2";
  quotesHref?: string;
}

export function ProcessScene({
  headingLevel = "h2",
  quotesHref,
}: ProcessSceneProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const HeadingTag = headingLevel;

  useProcessAnimation({ rootRef });

  return (
    <div className="mx-auto max-w-page px-gutter py-section" ref={rootRef}>
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-16">
        <div
          className="order-1 max-w-xl lg:col-span-5 lg:row-start-1"
          data-process-header
        >
          <p
            className="text-label text-accent uppercase dark:text-accent-foreground"
            data-process-eyebrow
          >
            {landingHowItWorks.eyebrow}
          </p>
          <HeadingTag
            className="mt-4 text-display text-secondary-foreground tracking-tight"
            data-process-heading
            id={landingHowItWorks.headingId}
          >
            {landingHowItWorks.heading}
          </HeadingTag>
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
          <div
            className="mt-12 overflow-hidden rounded-xl"
            data-process-media-mask
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
              <div className="absolute inset-0" data-process-media-reveal>
                <div className="absolute inset-0" data-process-image-parallax>
                  <Image
                    alt={landingHowItWorks.image.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 32vw, 100vw"
                    src={landingHowItWorks.image.src}
                    style={{
                      objectPosition: landingHowItWorks.image.objectPosition,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="order-2 mt-16 lg:col-span-7 lg:row-start-1 lg:mt-0">
          <ProcessTimeline quotesHref={quotesHref} />
        </div>
      </div>
    </div>
  );
}
