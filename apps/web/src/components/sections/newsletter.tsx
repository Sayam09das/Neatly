import { Button } from "@neatly/ui";
import type { ReactElement } from "react";
import { LandingSection } from "@/components/landing-section";
import { landingCtas, landingNewsletter } from "@/config/landing";

export function Newsletter(): ReactElement {
  return (
    <LandingSection id="newsletter" labelledBy={landingNewsletter.headingId}>
      <h2
        className="text-h2 text-foreground tracking-tight"
        id={landingNewsletter.headingId}
      >
        {landingNewsletter.heading}
      </h2>
      <p className="mt-4 max-w-content text-body text-muted-foreground">
        {landingNewsletter.description}
      </p>
      <form
        aria-describedby="newsletter-consent"
        className="mt-8 flex max-w-content flex-col gap-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label
            className="text-label text-foreground"
            htmlFor="newsletter-email"
          >
            {landingNewsletter.inputLabel}
          </label>
          <input
            autoComplete="email"
            className="mt-2 flex min-h-touch w-full rounded-sm border border-input bg-background px-3 py-2 text-body"
            disabled
            id="newsletter-email"
            name="email"
            placeholder="name@example.com"
            type="email"
          />
        </div>
        <Button disabled type="button">
          {landingCtas.subscribe.label}
        </Button>
      </form>
      <p
        className="mt-4 max-w-content text-body-small text-muted-foreground"
        id="newsletter-consent"
      >
        {landingNewsletter.consent}
      </p>
    </LandingSection>
  );
}
