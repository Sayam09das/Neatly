"use client";

import { type ReactElement, useRef } from "react";
import { useSectionReveal } from "@/animations/hooks/use-section-reveal";
import { landingTrustIndicators } from "@/config/landing";

export function TrustScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useSectionReveal({ rootRef });

  return (
    <div ref={rootRef}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-label text-primary uppercase" data-reveal>
          {landingTrustIndicators.eyebrow}
        </p>
        <h2
          className="mt-4 text-display text-foreground tracking-tight"
          data-reveal
          id={landingTrustIndicators.headingId}
        >
          {landingTrustIndicators.heading}
        </h2>
        <p
          className="mx-auto mt-6 max-w-xl text-body text-muted-foreground"
          data-reveal
        >
          {landingTrustIndicators.intro}
        </p>
      </div>
      <ul className="mt-16 grid gap-grid sm:grid-cols-2 lg:grid-cols-4">
        {landingTrustIndicators.items.map((item) => (
          <li
            className="border-t border-border pt-6"
            data-reveal
            key={item.title}
          >
            <p className="text-display text-primary tracking-tight">
              {landingTrustIndicators.pendingValue}
            </p>
            <h3 className="mt-4 text-h4 text-foreground">{item.title}</h3>
            <p className="mt-2 text-body-small text-muted-foreground">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
