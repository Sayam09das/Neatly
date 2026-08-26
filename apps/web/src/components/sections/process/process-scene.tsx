"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { type ReactElement, useRef } from "react";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";
import { useGsap } from "@/animations/hooks/use-gsap";
import { landingHowItWorks } from "@/config/landing";

const PROCESS_HEADER_Y_PX = 20;
const PROCESS_STEP_Y_PX = 24;
const PROCESS_IMAGE_SCALE_FROM = 1.06;
const PROCESS_DURATION = 0.7;
const PROCESS_RULE_DURATION = 0.5;
const PROCESS_IMAGE_DURATION = 1.1;
const PROCESS_HEADER_STAGGER = 0.08;
const PROCESS_STEP_STAGGER = 0.12;
const PROCESS_SCROLL_START = "top 72%";

export function ProcessScene(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const root = rootRef.current;

      if (root === null) {
        return;
      }

      const header = Array.from(
        root.querySelectorAll<HTMLElement>("[data-process-header]"),
      );
      const rule = root.querySelector<HTMLElement>("[data-process-rule]");
      const steps = Array.from(
        root.querySelectorAll<HTMLElement>("[data-process-step]"),
      );
      const image = root.querySelector<HTMLElement>("[data-process-image]");

      registerGsapPlugins(ScrollTrigger);
      gsap.set(header, { opacity: 0, y: PROCESS_HEADER_Y_PX });
      gsap.set(steps, { opacity: 0, y: PROCESS_STEP_Y_PX });

      if (rule !== null) {
        gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      }

      if (image !== null) {
        gsap.set(image, { scale: PROCESS_IMAGE_SCALE_FROM });
      }

      const timeline = gsap.timeline({
        defaults: { duration: PROCESS_DURATION, ease: easings.enter.gsap },
        paused: true,
      });

      timeline.to(
        header,
        { opacity: 1, stagger: PROCESS_HEADER_STAGGER, y: 0 },
        0,
      );

      if (rule !== null) {
        timeline.to(rule, { duration: PROCESS_RULE_DURATION, scaleX: 1 }, 0.16);
      }

      timeline.to(
        steps,
        { opacity: 1, stagger: PROCESS_STEP_STAGGER, y: 0 },
        0.22,
      );

      if (image !== null) {
        timeline.to(image, { duration: PROCESS_IMAGE_DURATION, scale: 1 }, 0);
      }

      ScrollTrigger.create({
        animation: timeline,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onRefresh: (self): void => {
          timeline.progress(self.scroll() >= self.start ? 1 : 0);
        },
        start: PROCESS_SCROLL_START,
        toggleActions: "play none none reverse",
        trigger: root,
      });
    },
    { revertOnUpdate: true, scope: rootRef },
  );

  return (
    <div className="relative" ref={rootRef}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0" data-process-image>
          <Image
            alt={landingHowItWorks.image.alt}
            className="object-cover"
            fill
            sizes="100vw"
            src={landingHowItWorks.image.src}
            style={{ objectPosition: landingHowItWorks.image.objectPosition }}
          />
        </div>
        <div className="absolute inset-0 bg-secondary/80" />
      </div>
      <div className="relative mx-auto max-w-page px-gutter py-section">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-label text-accent uppercase" data-process-header>
            {landingHowItWorks.eyebrow}
          </p>
          <h2
            className="mt-4 text-display text-secondary-foreground tracking-tight"
            data-process-header
            id={landingHowItWorks.headingId}
          >
            {landingHowItWorks.heading}
          </h2>
          <p
            className="mx-auto mt-6 max-w-xl text-body text-secondary-foreground/80"
            data-process-header
          >
            {landingHowItWorks.intro}
          </p>
          <div
            aria-hidden="true"
            className="mx-auto mt-8 h-px w-24 origin-left bg-accent/70"
            data-process-rule
          />
        </div>
        <ol className="mt-16 grid gap-grid md:grid-cols-3">
          {landingHowItWorks.steps.map((step) => (
            <li data-process-step key={step.title}>
              <p className="text-label text-accent uppercase">{step.number}</p>
              <h3 className="mt-3 text-h3 text-secondary-foreground tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 text-body-small text-secondary-foreground/80">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
