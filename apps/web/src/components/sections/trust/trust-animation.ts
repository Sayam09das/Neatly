import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const TRUST_ITEM_COUNT = 4;
export const TRUST_EYEBROW_Y_PX = 20;
export const TRUST_HEADING_Y_PX = 36;
export const TRUST_INTRO_Y_PX = 20;
export const TRUST_ITEM_Y_PX = 24;
export const TRUST_DURATION_DESKTOP = 0.75;
export const TRUST_DURATION_MOBILE = 0.55;
export const TRUST_HEADER_STAGGER = 0.08;
export const TRUST_ITEM_STAGGER = 0.1;
export const TRUST_ACCENT_DURATION_RATIO = 0.55;
export const TRUST_HOVER_LIFT_PX = 3;
export const TRUST_TAP_SCALE = 0.99;
export const TRUST_MOBILE_QUERY = "(max-width: 767px)";
export const TRUST_FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
export const TRUST_SCROLL_START = "top 78%";
export const TRUST_STORY_END = "bottom 64%";
export const TRUST_HEADER_AT = 0;
export const TRUST_INTRO_AT = 0.14;
export const TRUST_ITEMS_AT = 0.28;

export interface TrustAnimationOptions {
  compact?: boolean;
  enableScrollTrigger?: boolean;
}

export interface TrustAnimationResult {
  timeline: gsap.core.Timeline;
}

interface TrustItemTargets {
  accent: HTMLElement | undefined;
  item: HTMLElement;
}

interface TrustTargets {
  eyebrow: HTMLElement | null;
  heading: HTMLElement | null;
  intro: HTMLElement | null;
  items: Array<TrustItemTargets>;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function collectTargets(root: HTMLElement): TrustTargets {
  const items = queryAll(root, "[data-trust-item]").map((item) => ({
    accent: item.querySelector<HTMLElement>("[data-trust-accent]") ?? undefined,
    item,
  }));

  return {
    eyebrow: root.querySelector<HTMLElement>("[data-trust-eyebrow]"),
    heading: root.querySelector<HTMLElement>("[data-trust-heading]"),
    intro: root.querySelector<HTMLElement>("[data-trust-intro]"),
    items,
  };
}

function setInitialStates(targets: TrustTargets): void {
  if (targets.eyebrow !== null) {
    gsap.set(targets.eyebrow, { opacity: 0, y: TRUST_EYEBROW_Y_PX });
  }

  if (targets.heading !== null) {
    gsap.set(targets.heading, { opacity: 0, y: TRUST_HEADING_Y_PX });
  }

  if (targets.intro !== null) {
    gsap.set(targets.intro, { opacity: 0, y: TRUST_INTRO_Y_PX });
  }

  for (const target of targets.items) {
    gsap.set(target.item, { force3D: true, opacity: 0, y: TRUST_ITEM_Y_PX });

    if (target.accent !== undefined) {
      gsap.set(target.accent, {
        scaleX: 0,
        transformOrigin: "left center",
      });
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

function addStoryTweens(
  timeline: gsap.core.Timeline,
  targets: TrustTargets,
  duration: number,
): void {
  if (targets.eyebrow !== null) {
    timeline.to(
      targets.eyebrow,
      { duration: duration * 0.75, opacity: 1, y: 0 },
      TRUST_HEADER_AT,
    );
  }

  if (targets.heading !== null) {
    timeline.to(
      targets.heading,
      { opacity: 1, y: 0 },
      TRUST_HEADER_AT + TRUST_HEADER_STAGGER,
    );
  }

  if (targets.intro !== null) {
    timeline.to(
      targets.intro,
      { duration: duration * 0.75, opacity: 1, y: 0 },
      TRUST_INTRO_AT,
    );
  }

  for (const [index, target] of targets.items.entries()) {
    const at = TRUST_ITEMS_AT + index * TRUST_ITEM_STAGGER;

    timeline.to(target.item, { opacity: 1, y: 0 }, at);

    if (target.accent !== undefined) {
      timeline.to(
        target.accent,
        {
          duration: duration * TRUST_ACCENT_DURATION_RATIO,
          scaleX: 1,
        },
        at,
      );
    }
  }
}

export function createTrustAnimation(
  root: HTMLElement,
  options: TrustAnimationOptions = {},
): TrustAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const targets = collectTargets(root);
  const duration = compact ? TRUST_DURATION_MOBILE : TRUST_DURATION_DESKTOP;

  setInitialStates(targets);

  if (enableScrollTrigger) {
    registerGsapPlugins(ScrollTrigger);
  }

  const timeline = createPausedTimeline(duration);
  addStoryTweens(timeline, targets, duration);

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      end: TRUST_STORY_END,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      scrub: 0.5,
      start: TRUST_SCROLL_START,
      trigger: root,
    });
  }

  return { timeline };
}
