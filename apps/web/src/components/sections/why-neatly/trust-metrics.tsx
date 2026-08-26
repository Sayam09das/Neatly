import type { ReactElement } from "react";
import { landingWhyNeatly } from "@/config/landing";

export function TrustMetrics(): ReactElement {
  return (
    <ul className="grid grid-cols-2 gap-grid lg:grid-cols-4" data-why-metrics>
      {landingWhyNeatly.metrics.map((metric) => {
        const isPending = metric.value === null;
        const displayValue = metric.value ?? "—";

        return (
          <li key={metric.label}>
            <p className="text-primary tracking-tight">
              <span
                aria-hidden={isPending}
                className={isPending ? "text-h1" : "text-display"}
              >
                {displayValue}
              </span>
              {isPending ? (
                <span className="sr-only">
                  {landingWhyNeatly.metricsPendingLabel}
                </span>
              ) : null}
            </p>
            <p className="mt-2 text-h4 text-foreground">{metric.label}</p>
            <p className="mt-2 max-w-xs text-caption text-muted-foreground">
              {metric.body}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
