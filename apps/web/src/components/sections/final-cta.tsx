import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { landingCtas, landingFinalCta } from "@/config/landing";
import type { HomeCta } from "@/lib/customer/home";

interface FinalCtaProps {
  accountCta?: HomeCta | null;
}

export function FinalCta({ accountCta = null }: FinalCtaProps): ReactElement {
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
        <div className="mt-10 flex flex-col items-center gap-4">
          <Button asChild>
            <Link href={landingCtas.primary.href}>
              {landingCtas.primary.label}
            </Link>
          </Button>
          {accountCta === null ? null : (
            <Link
              className="inline-flex min-h-touch items-center text-body-small text-muted-foreground underline-offset-4 transition-colors duration-normal ease-standard hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={accountCta.href}
            >
              {accountCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
