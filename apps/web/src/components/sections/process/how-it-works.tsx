import type { ReactElement } from "react";
import { BandCurve } from "@/components/sections/band-curve";
import { landingHowItWorks } from "@/config/landing";
import { ProcessScene } from "./process-scene";

export function HowItWorks(): ReactElement {
  return (
    <section
      aria-labelledby={landingHowItWorks.headingId}
      className="relative overflow-x-hidden bg-secondary text-secondary-foreground"
      id="process"
    >
      <BandCurve />
      <div className="h-16 md:h-24 lg:h-28" />
      <ProcessScene />
      <div className="h-16 md:h-24 lg:h-28" />
    </section>
  );
}
