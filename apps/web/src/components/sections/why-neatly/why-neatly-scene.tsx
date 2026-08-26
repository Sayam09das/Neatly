"use client";

import { type ReactElement, useRef } from "react";
import { landingWhyNeatly } from "@/config/landing";
import { BenefitCards } from "./benefit-cards";
import { TrustMetrics } from "./trust-metrics";
import { useBenefitCardAnimation } from "./use-benefit-card-animation";
import { WhyIllustration } from "./why-illustration";

export function WhyNeatlyScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useBenefitCardAnimation({ rootRef });

  return (
    <div className="relative" ref={rootRef}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <WhyIllustration />
      </div>
      <p className="text-label text-primary uppercase" data-why-header-item>
        {landingWhyNeatly.eyebrow}
      </p>
      <h2
        className="mt-4 max-w-2xl text-display text-foreground tracking-tight"
        data-why-header-item
        id={landingWhyNeatly.headingId}
      >
        {landingWhyNeatly.headingLead} <br className="hidden sm:block" />
        <span className="text-primary">{landingWhyNeatly.emphasis}</span>{" "}
        {landingWhyNeatly.headingTail}
      </h2>
      <p
        className="mt-6 max-w-2xl text-body text-muted-foreground"
        data-why-header-item
      >
        {landingWhyNeatly.intro}
      </p>
      <BenefitCards />
      <div className="mt-section border-t border-border pt-section">
        <TrustMetrics />
      </div>
    </div>
  );
}
