import type { ReactElement } from "react";
import { landingWhyNeatly } from "@/config/landing";
import { WhyFeatureItem } from "./why-feature-item";

export function WhyFeatureList(): ReactElement {
  return (
    <ol className="grid list-none border-border border-t border-l p-0 md:grid-cols-2">
      {landingWhyNeatly.features.map((feature) => (
        <WhyFeatureItem feature={feature} key={feature.index} />
      ))}
    </ol>
  );
}
