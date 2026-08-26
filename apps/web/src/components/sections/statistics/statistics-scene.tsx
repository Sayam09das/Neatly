"use client";

import { type ReactElement, useRef } from "react";
import { landingStatistics } from "@/config/landing";
import { StatisticsCard } from "./statistics-card";
import { useStatisticsAnimation } from "./use-statistics-animation";

export function StatisticsScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useStatisticsAnimation({ rootRef });

  return (
    <div ref={rootRef}>
      <h2
        className="text-display text-foreground tracking-tight"
        data-statistics-heading
        id={landingStatistics.headingId}
      >
        {landingStatistics.heading}
      </h2>
      <p
        className="mt-6 max-w-xl text-body text-muted-foreground"
        data-statistics-intro
      >
        {landingStatistics.intro}
      </p>
      <ul className="mt-16 grid gap-grid sm:grid-cols-3">
        {landingStatistics.slots.map((slot) => (
          <li
            className="border-t border-border pt-6"
            data-statistics-item
            key={slot.label}
          >
            <StatisticsCard
              pendingValue={landingStatistics.pendingValue}
              slot={slot}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
