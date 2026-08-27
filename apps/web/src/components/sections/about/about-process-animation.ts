import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const ABOUT_PROCESS_STEP_COUNT = 4;
export const ABOUT_PROCESS_HEADER_Y_PX = 24;
export const ABOUT_PROCESS_STEP_Y_PX = 32;
export const ABOUT_PROCESS_STEP_Y_MOBILE_PX = 20;
export const ABOUT_PROCESS_IMAGE_SCALE_FROM = 1.06;
export const ABOUT_PROCESS_IMAGE_SCALE_MOBILE = 1.04;
export const ABOUT_PROCESS_DURATION = 0.75;
export const ABOUT_PROCESS_DURATION_MOBILE = 0.55;
export const ABOUT_PROCESS_STAGGER = 0.14;
export const ABOUT_PROCESS_CLIP_HIDDEN = "inset(0 100% 0 0)";
export const ABOUT_PROCESS_CLIP_VISIBLE = "inset(0 0% 0 0)";
export const ABOUT_PROCESS_SCROLL_START = "top 72%";
export const ABOUT_PROCESS_STORY_END = "bottom 50%";
export const ABOUT_PROCESS_STORY_SCRUB = 0.55;
export const ABOUT_PROCESS_ITEM_START = "top 82%";
export const ABOUT_PROCESS_HOVER_LIFT_PX = 2;
export const ABOUT_PROCESS_FINE_POINTER_QUERY =
  "(hover: hover) and (pointer: fine)";

export interface AboutProcessAnimationOptions {
  compact?: boolean;
  enableClipPath?: boolean;
  enableScrollTrigger?: boolean;
}

export interface AboutProcessAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createAboutProcessAnimation(
  root: HTMLElement,
  options: AboutProcessAnimationOptions = {},
): AboutProcessAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableClipPath = options.enableClipPath ?? !compact;
  const duration = compact
    ? ABOUT_PROCESS_DURATION_MOBILE
    : ABOUT_PROCESS_DURATION;
  const stepY = compact
    ? ABOUT_PROCESS_STEP_Y_MOBILE_PX
    : ABOUT_PROCESS_STEP_Y_PX;
  const imageScale = compact
    ? ABOUT_PROCESS_IMAGE_SCALE_MOBILE
    : ABOUT_PROCESS_IMAGE_SCALE_FROM;
  const headerItems = queryAll(root, "[data-about-process-header]");
  const steps = queryAll(root, "[data-about-process-step]");
  const progressLine = root.querySelector<HTMLElement>(
    "[data-about-process-progress]",
  );

  gsap.set(headerItems, { opacity: 0, y: ABOUT_PROCESS_HEADER_Y_PX });

  if (progressLine !== null && !compact) {
    gsap.set(progressLine, { scaleX: 0, transformOrigin: "left center" });
  }

  for (const step of steps) {
    gsap.set(step, { opacity: 0, y: stepY });
    const mask = step.querySelector<HTMLElement>("[data-about-process-mask]");
    const image = step.querySelector<HTMLElement>("[data-about-process-image]");

    if (mask !== null && enableClipPath) {
      gsap.set(mask, { clipPath: ABOUT_PROCESS_CLIP_HIDDEN });
    }

    if (image !== null) {
      gsap.set(image, { force3D: true, scale: imageScale });
    }
  }

  if (enableScrollTrigger) {
    registerGsapPlugins(ScrollTrigger);
  }

  const timeline = gsap.timeline({
    defaults: {
      duration,
      ease: easings.enter.gsap,
    },
    paused: true,
  });

  timeline.to(headerItems, { opacity: 1, stagger: 0.08, y: 0 }, 0);

  if (enableScrollTrigger && compact) {
    const header = root.querySelector<HTMLElement>(
      "[data-about-process-header-block]",
    );

    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        timeline.progress(self.scroll() >= self.start ? 1 : 0);
      },
      start: ABOUT_PROCESS_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: header ?? root,
    });

    for (const step of steps) {
      const stepTimeline = gsap.timeline({
        defaults: { duration, ease: easings.enter.gsap },
        paused: true,
      });
      stepTimeline.to(step, { opacity: 1, y: 0 }, 0);
      const image = step.querySelector<HTMLElement>(
        "[data-about-process-image]",
      );

      if (image !== null) {
        stepTimeline.to(image, { scale: 1 }, 0);
      }

      ScrollTrigger.create({
        animation: stepTimeline,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onRefresh: (self): void => {
          stepTimeline.progress(self.scroll() >= self.start ? 1 : 0);
        },
        start: ABOUT_PROCESS_ITEM_START,
        toggleActions: "play none none reverse",
        trigger: step,
      });
    }

    return { timeline };
  }

  const stepSpan =
    Math.max(steps.length - 1, 0) * ABOUT_PROCESS_STAGGER + duration;

  if (progressLine !== null) {
    timeline.to(
      progressLine,
      { duration: stepSpan, ease: "none", scaleX: 1 },
      0.2,
    );
  }

  for (const [index, step] of steps.entries()) {
    const at = 0.2 + index * ABOUT_PROCESS_STAGGER;
    timeline.to(step, { opacity: 1, y: 0 }, at);

    const mask = step.querySelector<HTMLElement>("[data-about-process-mask]");
    const image = step.querySelector<HTMLElement>("[data-about-process-image]");

    if (mask !== null && enableClipPath) {
      timeline.to(mask, { clipPath: ABOUT_PROCESS_CLIP_VISIBLE }, at);
    }

    if (image !== null) {
      timeline.to(image, { scale: 1 }, at);
    }
  }

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      end: ABOUT_PROCESS_STORY_END,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      scrub: ABOUT_PROCESS_STORY_SCRUB,
      start: ABOUT_PROCESS_SCROLL_START,
      trigger: root,
    });
  }

  return { timeline };
}
