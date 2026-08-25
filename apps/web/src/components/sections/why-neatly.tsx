import type { ReactElement } from "react";
import { LandingSection } from "@/components/landing-section";
import { landingWhyNeatly } from "@/config/landing";

export function WhyNeatly(): ReactElement {
  return (
    <LandingSection id="why" labelledBy={landingWhyNeatly.headingId}>
      <h2
        className="text-h2 text-foreground tracking-tight"
        id={landingWhyNeatly.headingId}
      >
        {landingWhyNeatly.heading}
      </h2>
      <p className="mt-4 max-w-content text-body text-muted-foreground">
        {landingWhyNeatly.intro}
      </p>
      <ul className="mt-8 grid gap-grid md:grid-cols-2">
        {landingWhyNeatly.pillars.map((pillar) => (
          <li key={pillar.title}>
            <h3 className="text-h4 text-foreground">{pillar.title}</h3>
            <p className="mt-2 text-body-small text-muted-foreground">
              {pillar.body}
            </p>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
