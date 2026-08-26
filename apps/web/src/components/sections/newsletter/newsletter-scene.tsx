"use client";

import { Button, Input, Label } from "@neatly/ui";
import Image from "next/image";
import { type FormEvent, type ReactElement, useRef } from "react";
import { HeadingAccent } from "@/components/sections/heading-accent";
import { landingCtas, landingNewsletter } from "@/config/landing";
import { useNewsletterAnimation } from "./use-newsletter-animation";

function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>): void {
  event.preventDefault();
}

export function NewsletterScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useNewsletterAnimation({ rootRef });

  return (
    <div className="relative" ref={rootRef}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        data-newsletter-media
      >
        <div className="absolute inset-0" data-newsletter-parallax>
          <Image
            alt={landingNewsletter.image.alt}
            className="object-cover"
            fill
            sizes="100vw"
            src={landingNewsletter.image.src}
            style={{ objectPosition: landingNewsletter.image.objectPosition }}
          />
        </div>
        <div className="absolute inset-0 bg-secondary/80" />
      </div>
      <div className="relative">
        <div className="h-16 md:h-24 lg:h-28" />
        <div className="mx-auto w-full max-w-page px-gutter py-section">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="text-label text-accent uppercase"
              data-newsletter-eyebrow
            >
              {landingNewsletter.eyebrow}
            </p>
            <h2
              className="mt-4 text-display text-secondary-foreground tracking-tight"
              data-newsletter-heading
              id={landingNewsletter.headingId}
            >
              {landingNewsletter.headingLead}{" "}
              <span className="relative inline-block text-accent">
                {landingNewsletter.headingEmphasis}
                <HeadingAccent className="pointer-events-none absolute -bottom-1 left-0 h-3 w-full text-accent" />
              </span>
            </h2>
            <p
              className="mx-auto mt-6 max-w-xl text-body text-secondary-foreground/80"
              data-newsletter-intro
            >
              {landingNewsletter.description}
            </p>
          </div>
          <form
            aria-describedby="newsletter-consent newsletter-unavailable"
            className="mx-auto mt-10 w-full max-w-2xl"
            data-newsletter-form
            noValidate
            onSubmit={handleNewsletterSubmit}
          >
            <Label
              className="text-secondary-foreground"
              htmlFor="newsletter-email"
            >
              {landingNewsletter.inputLabel}
            </Label>
            <div className="mt-3 flex flex-col gap-2 rounded-xl bg-background p-2 sm:flex-row sm:items-center sm:rounded-full sm:p-1.5">
              <Input
                autoComplete="email"
                className="min-h-touch flex-1 border-0 bg-transparent shadow-none focus-visible:ring-offset-background sm:px-5"
                disabled
                id="newsletter-email"
                name="email"
                placeholder="name@example.com"
                type="email"
              />
              <Button className="w-full sm:w-auto" disabled type="submit">
                {landingCtas.subscribe.label}
              </Button>
            </div>
          </form>
          <div
            className="mx-auto mt-4 max-w-xl text-center"
            data-newsletter-consent
          >
            <p
              className="text-body-small text-secondary-foreground/80"
              id="newsletter-consent"
            >
              {landingNewsletter.consent}
            </p>
            <p
              className="mt-2 text-body-small text-secondary-foreground/70"
              id="newsletter-unavailable"
            >
              {landingNewsletter.unavailableMessage}
            </p>
          </div>
        </div>
        <div className="h-16 md:h-24 lg:h-28" />
      </div>
    </div>
  );
}
