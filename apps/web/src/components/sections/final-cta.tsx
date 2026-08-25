import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { LandingSection } from "@/components/landing-section";
import { landingCtas, landingFinalCta } from "@/config/landing";

export function FinalCta(): ReactElement {
  return (
    <LandingSection id="quote" labelledBy={landingFinalCta.headingId}>
      <h2
        className="text-h2 text-foreground tracking-tight"
        id={landingFinalCta.headingId}
      >
        {landingFinalCta.heading}
      </h2>
      <p className="mt-4 max-w-content text-body text-muted-foreground">
        {landingFinalCta.description}
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link href={landingCtas.primary.href}>
            {landingCtas.primary.label}
          </Link>
        </Button>
      </div>
    </LandingSection>
  );
}
