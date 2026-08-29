"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactElement, useRef } from "react";
import { registerGsapPlugins } from "@/animations/gsap/plugins";
import { useGsap } from "@/animations/hooks/use-gsap";
import {
  createHeroFrameTimeline,
  createHeroScrollTrigger,
  HERO_FRAME_COUNT,
} from "@/components/sections/hero/hero-animation";
import { HeroBackground } from "@/components/sections/hero/hero-background";
import { HeroContent } from "@/components/sections/hero/hero-content";
import { HeroCurve } from "@/components/sections/hero/hero-curve";
import { QuoteForm } from "@/components/sections/hero/quote-form";
import { landingCtas, landingHero } from "@/config/landing";
import type { HomeCta } from "@/lib/customer/home";

interface HeroProps {
  secondaryAction?: HomeCta;
}

export function Hero({
  secondaryAction = {
    href: landingCtas.secondary.href,
    label: landingHero.secondaryActionLabel,
  },
}: HeroProps): ReactElement {
  const pinRef = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const pinTarget = pinRef.current;
      const frames = Array.from(
        pinTarget?.querySelectorAll<HTMLElement>("[data-hero-frame]") ?? [],
      );

      if (pinTarget === null || frames.length !== HERO_FRAME_COUNT) {
        return;
      }

      registerGsapPlugins(ScrollTrigger);
      createHeroScrollTrigger(pinTarget, createHeroFrameTimeline(frames));
    },
    { revertOnUpdate: true },
  );

  return (
    <section
      aria-labelledby={landingHero.headingId}
      className="relative -mt-16 overflow-x-hidden text-secondary-foreground"
      id="hero"
    >
      <div className="relative h-svh min-h-svh overflow-hidden" ref={pinRef}>
        <HeroBackground />
        <div className="relative z-base mx-auto flex h-full min-h-svh max-w-page flex-col justify-start px-gutter pt-24 pb-24 md:pt-28 md:pb-28 lg:justify-center lg:pt-28 lg:pb-32 xl:pt-32">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)] lg:items-center lg:gap-12 xl:gap-16">
            <HeroContent secondaryAction={secondaryAction} />
            <div className="hidden lg:block">
              <QuoteForm />
            </div>
          </div>
        </div>
        <HeroCurve />
      </div>
      <div className="relative z-base bg-background px-gutter py-10 lg:hidden">
        <QuoteForm />
      </div>
    </section>
  );
}
