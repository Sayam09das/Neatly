"use client";

import { cn } from "@neatly/utils";
import { type ReactElement, useCallback, useRef } from "react";
import { useAboutSectionAnimation } from "@/components/sections/about/use-about-section-animation";
import { landingWhyNeatly } from "@/config/landing";
import { WhyFeatureList } from "./why-feature-list";
import { createWhyNeatlyAnimation } from "./why-neatly-animation";
import { WhyNeatlyCta } from "./why-neatly-cta";

export function WhyNeatlyScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const create = useCallback(
    (root: HTMLElement, options: { compact: boolean }): void => {
      createWhyNeatlyAnimation(root, {
        compact: options.compact,
        enableScrollTrigger: true,
      });
    },
    [],
  );

  useAboutSectionAnimation({ create, rootRef });

  return (
    <div
      className="flex flex-col overflow-x-hidden lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
      ref={rootRef}
    >
      <div className="order-1 max-w-xl lg:sticky lg:top-28 lg:col-span-5 lg:row-start-1">
        <p className="text-label text-primary uppercase" data-why-header-item>
          {landingWhyNeatly.eyebrow}
        </p>
        <h2
          aria-label={landingWhyNeatly.heading}
          className="mt-4 text-display text-foreground tracking-tight"
          data-why-header-item
          id={landingWhyNeatly.headingId}
        >
          {landingWhyNeatly.headingLines.map((line, index) => {
            const isLast = index === landingWhyNeatly.headingLines.length - 1;

            return (
              <span
                aria-hidden="true"
                className={cn("block", isLast && "text-primary")}
                key={line}
              >
                {line}
                {isLast ? null : " "}
              </span>
            );
          })}
        </h2>
        <p
          className="mt-6 max-w-xl text-body text-muted-foreground"
          data-why-header-item
        >
          {landingWhyNeatly.intro}
        </p>
      </div>
      <div className="order-2 mt-12 lg:col-span-7 lg:row-span-2 lg:row-start-1 lg:mt-0">
        <WhyFeatureList />
      </div>
      <div className="order-3 mt-10 lg:col-span-5 lg:row-start-2 lg:mt-10">
        <WhyNeatlyCta />
      </div>
    </div>
  );
}
