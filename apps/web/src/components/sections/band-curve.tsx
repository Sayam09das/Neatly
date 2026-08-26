import type { ReactElement } from "react";

interface BandCurveProps {
  edges?: "both" | "bottom" | "top";
}

export function BandCurve({ edges = "both" }: BandCurveProps): ReactElement {
  const showTop = edges === "both" || edges === "top";
  const showBottom = edges === "both" || edges === "bottom";

  return (
    <>
      {showTop ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-base h-16 overflow-hidden md:h-24 lg:h-28"
        >
          <svg
            aria-hidden="true"
            className="h-full w-full text-background"
            preserveAspectRatio="none"
            viewBox="0 0 1440 120"
          >
            <path d="M0 0 V56 Q720 120 1440 56 V0 Z" fill="currentColor" />
          </svg>
        </div>
      ) : null}
      {showBottom ? (
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
      ) : null}
    </>
  );
}
