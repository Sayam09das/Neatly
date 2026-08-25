import type { ReactElement } from "react";
import { LandingSection } from "@/components/landing-section";
import { landingHowItWorks } from "@/config/landing";

export function HowItWorks(): ReactElement {
  return (
    <LandingSection id="process" labelledBy={landingHowItWorks.headingId}>
      <h2
        className="text-h2 text-foreground tracking-tight"
        id={landingHowItWorks.headingId}
      >
        {landingHowItWorks.heading}
      </h2>
      <ol className="mt-8 grid gap-grid md:grid-cols-3">
        {landingHowItWorks.steps.map((step, index) => (
          <li key={step.title}>
            <p className="text-label text-muted-foreground">Step {index + 1}</p>
            <h3 className="mt-2 text-h4 text-foreground">{step.title}</h3>
            <p className="mt-2 text-body-small text-muted-foreground">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
}
