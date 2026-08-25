import { cn } from "@neatly/utils";
import Image from "next/image";
import type { ReactElement } from "react";
import { landingHero } from "@/config/landing";

export function HeroBackground(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-base overflow-hidden"
      data-slot="hero-background"
    >
      <div className="absolute inset-0 bg-secondary">
        {landingHero.frames.map((frame, index) => (
          <div
            className="absolute inset-0 origin-center"
            data-hero-frame={String(index + 1)}
            key={frame.src}
            style={{
              opacity: index === 0 ? 1 : 0,
              zIndex: index + 1,
            }}
          >
            <Image
              alt=""
              className={cn("object-cover", frame.objectPositionClassName)}
              fill
              priority={index === 0}
              sizes="100vw"
              src={frame.src}
              {...(index === 0 ? {} : { loading: "eager" as const })}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-secondary/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 via-secondary/45 to-secondary/20" />
    </div>
  );
}
