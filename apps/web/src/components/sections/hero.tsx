import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { LandingSection } from "@/components/landing-section";
import { landingCtas, landingHero } from "@/config/landing";

export function Hero(): ReactElement {
  return (
    <LandingSection id="hero" labelledBy={landingHero.headingId}>
      <p className="text-label text-muted-foreground">{landingHero.eyebrow}</p>
      <h1
        className="mt-3 text-display text-foreground tracking-tight"
        id={landingHero.headingId}
      >
        {landingHero.heading}
      </h1>
      <p className="mt-4 max-w-content text-body text-muted-foreground">
        {landingHero.description}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href={landingCtas.primary.href}>
            {landingCtas.primary.label}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={landingCtas.secondary.href}>
            {landingCtas.secondary.label}
          </Link>
        </Button>
      </div>
      <ul className="mt-8 flex flex-col gap-2 text-body-small text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
        {landingHero.trustSignals.map((signal) => (
          <li key={signal}>{signal}</li>
        ))}
      </ul>
      <div className="mt-10 rounded-xl border border-border bg-muted p-6">
        <p className="text-body-small text-muted-foreground">
          Hero media slot ({landingHero.media.role}): {landingHero.media.alt}
        </p>
      </div>
    </LandingSection>
  );
}
