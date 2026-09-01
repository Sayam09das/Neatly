import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { landingWhyNeatly } from "@/config/landing";
import { WhyFeatureArrow } from "./why-feature-icons";

export function WhyNeatlyCta(): ReactElement {
  return (
    <div
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
      data-why-cta
    >
      <Button asChild className="group min-h-touch">
        <Link href={landingWhyNeatly.primaryCta.href}>
          {landingWhyNeatly.primaryCta.label}
          <span className="inline-flex motion-safe:transition-transform motion-safe:duration-fast motion-safe:ease-standard motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1">
            <WhyFeatureArrow />
          </span>
        </Link>
      </Button>
      <Link
        className="inline-flex min-h-touch items-center text-body-small text-muted-foreground underline-offset-4 motion-safe:transition-colors motion-safe:duration-normal motion-safe:ease-standard hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href={landingWhyNeatly.secondaryCta.href}
      >
        {landingWhyNeatly.secondaryCta.label}
      </Link>
    </div>
  );
}
