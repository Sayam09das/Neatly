import type { ReactElement } from "react";
import { landingFeaturedWork } from "@/config/landing";
import { WorkScene } from "./work-scene";

export function FeaturedWork(): ReactElement {
  return (
    <section
      aria-labelledby={landingFeaturedWork.headingId}
      className="mx-auto w-full max-w-page px-gutter py-section"
      id="work"
    >
      <WorkScene />
    </section>
  );
}
