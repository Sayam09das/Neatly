import type { ReactElement } from "react";
import { landingWhyNeatly } from "@/config/landing";
import { WhyMetricCard } from "./why-metric-card";

export function TrustMetrics(): ReactElement {
  return (
    <ul className="grid grid-cols-2 gap-grid lg:grid-cols-4" data-why-metrics>
      {landingWhyNeatly.metrics.map((metric) => (
        <li data-why-metric-item key={metric.label}>
          <WhyMetricCard
            metric={metric}
            pendingSrLabel={landingWhyNeatly.metricsPendingLabel}
            pendingValue={landingWhyNeatly.metricsPendingValue}
          />
        </li>
      ))}
    </ul>
  );
}
