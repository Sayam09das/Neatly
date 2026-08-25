import type { ReactElement } from "react";
import { LandingSection } from "@/components/landing-section";
import { landingTrustIndicators } from "@/config/landing";

export function TrustIndicators(): ReactElement {
  return (
    <LandingSection id="trust" labelledBy={landingTrustIndicators.headingId}>
      <h2
        className="text-h2 text-foreground tracking-tight"
        id={landingTrustIndicators.headingId}
      >
        {landingTrustIndicators.heading}
      </h2>
      <ul className="mt-8 grid gap-grid md:grid-cols-2 lg:grid-cols-4">
        {landingTrustIndicators.items.map((item) => (
          <li key={item.title}>
            <h3 className="text-h4 text-foreground">{item.title}</h3>
            <p className="mt-2 text-body-small text-muted-foreground">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
