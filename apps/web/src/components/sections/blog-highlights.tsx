import { Button } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import { LandingSection } from "@/components/landing-section";
import { landingBlogHighlights, landingCtas } from "@/config/landing";

export function BlogHighlights(): ReactElement {
  return (
    <LandingSection id="journal" labelledBy={landingBlogHighlights.headingId}>
      <h2
        className="text-h2 text-foreground tracking-tight"
        id={landingBlogHighlights.headingId}
      >
        {landingBlogHighlights.heading}
      </h2>
      <p className="mt-4 max-w-content text-body text-muted-foreground">
        {landingBlogHighlights.emptyMessage}
      </p>
      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href={landingCtas.readJournal.href}>
            {landingCtas.readJournal.label}
          </Link>
        </Button>
      </div>
    </LandingSection>
  );
}
