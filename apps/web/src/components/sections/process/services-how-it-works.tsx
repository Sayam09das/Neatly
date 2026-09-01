import type { ReactElement } from "react";
import { BandCurve } from "@/components/sections/band-curve";
import {
  LANDING_PROCESS_SECTION_ID,
  landingHowItWorks,
} from "@/config/landing";
import { ProcessScene } from "./process-scene";

interface ServicesHowItWorksProps {
  quotesHref?: string;
}

export function ServicesHowItWorks({
  quotesHref,
}: ServicesHowItWorksProps): ReactElement {
  return (
    <section
      aria-labelledby={landingHowItWorks.headingId}
      className="relative scroll-mt-20 overflow-x-hidden bg-secondary text-secondary-foreground"
      id={LANDING_PROCESS_SECTION_ID}
    >
      <BandCurve />
      <div className="h-16 md:h-24 lg:h-28" />
      <ProcessScene quotesHref={quotesHref} />
      <div className="h-16 md:h-24 lg:h-28" />
    </section>
  );
}
