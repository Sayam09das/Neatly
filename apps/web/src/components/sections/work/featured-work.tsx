import type { ReactElement } from "react";
import { landingFeaturedWork } from "@/config/landing";
import { WorkScene } from "./work-scene";

export function FeaturedWork(): ReactElement {
  return (
    <section
      aria-labelledby={landingFeaturedWork.headingId}
      className="w-full overflow-x-hidden py-section"
      id="work"
    >
      <WorkScene />
    </section>
  );
}
