import type { ReactElement } from "react";
import { landingTrustIndicators } from "@/config/landing";
import { TrustScene } from "./trust-scene";

export function TrustIndicators(): ReactElement {
  return (
    <section
      aria-labelledby={landingTrustIndicators.headingId}
      className="bg-muted/40"
      id="trust"
    >
      <TrustScene />
    </section>
  );
}
