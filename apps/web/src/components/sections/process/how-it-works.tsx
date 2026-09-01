import type { ReactElement } from "react";
import { BandCurve } from "@/components/sections/band-curve";
import {
  LANDING_PROCESS_SECTION_ID,
  landingHowItWorks,
} from "@/config/landing";
import { ProcessScene } from "./process-scene";

interface HowItWorksProps {
  bandEdges?: "both" | "bottom" | "top";
  headingLevel?: "h1" | "h2";
  quotesHref?: string;
}

export function HowItWorks({
  bandEdges = "both",
  headingLevel = "h2",
  quotesHref,
}: HowItWorksProps): ReactElement {
  const showTop = bandEdges === "both" || bandEdges === "top";
  const showBottom = bandEdges === "both" || bandEdges === "bottom";

  return (
    <section
      aria-labelledby={landingHowItWorks.headingId}
      className="relative scroll-mt-20 overflow-x-hidden bg-secondary text-secondary-foreground"
      id={LANDING_PROCESS_SECTION_ID}
    >
      <BandCurve edges={bandEdges} />
      {showTop ? <div className="h-16 md:h-24 lg:h-28" /> : null}
      <ProcessScene headingLevel={headingLevel} quotesHref={quotesHref} />
      {showBottom ? <div className="h-16 md:h-24 lg:h-28" /> : null}
    </section>
  );
}
