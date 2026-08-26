import type { ReactElement } from "react";
import { BandCurve } from "@/components/sections/band-curve";
import { landingNewsletter } from "@/config/landing";
import { NewsletterScene } from "./newsletter-scene";

export function Newsletter(): ReactElement {
  return (
    <section
      aria-labelledby={landingNewsletter.headingId}
      className="relative overflow-x-hidden bg-secondary text-secondary-foreground"
      id="newsletter"
    >
      <BandCurve />
      <NewsletterScene />
    </section>
  );
}
