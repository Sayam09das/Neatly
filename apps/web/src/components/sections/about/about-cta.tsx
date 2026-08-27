import { Button } from "@neatly/ui";
import { cn } from "@neatly/utils";
import Link from "next/link";
import type { ReactElement } from "react";
import { BandCurve } from "@/components/sections/band-curve";
import { aboutCta } from "@/config/about";

export function AboutCta(): ReactElement {
  return (
    <section
      aria-labelledby={aboutCta.headingId}
      className="about-cta relative overflow-x-hidden bg-secondary text-secondary-foreground"
      data-final-cta
      id="about-quote"
    >
      <BandCurve />
      <div className="h-16 md:h-24 lg:h-28" />
      <div className="mx-auto max-w-page px-gutter py-section">
        <div className="mx-auto max-w-2xl py-8 text-center md:py-12">
          <p
            className="about-cta-eyebrow text-label text-accent uppercase"
            data-final-cta-eyebrow
          >
            {aboutCta.eyebrow}
          </p>
          <h2
            aria-label={aboutCta.heading}
            className="about-cta-heading mt-4 text-display tracking-tight"
            data-about-cta-heading
            data-final-cta-heading
            id={aboutCta.headingId}
          >
            {aboutCta.headingLines.map((line, index) => {
              const isAccent = index === aboutCta.headingLines.length - 1;

              return (
                <span
                  aria-hidden="true"
                  className={cn("block", isAccent && "text-accent")}
                  key={line}
                >
                  {line}
                </span>
              );
            })}
          </h2>
          <p
            className="about-cta-copy mx-auto mt-6 max-w-xl text-body text-secondary-foreground/80"
            data-about-cta-copy
            data-final-cta-copy
          >
            {aboutCta.description}
          </p>
          <div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            data-about-cta-actions
            data-final-cta-actions
          >
            <Button asChild className="uppercase">
              <Link data-final-cta-primary href={aboutCta.primaryHref}>
                {aboutCta.primaryLabel}
              </Link>
            </Button>
            <Link
              className="inline-flex min-h-touch items-center text-body-small text-secondary-foreground/80 underline-offset-4 transition-colors duration-normal ease-standard hover:text-secondary-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-final-cta-secondary
              href={aboutCta.secondaryHref}
            >
              {aboutCta.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
      <div className="h-16 md:h-24 lg:h-28" />
    </section>
  );
}
