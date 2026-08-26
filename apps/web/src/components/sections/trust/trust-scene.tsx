"use client";

import { type ReactElement, useRef } from "react";
import { landingTrustIndicators } from "@/config/landing";
import { TrustCard } from "./trust-card";
import { useTrustAnimation } from "./use-trust-animation";

export function TrustScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useTrustAnimation({ rootRef });

  return (
    <div
      className="mx-auto w-full max-w-page px-gutter py-section"
      ref={rootRef}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-label text-primary uppercase" data-trust-eyebrow>
          {landingTrustIndicators.eyebrow}
        </p>
        <h2
          className="mt-4 text-display text-foreground tracking-tight"
          data-trust-heading
          id={landingTrustIndicators.headingId}
        >
          {landingTrustIndicators.heading}
        </h2>
        <p
          className="mx-auto mt-6 max-w-xl text-body text-muted-foreground"
          data-trust-intro
        >
          {landingTrustIndicators.intro}
        </p>
      </div>
      <ul className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2">
        {landingTrustIndicators.items.map((item) => (
          <li
            className="border-t border-border pt-6"
            data-trust-item
            key={item.title}
          >
            <TrustCard
              item={item}
              pendingValue={landingTrustIndicators.pendingValue}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
