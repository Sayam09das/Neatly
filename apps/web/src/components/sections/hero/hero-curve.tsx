import type { ReactElement } from "react";

export function HeroCurve(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-base h-16 overflow-hidden md:h-24 lg:h-28"
    >
      <svg
        aria-hidden="true"
        className="h-full w-full text-background"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
      >
        <path d="M0 120 V64 Q720 0 1440 64 V120 Z" fill="currentColor" />
      </svg>
    </div>
  );
}
