import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const HERO_FRAME_COUNT = 4;
export const HERO_INITIAL_SCALE = 1;
export const HERO_HIDDEN_SCALE = 1.08;
export const HERO_CROSSFADE_START_SCALE = 1.03;
export const HERO_SEGMENT_DURATION = 0.25;
export const HERO_PIN_VIEWPORTS = 2.1;
export const HERO_SCRUB = 0.65;
export const HERO_PIN_ANTICIPATE = 1;

export const HERO_FRAME_ZOOM = [1.08, 1.1, 1.08, 1.05] as const;
export const HERO_FRAME_SHIFT_PERCENT = [-1.2, 1.3, -0.9, 0.4] as const;

export function createHeroFrameTimeline(
  frames: ReadonlyArray<HTMLElement>,
): gsap.core.Timeline {
  const timeline = gsap.timeline();

  frames.forEach((frame, index) => {
    gsap.set(frame, {
      autoAlpha: index === 0 ? 1 : 0,
      force3D: true,
      scale: index === 0 ? HERO_INITIAL_SCALE : HERO_HIDDEN_SCALE,
      xPercent: 0,
    });
  });

  frames.forEach((frame, index) => {
    const start = index * HERO_SEGMENT_DURATION;
    const zoom = HERO_FRAME_ZOOM[index];
    const shift = HERO_FRAME_SHIFT_PERCENT[index];

    if (index === 0) {
      timeline.to(
        frame,
        {
          duration: HERO_SEGMENT_DURATION,
          ease: "none",
          scale: zoom,
          xPercent: shift,
        },
        0,
      );
      return;
    }

    const previous = frames[index - 1];

    timeline.fromTo(
      frame,
      {
        autoAlpha: 0,
        scale: HERO_CROSSFADE_START_SCALE,
        xPercent: 0,
      },
      {
        autoAlpha: 1,
        duration: HERO_SEGMENT_DURATION,
        ease: "none",
        scale: zoom,
        xPercent: shift,
      },
      start,
    );

    if (previous !== undefined) {
      timeline.to(
        previous,
        {
          autoAlpha: 0,
          duration: HERO_SEGMENT_DURATION,
          ease: "none",
        },
        start,
      );
    }
  });

  return timeline;
}

export function createHeroScrollTrigger(
  pinTarget: HTMLElement,
  animation: gsap.core.Timeline,
): ScrollTrigger {
  return ScrollTrigger.create({
    animation,
    anticipatePin: HERO_PIN_ANTICIPATE,
    end: (): string =>
      `+=${Math.round(window.innerHeight * HERO_PIN_VIEWPORTS)}`,
    fastScrollEnd: true,
    invalidateOnRefresh: true,
    pin: pinTarget,
    pinSpacing: true,
    scrub: HERO_SCRUB,
    start: "top top",
    trigger: pinTarget,
  });
}
