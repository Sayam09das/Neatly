"use client";

import { cn } from "@neatly/utils";
import { motion, type PanInfo } from "framer-motion";
import Image from "next/image";
import { type ReactElement, useEffect, useRef, useState } from "react";
import { durationSeconds } from "@/animations/config/durations";
import { easings } from "@/animations/config/easings";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { landingTestimonials } from "@/config/landing";
import {
  TESTIMONIAL_FRAME_HOLD_MS,
  TESTIMONIAL_NAV_REGION_LABEL,
  TESTIMONIAL_NEXT_PHOTO_LABEL,
  TESTIMONIAL_PREVIOUS_PHOTO_LABEL,
  TESTIMONIAL_SLIDE_X_PX,
  TESTIMONIAL_SWIPE_THRESHOLD_PX,
} from "./testimonial-animation";
import { TestimonialNavigation } from "./testimonial-navigation";

const frameTransition = {
  duration: durationSeconds.slow,
  ease: easings.standard.framer,
} as const;

export function ReservedTestimonials(): ReactElement {
  const slots = landingTestimonials.emptySlots;
  const lastIndex = slots.length - 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const [controlsPaused, setControlsPaused] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect((): (() => void) => {
    const nav = navRef.current;

    if (nav === null) {
      return (): void => undefined;
    }

    const pause = (): void => {
      setControlsPaused(true);
    };
    const resume = (): void => {
      setControlsPaused(false);
    };
    const resumeIfLeaving = (event: FocusEvent): void => {
      const next = event.relatedTarget;

      if (next instanceof Node && nav.contains(next)) {
        return;
      }

      resume();
    };

    nav.addEventListener("pointerenter", pause);
    nav.addEventListener("pointerleave", resume);
    nav.addEventListener("focusin", pause);
    nav.addEventListener("focusout", resumeIfLeaving);

    return (): void => {
      nav.removeEventListener("pointerenter", pause);
      nav.removeEventListener("pointerleave", resume);
      nav.removeEventListener("focusin", pause);
      nav.removeEventListener("focusout", resumeIfLeaving);
    };
  }, []);

  useEffect((): (() => void) | undefined => {
    if (prefersReducedMotion || controlsPaused || lastIndex < 1) {
      return undefined;
    }

    const intervalId = window.setInterval((): void => {
      setActiveIndex((index) => (index >= lastIndex ? 0 : index + 1));
    }, TESTIMONIAL_FRAME_HOLD_MS);

    return (): void => {
      window.clearInterval(intervalId);
    };
  }, [controlsPaused, lastIndex, prefersReducedMotion]);

  if (slots[0] === undefined) {
    throw new Error("Testimonials empty slots are missing.");
  }

  const showPrevious = (): void => {
    setActiveIndex(activeIndex <= 0 ? lastIndex : activeIndex - 1);
  };
  const showNext = (): void => {
    setActiveIndex(activeIndex >= lastIndex ? 0 : activeIndex + 1);
  };

  const onSwipe = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ): void => {
    if (prefersReducedMotion) {
      return;
    }

    if (Math.abs(info.offset.x) < Math.abs(info.offset.y)) {
      return;
    }

    if (info.offset.x <= -TESTIMONIAL_SWIPE_THRESHOLD_PX) {
      showNext();
      return;
    }

    if (info.offset.x >= TESTIMONIAL_SWIPE_THRESHOLD_PX) {
      showPrevious();
    }
  };

  return (
    <div className="grid gap-12">
      <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="w-full lg:col-span-7">
          <motion.figure
            className="relative m-0 aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted"
            data-lenis-prevent
            onPanEnd={onSwipe}
          >
            {slots.map((slot, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.div
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: prefersReducedMotion
                      ? 0
                      : isActive
                        ? 0
                        : index < activeIndex
                          ? -TESTIMONIAL_SLIDE_X_PX
                          : TESTIMONIAL_SLIDE_X_PX,
                  }}
                  aria-hidden={isActive ? undefined : true}
                  className={cn(
                    "absolute inset-0",
                    isActive ? "z-10" : "pointer-events-none z-0",
                  )}
                  initial={false}
                  key={slot.src}
                  transition={
                    prefersReducedMotion ? { duration: 0 } : frameTransition
                  }
                >
                  <Image
                    alt={isActive ? slot.alt : ""}
                    className="object-cover"
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    src={slot.src}
                    style={{ objectPosition: slot.objectPosition }}
                  />
                </motion.div>
              );
            })}
            <figcaption className="sr-only">
              {landingTestimonials.emptyMediaLabel}
            </figcaption>
          </motion.figure>
        </div>
        <div className="lg:col-span-5">
          <p className="max-w-prose text-h3 tracking-tight">
            {landingTestimonials.emptyMessage}
          </p>
          <p className="mt-8 text-label text-primary uppercase">
            {landingTestimonials.emptyAttribution}
          </p>
        </div>
      </article>
      <div ref={navRef}>
        <TestimonialNavigation
          activeIndex={activeIndex}
          count={slots.length}
          getSelectLabel={(label, paddedCount): string =>
            `Show photograph ${label} of ${paddedCount}`
          }
          nextLabel={TESTIMONIAL_NEXT_PHOTO_LABEL}
          onNext={showNext}
          onPrevious={showPrevious}
          onSelect={setActiveIndex}
          previousLabel={TESTIMONIAL_PREVIOUS_PHOTO_LABEL}
          regionLabel={TESTIMONIAL_NAV_REGION_LABEL}
        />
      </div>
    </div>
  );
}
