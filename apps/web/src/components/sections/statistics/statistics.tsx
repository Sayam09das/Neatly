import type { ReactElement } from "react";
import { landingStatistics } from "@/config/landing";
import { StatisticsScene } from "./statistics-scene";

export function Statistics(): ReactElement {
  return (
    <section
      aria-labelledby={landingStatistics.headingId}
      className="mx-auto w-full max-w-page px-gutter py-section"
      id="statistics"
    >
      <StatisticsScene />
    </section>
  );
}
