"use client";

import { type ReactElement, useRef } from "react";
import { useSectionReveal } from "@/animations/hooks/use-section-reveal";
import { landingStatistics } from "@/config/landing";

export function StatisticsScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useSectionReveal({ rootRef });

  return (
    <div ref={rootRef}>
      <h2
        className="text-display text-foreground tracking-tight"
        data-reveal
        id={landingStatistics.headingId}
      >
        {landingStatistics.heading}
      </h2>
      <p className="mt-6 max-w-xl text-body text-muted-foreground" data-reveal>
        {landingStatistics.emptyMessage}
      </p>
      <ul className="mt-16 grid gap-grid sm:grid-cols-3">
        {landingStatistics.slots.map((slot) => (
          <li
            className="border-t border-border pt-6"
            data-reveal
            key={slot.label}
          >
            <p className="text-display text-primary tracking-tight">
              {landingStatistics.pendingValue}
            </p>
            <h3 className="mt-4 text-h4 text-foreground">{slot.label}</h3>
            <p className="mt-2 text-body-small text-muted-foreground">
              {slot.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
