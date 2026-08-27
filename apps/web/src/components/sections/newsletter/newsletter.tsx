import type { ReactElement } from "react";
import { landingNewsletter } from "@/config/landing";
import { NewsletterScene } from "./newsletter-scene";

export function Newsletter(): ReactElement {
  return (
    <section
      aria-labelledby={landingNewsletter.headingId}
      className="relative text-secondary-foreground"
      id="newsletter"
    >
      <NewsletterScene />
    </section>
  );
}
