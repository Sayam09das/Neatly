import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { LandingSection } from "@/components/landing-section";
import { landingCtas, landingServices } from "@/config/landing";

export function ServicesSummary(): ReactElement {
  return (
    <LandingSection id="services" labelledBy={landingServices.headingId}>
      <h2
        className="text-h2 text-foreground tracking-tight"
        id={landingServices.headingId}
      >
        {landingServices.heading}
      </h2>
      <p className="mt-4 max-w-content text-body text-muted-foreground">
        {landingServices.intro}
      </p>
      <ul className="mt-8 grid gap-grid md:grid-cols-2">
        {landingServices.items.map((item) => (
          <li
            className="rounded-lg border border-border bg-surface p-6"
            key={item.name}
          >
            <h3 className="text-h3 text-foreground">{item.name}</h3>
            <p className="mt-2 text-body-small text-muted-foreground">
              {item.summary}
            </p>
            <p className="mt-4">
              <Link
                className="inline-flex min-h-touch items-center text-body-small text-primary underline-offset-4 hover:underline"
                href={item.href}
              >
                View services
              </Link>
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href={landingCtas.secondary.href}>
            {landingCtas.secondary.label}
          </Link>
        </Button>
      </div>
    </LandingSection>
  );
}
