import type { ReactElement } from "react";
import { landingServices } from "@/config/landing";
import { ServicesCurve } from "./services-curve";
import { ServicesScene } from "./services-scene";

export function ServicesSection(): ReactElement {
  return (
    <section
      aria-labelledby={landingServices.headingId}
      className="relative overflow-x-hidden bg-secondary text-secondary-foreground"
      id="services"
    >
      <ServicesCurve />
      <div className="h-16 md:h-24 lg:h-28" />
      <div className="mx-auto w-full max-w-page px-gutter py-section">
        <ServicesScene />
      </div>
      <div className="h-16 md:h-24 lg:h-28" />
    </section>
  );
}
