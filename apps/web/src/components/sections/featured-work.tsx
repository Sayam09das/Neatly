import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { LandingSection } from "@/components/landing-section";
import { landingCtas, landingFeaturedWork } from "@/config/landing";

export function FeaturedWork(): ReactElement {
  return (
    <LandingSection id="work" labelledBy={landingFeaturedWork.headingId}>
      <h2
        className="text-h2 text-foreground tracking-tight"
        id={landingFeaturedWork.headingId}
      >
        {landingFeaturedWork.heading}
      </h2>
      <p className="mt-4 max-w-content text-body text-muted-foreground">
        {landingFeaturedWork.emptyMessage}
      </p>
      <div className="mt-8 rounded-xl border border-border bg-muted p-6">
        <p className="text-body-small text-muted-foreground">
          Media slot ({landingFeaturedWork.mediaRole}): before-and-after pair
          reserved for Next.js Image. No stock assets in this step.
        </p>
      </div>
      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href={landingCtas.viewWork.href}>
            {landingCtas.viewWork.label}
          </Link>
        </Button>
      </div>
    </LandingSection>
  );
}
