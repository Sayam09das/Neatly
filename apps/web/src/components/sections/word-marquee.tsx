"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactElement, useRef } from "react";
import { registerGsapPlugins } from "@/animations/gsap/plugins";
import { useGsap } from "@/animations/hooks/use-gsap";
import { landingMarquee } from "@/config/landing";

export function WordMarquee(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const root = rootRef.current;

      if (root === null) {
        return;
      }

      const track = root.querySelector<HTMLElement>("[data-marquee-track]");

      if (track === null) {
        return;
      }

      registerGsapPlugins(ScrollTrigger);
      gsap.fromTo(
        track,
        { xPercent: 0 },
        {
          ease: "none",
          scrollTrigger: {
            end: "bottom top",
            invalidateOnRefresh: true,
            scrub: 0.85,
            start: "top bottom",
            trigger: root,
          },
          xPercent: -50,
        },
      );
    },
    { revertOnUpdate: true, scope: rootRef },
  );

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden py-8 md:py-12"
      ref={rootRef}
    >
      <div className="flex w-max gap-10 md:gap-16" data-marquee-track>
        {(["lead", "loop"] as const).map((copy) => (
          <span className="flex gap-10 md:gap-16" key={copy}>
            {landingMarquee.words.map((word) => (
              <span
                className="text-display whitespace-nowrap text-muted-foreground/20 uppercase"
                key={`${copy}-${word}`}
              >
                {word}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
