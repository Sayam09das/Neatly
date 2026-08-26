import type { ReactElement } from "react";
import { landingTrustIndicators } from "@/config/landing";
import { TrustScene } from "./trust-scene";

export function TrustIndicators(): ReactElement {
  return (
    <section
      aria-labelledby={landingTrustIndicators.headingId}
      className="mx-auto w-full max-w-page px-gutter py-section"
      id="trust"
    >
      <TrustScene />
    </section>
  );
}
