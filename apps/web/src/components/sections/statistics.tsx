import type { ReactElement } from "react";
import { LandingSection } from "@/components/landing-section";
import { landingStatistics } from "@/config/landing";

export function Statistics(): ReactElement {
  return (
    <LandingSection id="statistics" labelledBy={landingStatistics.headingId}>
      <h2
        className="text-h2 text-foreground tracking-tight"
        id={landingStatistics.headingId}
      >
        {landingStatistics.heading}
      </h2>
      <p className="mt-4 max-w-content text-body text-muted-foreground">
        {landingStatistics.emptyMessage}
      </p>
      <ul className="mt-8 grid gap-grid sm:grid-cols-3">
        {landingStatistics.slots.map((slot) => (
          <li key={slot.label}>
            <p className="text-h3 text-foreground">—</p>
            <h3 className="mt-2 text-body-small text-muted-foreground">
              {slot.label}
            </h3>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
