import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const JOURNAL_SLOT_COUNT = 3;
export const JOURNAL_EYEBROW_Y_PX = 20;
export const JOURNAL_HEADING_Y_PX = 36;
export const JOURNAL_INTRO_Y_PX = 20;
export const JOURNAL_FEATURED_Y_PX = 28;
export const JOURNAL_SLOT_Y_DESKTOP_PX = 24;
export const JOURNAL_SLOT_Y_MOBILE_PX = 16;
export const JOURNAL_CTA_Y_PX = 16;
export const JOURNAL_IMAGE_SCALE_FROM_DESKTOP = 1.08;
export const JOURNAL_IMAGE_SCALE_FROM_MOBILE = 1.04;
export const JOURNAL_DURATION_DESKTOP = 0.75;
export const JOURNAL_DURATION_MOBILE = 0.55;
export const JOURNAL_HEADER_STAGGER = 0.08;
export const JOURNAL_SLOT_STAGGER = 0.1;
export const JOURNAL_PARALLAX_Y_PERCENT = 4;
export const JOURNAL_PARALLAX_SCRUB = 0.55;
export const JOURNAL_STORY_SCRUB = 0.55;
export const JOURNAL_HOVER_LIFT_PX = 4;
export const JOURNAL_HOVER_IMAGE_SCALE = 1.04;
export const JOURNAL_TAP_SCALE = 0.99;
export const JOURNAL_CLIP_HIDDEN = "inset(0 100% 0 0)";
export const JOURNAL_CLIP_VISIBLE = "inset(0 0% 0 0)";
export const JOURNAL_MOBILE_QUERY = "(max-width: 767px)";
export const JOURNAL_FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
export const JOURNAL_SCROLL_START = "top 78%";
export const JOURNAL_STORY_END = "bottom 62%";
export const JOURNAL_HEADER_AT = 0;
export const JOURNAL_INTRO_AT = 0.14;
export const JOURNAL_FEATURED_AT = 0.26;
export const JOURNAL_SLOTS_AT = 0.4;
export const JOURNAL_CTA_AT = 0.72;

export interface JournalAnimationOptions {
  compact?: boolean;
  enableClipPath?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface JournalAnimationResult {
  timeline: gsap.core.Timeline;
}

interface JournalSlotTargets {
  mask: HTMLElement | undefined;
  reveal: HTMLElement | undefined;
  slot: HTMLElement;
}

interface JournalTargets {
  cta: HTMLElement | null;
  eyebrow: HTMLElement | null;
  featured: HTMLElement | null;
  featuredMask: HTMLElement | null;
  featuredParallax: HTMLElement | null;
  featuredReveal: HTMLElement | null;
  heading: HTMLElement | null;
  intro: HTMLElement | null;
  slots: Array<JournalSlotTargets>;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function collectTargets(root: HTMLElement): JournalTargets {
  const slots = queryAll(root, "[data-journal-slot]").map((slot) => ({
    mask:
      slot.querySelector<HTMLElement>("[data-journal-slot-mask]") ?? undefined,
    reveal:
      slot.querySelector<HTMLElement>("[data-journal-slot-reveal]") ??
      undefined,
    slot,
  }));

  return {
    cta: root.querySelector<HTMLElement>("[data-journal-cta]"),
    eyebrow: root.querySelector<HTMLElement>("[data-journal-eyebrow]"),
    featured: root.querySelector<HTMLElement>("[data-journal-featured]"),
    featuredMask: root.querySelector<HTMLElement>(
      "[data-journal-featured-mask]",
    ),
    featuredParallax: root.querySelector<HTMLElement>(
      "[data-journal-featured-parallax]",
    ),
    featuredReveal: root.querySelector<HTMLElement>(
      "[data-journal-featured-reveal]",
    ),
    heading: root.querySelector<HTMLElement>("[data-journal-heading]"),
    intro: root.querySelector<HTMLElement>("[data-journal-intro]"),
    slots,
  };
}

function setInitialStates(
  targets: JournalTargets,
  compact: boolean,
  enableClipPath: boolean,
): void {
  const slotY = compact ? JOURNAL_SLOT_Y_MOBILE_PX : JOURNAL_SLOT_Y_DESKTOP_PX;
  const imageScale = compact
    ? JOURNAL_IMAGE_SCALE_FROM_MOBILE
    : JOURNAL_IMAGE_SCALE_FROM_DESKTOP;

  if (targets.eyebrow !== null) {
    gsap.set(targets.eyebrow, { opacity: 0, y: JOURNAL_EYEBROW_Y_PX });
  }

  if (targets.heading !== null) {
    gsap.set(targets.heading, { opacity: 0, y: JOURNAL_HEADING_Y_PX });
  }

  if (targets.intro !== null) {
    gsap.set(targets.intro, { opacity: 0, y: JOURNAL_INTRO_Y_PX });
  }

  if (targets.featured !== null) {
    gsap.set(targets.featured, { opacity: 0, y: JOURNAL_FEATURED_Y_PX });
  }

  if (targets.featuredReveal !== null) {
    gsap.set(targets.featuredReveal, { force3D: true, scale: imageScale });
  }

  if (enableClipPath && targets.featuredMask !== null) {
    gsap.set(targets.featuredMask, { clipPath: JOURNAL_CLIP_HIDDEN });
  }

  for (const target of targets.slots) {
    gsap.set(target.slot, { force3D: true, opacity: 0, y: slotY });

    if (target.reveal !== undefined) {
      gsap.set(target.reveal, { force3D: true, scale: imageScale });
    }

    if (enableClipPath && target.mask !== undefined) {
      gsap.set(target.mask, { clipPath: JOURNAL_CLIP_HIDDEN });
    }
  }

  if (targets.cta !== null) {
    gsap.set(targets.cta, { opacity: 0, y: JOURNAL_CTA_Y_PX });
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

function addStoryTweens(
  timeline: gsap.core.Timeline,
  targets: JournalTargets,
  enableClipPath: boolean,
  duration: number,
): void {
  if (targets.eyebrow !== null) {
    timeline.to(
      targets.eyebrow,
      { duration: duration * 0.75, opacity: 1, y: 0 },
      JOURNAL_HEADER_AT,
    );
  }

  if (targets.heading !== null) {
    timeline.to(
      targets.heading,
      { opacity: 1, y: 0 },
      JOURNAL_HEADER_AT + JOURNAL_HEADER_STAGGER,
    );
  }

  if (targets.intro !== null) {
    timeline.to(
      targets.intro,
      { duration: duration * 0.75, opacity: 1, y: 0 },
      JOURNAL_INTRO_AT,
    );
  }

  if (targets.featured !== null) {
    timeline.to(targets.featured, { opacity: 1, y: 0 }, JOURNAL_FEATURED_AT);
  }

  if (enableClipPath && targets.featuredMask !== null) {
    timeline.to(
      targets.featuredMask,
      { clipPath: JOURNAL_CLIP_VISIBLE },
      JOURNAL_FEATURED_AT,
    );
  }

  if (targets.featuredReveal !== null) {
    timeline.to(targets.featuredReveal, { scale: 1 }, JOURNAL_FEATURED_AT);
  }

  for (const [index, target] of targets.slots.entries()) {
    const at = JOURNAL_SLOTS_AT + index * JOURNAL_SLOT_STAGGER;

    timeline.to(target.slot, { opacity: 1, y: 0 }, at);

    if (enableClipPath && target.mask !== undefined) {
      timeline.to(target.mask, { clipPath: JOURNAL_CLIP_VISIBLE }, at);
    }

    if (target.reveal !== undefined) {
      timeline.to(target.reveal, { scale: 1 }, at);
    }
  }

  if (targets.cta !== null) {
    timeline.to(targets.cta, { opacity: 1, y: 0 }, JOURNAL_CTA_AT);
  }
}

function createParallax(targets: JournalTargets): void {
  if (targets.featuredParallax === null) {
    return;
  }

  gsap.fromTo(
    targets.featuredParallax,
    { yPercent: -JOURNAL_PARALLAX_Y_PERCENT },
    {
      ease: "none",
      scrollTrigger: {
        end: "bottom top",
        invalidateOnRefresh: true,
        scrub: JOURNAL_PARALLAX_SCRUB,
        start: "top bottom",
        trigger: targets.featuredParallax,
      },
      yPercent: JOURNAL_PARALLAX_Y_PERCENT,
    },
  );
}

export function createJournalAnimation(
  root: HTMLElement,
  options: JournalAnimationOptions = {},
): JournalAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableClipPath = options.enableClipPath ?? !compact;
  const enableParallax = options.enableParallax ?? !compact;
  const targets = collectTargets(root);
  const duration = compact ? JOURNAL_DURATION_MOBILE : JOURNAL_DURATION_DESKTOP;

  setInitialStates(targets, compact, enableClipPath);

  if (enableScrollTrigger) {
    registerGsapPlugins(ScrollTrigger);
  }

  const timeline = createPausedTimeline(duration);
  addStoryTweens(timeline, targets, enableClipPath, duration);

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      end: JOURNAL_STORY_END,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      scrub: JOURNAL_STORY_SCRUB,
      start: JOURNAL_SCROLL_START,
      trigger: root,
    });
  }

  if (enableParallax && enableScrollTrigger) {
    createParallax(targets);
  }

  return { timeline };
}
