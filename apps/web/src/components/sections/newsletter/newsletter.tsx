import { Button, Input, Label } from "@neatly/ui";
import Image from "next/image";
import type { ReactElement } from "react";
import { BandCurve } from "@/components/sections/band-curve";
import { landingCtas, landingNewsletter } from "@/config/landing";

export function Newsletter(): ReactElement {
  return (
    <section
      aria-labelledby={landingNewsletter.headingId}
      className="relative overflow-x-hidden bg-secondary text-secondary-foreground"
      id="newsletter"
    >
      <BandCurve />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          alt={landingNewsletter.image.alt}
          className="object-cover"
          fill
          sizes="100vw"
          src={landingNewsletter.image.src}
          style={{ objectPosition: landingNewsletter.image.objectPosition }}
        />
        <div className="absolute inset-0 bg-secondary/80" />
      </div>
      <div className="relative">
        <div className="h-16 md:h-24 lg:h-28" />
        <div className="mx-auto w-full max-w-page px-gutter py-section">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="text-display text-secondary-foreground tracking-tight"
              id={landingNewsletter.headingId}
            >
              {landingNewsletter.heading}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-body text-secondary-foreground/80">
              {landingNewsletter.description}
            </p>
          </div>
          <form
            aria-describedby="newsletter-consent newsletter-unavailable"
            className="mx-auto mt-10 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <Label
                className="text-secondary-foreground"
                htmlFor="newsletter-email"
              >
                {landingNewsletter.inputLabel}
              </Label>
              <Input
                autoComplete="email"
                className="mt-2 border-secondary-foreground/30 bg-secondary/40 text-secondary-foreground placeholder:text-secondary-foreground/50 focus-visible:ring-offset-secondary"
                disabled
                id="newsletter-email"
                name="email"
                placeholder="name@example.com"
                type="email"
              />
            </div>
            <Button disabled type="submit">
              {landingCtas.subscribe.label}
            </Button>
          </form>
          <p
            className="mx-auto mt-4 max-w-xl text-center text-body-small text-secondary-foreground/80"
            id="newsletter-consent"
          >
            {landingNewsletter.consent}
          </p>
          <p
            className="mx-auto mt-2 max-w-xl text-center text-body-small text-secondary-foreground/70"
            id="newsletter-unavailable"
          >
            {landingNewsletter.unavailableMessage}
          </p>
        </div>
        <div className="h-16 md:h-24 lg:h-28" />
      </div>
    </section>
  );
}
