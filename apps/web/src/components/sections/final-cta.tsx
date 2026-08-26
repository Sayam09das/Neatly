import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { landingCtas, landingFinalCta } from "@/config/landing";

export function FinalCta(): ReactElement {
  return (
    <section
      aria-labelledby={landingFinalCta.headingId}
      className="mx-auto w-full max-w-page px-gutter py-section"
      id="quote"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-display text-foreground tracking-tight"
          id={landingFinalCta.headingId}
        >
          {landingFinalCta.heading}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-body text-muted-foreground">
          {landingFinalCta.description}
        </p>
        <div className="mt-10">
          <Button asChild>
            <Link href={landingCtas.primary.href}>
              {landingCtas.primary.label}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
