import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const PROCESS_STEP_COUNT = 3;
export const PROCESS_EYEBROW_Y_PX = 20;
export const PROCESS_HEADING_Y_PX = 40;
export const PROCESS_INTRO_Y_PX = 20;
export const PROCESS_STEP_Y_DESKTOP_PX = 40;
export const PROCESS_STEP_Y_MOBILE_PX = 20;
export const PROCESS_NUMBER_Y_PX = 15;
export const PROCESS_NUMBER_SCALE_FROM = 0.95;
export const PROCESS_DOT_INACTIVE_OPACITY = 0.4;
export const PROCESS_DOT_ACTIVE_SCALE = 1.08;
export const PROCESS_IMAGE_SCALE_FROM_DESKTOP = 1.08;
export const PROCESS_IMAGE_SCALE_FROM_MOBILE = 1.05;
export const PROCESS_DURATION_DESKTOP = 0.8;
export const PROCESS_DURATION_MOBILE = 0.55;
export const PROCESS_RULE_DURATION_RATIO = 0.5;
export const PROCESS_HEADER_STAGGER = 0.08;
export const PROCESS_STEP_STAGGER = 0.15;
export const PROCESS_PARALLAX_Y_PERCENT = 5;
export const PROCESS_PARALLAX_SCRUB = 0.55;
export const PROCESS_STORY_SCRUB = 0.55;
export const PROCESS_HOVER_LIFT_PX = 3;
export const PROCESS_HOVER_IMAGE_SCALE = 1.04;
export const PROCESS_TAP_SCALE = 0.99;
export const PROCESS_CLIP_HIDDEN = "inset(0 100% 0 0)";
export const PROCESS_CLIP_VISIBLE = "inset(0 0% 0 0)";
export const PROCESS_MOBILE_QUERY = "(max-width: 767px)";
export const PROCESS_FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
export const PROCESS_SCROLL_START = "top 72%";
export const PROCESS_STORY_END = "bottom 58%";
export const PROCESS_MOBILE_STEP_START = "top 82%";
export const PROCESS_HEADER_AT = 0;
export const PROCESS_INTRO_AT = 0.16;
export const PROCESS_STEPS_AT = 0.28;

export interface ProcessAnimationOptions {
  compact?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface ProcessAnimationResult {
  timeline: gsap.core.Timeline;
}

interface ProcessStepTargets {
  dot: HTMLElement | undefined;
  image: HTMLElement | undefined;
  mask: HTMLElement | undefined;
  number: HTMLElement | undefined;
  step: HTMLElement;
}

interface ProcessTargets {
  dots: Array<HTMLElement>;
  eyebrow: HTMLElement | null;
  heading: HTMLElement | null;
  intro: HTMLElement | null;
  progressLine: HTMLElement | null;
  rule: HTMLElement | null;
  steps: Array<ProcessStepTargets>;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function collectTargets(root: HTMLElement): ProcessTargets {
  const dots = queryAll(root, "[data-process-dot]");
  const steps = queryAll(root, "[data-process-step]").map((step, index) => ({
    dot: dots[index],
    image:
      step.querySelector<HTMLElement>("[data-process-image-reveal]") ??
      undefined,
    mask:
      step.querySelector<HTMLElement>("[data-process-image-mask]") ?? undefined,
    number:
      step.querySelector<HTMLElement>("[data-process-number]") ?? undefined,
    step,
  }));

  return {
    dots,
    eyebrow: root.querySelector<HTMLElement>("[data-process-eyebrow]"),
    heading: root.querySelector<HTMLElement>("[data-process-heading]"),
    intro: root.querySelector<HTMLElement>("[data-process-intro]"),
    progressLine: root.querySelector<HTMLElement>(
      "[data-process-progress-line]",
    ),
    rule: root.querySelector<HTMLElement>("[data-process-rule]"),
    steps,
  };
}

function setInitialStates(targets: ProcessTargets, compact: boolean): void {
  const stepY = compact ? PROCESS_STEP_Y_MOBILE_PX : PROCESS_STEP_Y_DESKTOP_PX;
  const imageScale = compact
    ? PROCESS_IMAGE_SCALE_FROM_MOBILE
    : PROCESS_IMAGE_SCALE_FROM_DESKTOP;

  if (targets.eyebrow !== null) {
    gsap.set(targets.eyebrow, { opacity: 0, y: PROCESS_EYEBROW_Y_PX });
  }

  if (targets.heading !== null) {
    gsap.set(targets.heading, { opacity: 0, y: PROCESS_HEADING_Y_PX });
  }

  if (targets.intro !== null) {
    gsap.set(targets.intro, { opacity: 0, y: PROCESS_INTRO_Y_PX });
  }

  if (targets.rule !== null) {
    gsap.set(targets.rule, { scaleX: 0, transformOrigin: "left center" });
  }

  if (!compact && targets.progressLine !== null) {
    gsap.set(targets.progressLine, {
      scaleX: 0,
      transformOrigin: "left center",
    });
  }

  for (const target of targets.steps) {
    gsap.set(target.step, { force3D: true, opacity: 0, y: stepY });

    if (target.number !== undefined) {
      gsap.set(target.number, {
        opacity: 0,
        scale: PROCESS_NUMBER_SCALE_FROM,
        y: PROCESS_NUMBER_Y_PX,
      });
    }

    if (target.dot !== undefined) {
      gsap.set(target.dot, {
        opacity: PROCESS_DOT_INACTIVE_OPACITY,
        scale: 1,
      });
    }

    if (target.image !== undefined) {
      gsap.set(target.image, { force3D: true, scale: imageScale });
    }

    if (!compact && target.mask !== undefined) {
      gsap.set(target.mask, { clipPath: PROCESS_CLIP_HIDDEN });
    }
  }
}

function createPausedTimeline(duration: number): gsap.core.Timeline {
  return gsap.timeline({
    defaults: {
      duration,
      ease: easings.enter.gsap,
    },
    paused: true,
  });
}

function addHeaderTweens(
  timeline: gsap.core.Timeline,
  targets: ProcessTargets,
  duration: number,
): void {
  if (targets.eyebrow !== null) {
    timeline.to(
      targets.eyebrow,
      { duration: duration * 0.75, opacity: 1, y: 0 },
      PROCESS_HEADER_AT,
    );
  }

  if (targets.heading !== null) {
    timeline.to(
      targets.heading,
      { opacity: 1, y: 0 },
      PROCESS_HEADER_AT + PROCESS_HEADER_STAGGER,
    );
  }

  if (targets.intro !== null) {
    timeline.to(
      targets.intro,
      { duration: duration * 0.75, opacity: 1, y: 0 },
      PROCESS_INTRO_AT,
    );
  }

  if (targets.rule !== null) {
    timeline.to(
      targets.rule,
      { duration: duration * PROCESS_RULE_DURATION_RATIO, scaleX: 1 },
      PROCESS_INTRO_AT,
    );
  }
}

function addStepTweens(
  timeline: gsap.core.Timeline,
  targets: ProcessTargets,
  compact: boolean,
  duration: number,
): void {
  const stepSpan =
    Math.max(targets.steps.length - 1, 0) * PROCESS_STEP_STAGGER + duration;

  if (!compact && targets.progressLine !== null && targets.steps.length > 0) {
    timeline.to(
      targets.progressLine,
      {
        duration: stepSpan,
        ease: "none",
        scaleX: 1,
      },
      PROCESS_STEPS_AT,
    );
  }

  for (const [index, target] of targets.steps.entries()) {
    const at = PROCESS_STEPS_AT + index * PROCESS_STEP_STAGGER;

    timeline.to(target.step, { opacity: 1, y: 0 }, at);

    if (target.number !== undefined) {
      timeline.to(target.number, { opacity: 1, scale: 1, y: 0 }, at);
    }

    if (target.dot !== undefined) {
      timeline.to(
        target.dot,
        { opacity: 1, scale: PROCESS_DOT_ACTIVE_SCALE },
        at,
      );

      if (index > 0) {
        const previousDot = targets.steps[index - 1]?.dot;

        if (previousDot !== undefined) {
          timeline.to(previousDot, { scale: 1 }, at);
        }
      }
    }

    if (!compact && target.mask !== undefined) {
      timeline.to(target.mask, { clipPath: PROCESS_CLIP_VISIBLE }, at);
    }

    if (target.image !== undefined) {
      timeline.to(target.image, { scale: 1 }, at);
    }
  }
}

function attachPlayTrigger(
  timeline: gsap.core.Timeline,
  trigger: HTMLElement,
  start: string,
): void {
  ScrollTrigger.create({
    animation: timeline,
    fastScrollEnd: true,
    invalidateOnRefresh: true,
    onRefresh: (self): void => {
      timeline.progress(self.scroll() >= self.start ? 1 : 0);
    },
    start,
    toggleActions: "play none none reverse",
    trigger,
  });
}

function createHeaderTimeline(
  targets: ProcessTargets,
  duration: number,
): gsap.core.Timeline {
  const timeline = createPausedTimeline(duration);
  addHeaderTweens(timeline, targets, duration);
  return timeline;
}

function createStoryTimeline(
  targets: ProcessTargets,
  compact: boolean,
): gsap.core.Timeline {
  const duration = compact ? PROCESS_DURATION_MOBILE : PROCESS_DURATION_DESKTOP;
  const timeline = createPausedTimeline(duration);
  addHeaderTweens(timeline, targets, duration);
  addStepTweens(timeline, targets, compact, duration);
  return timeline;
}

function createMobileStepTriggers(
  targets: ProcessTargets,
  duration: number,
): void {
  for (const target of targets.steps) {
    const stepTimeline = createPausedTimeline(duration);

    stepTimeline.to(target.step, { opacity: 1, y: 0 }, 0);

    if (target.number !== undefined) {
      stepTimeline.to(target.number, { opacity: 1, scale: 1, y: 0 }, 0);
    }

    if (target.image !== undefined) {
      stepTimeline.to(target.image, { scale: 1 }, 0);
    }

    attachPlayTrigger(stepTimeline, target.step, PROCESS_MOBILE_STEP_START);
  }
}

function createParallax(root: HTMLElement): void {
  const parallaxLayers = queryAll(root, "[data-process-image-parallax]");

  for (const layer of parallaxLayers) {
    gsap.fromTo(
      layer,
      { yPercent: -PROCESS_PARALLAX_Y_PERCENT },
      {
        ease: "none",
        scrollTrigger: {
          end: "bottom top",
          invalidateOnRefresh: true,
          scrub: PROCESS_PARALLAX_SCRUB,
          start: "top bottom",
          trigger: layer,
        },
        yPercent: PROCESS_PARALLAX_Y_PERCENT,
      },
    );
  }
}

export function createProcessAnimation(
  root: HTMLElement,
  options: ProcessAnimationOptions = {},
): ProcessAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableParallax = options.enableParallax ?? !compact;
  const targets = collectTargets(root);

  setInitialStates(targets, compact);

  if (enableScrollTrigger) {
    registerGsapPlugins(ScrollTrigger);
  }

  if (enableScrollTrigger && compact) {
    const header = root.querySelector<HTMLElement>("[data-process-header]");
    const headerTimeline = createHeaderTimeline(
      targets,
      PROCESS_DURATION_MOBILE,
    );

    attachPlayTrigger(headerTimeline, header ?? root, PROCESS_SCROLL_START);
    createMobileStepTriggers(targets, PROCESS_DURATION_MOBILE);

    if (enableParallax) {
      createParallax(root);
    }

    return { timeline: headerTimeline };
  }

  const timeline = createStoryTimeline(targets, compact);

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      end: PROCESS_STORY_END,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      scrub: PROCESS_STORY_SCRUB,
      start: PROCESS_SCROLL_START,
      trigger: root,
    });
  }

  if (enableParallax && enableScrollTrigger) {
    createParallax(root);
  }

  return { timeline };
}
