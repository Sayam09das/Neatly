"use client";

import Image from "next/image";
import { type ReactElement, type ReactNode, useRef } from "react";
import { BandCurve } from "@/components/sections/band-curve";
import { landingNewsletter } from "@/config/landing";
import { useClosingBandAnimation } from "./use-closing-band-animation";

interface ClosingBandProps {
  children: ReactNode;
}

export function ClosingBand({ children }: ClosingBandProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useClosingBandAnimation({ rootRef });

  return (
    <div
      className="relative overflow-hidden bg-secondary text-secondary-foreground"
      ref={rootRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        data-closing-band-media
      >
        <div className="absolute inset-0" data-closing-band-parallax>
          <Image
            alt={landingNewsletter.image.alt}
            className="object-cover"
            fill
            sizes="100vw"
            src={landingNewsletter.image.src}
            style={{
              objectPosition: landingNewsletter.image.objectPosition,
            }}
          />
        </div>
        <div className="absolute inset-0 bg-secondary/80" />
      </div>
      <BandCurve edges="top" />
      <div className="relative z-base">{children}</div>
    </div>
  );
}
