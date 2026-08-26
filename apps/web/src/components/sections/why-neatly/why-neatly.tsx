import type { ReactElement } from "react";
import { LandingSection } from "@/components/landing-section";
import { landingWhyNeatly } from "@/config/landing";
import { WhyNeatlyScene } from "./why-neatly-scene";

export function WhyNeatly(): ReactElement {
  return (
    <LandingSection id="why" labelledBy={landingWhyNeatly.headingId}>
      <WhyNeatlyScene />
    </LandingSection>
  );
}
