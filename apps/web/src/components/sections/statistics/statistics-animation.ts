import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const STATISTICS_ITEM_COUNT = 3;
export const STATISTICS_HEADING_Y_PX = 36;
export const STATISTICS_INTRO_Y_PX = 20;
export const STATISTICS_ITEM_Y_PX = 24;
export const STATISTICS_DURATION_DESKTOP = 0.75;
export const STATISTICS_DURATION_MOBILE = 0.55;
export const STATISTICS_ITEM_STAGGER = 0.1;
export const STATISTICS_ACCENT_DURATION_RATIO = 0.55;
export const STATISTICS_HOVER_LIFT_PX = 3;
export const STATISTICS_TAP_SCALE = 0.99;
export const STATISTICS_MOBILE_QUERY = "(max-width: 767px)";
export const STATISTICS_FINE_POINTER_QUERY =
  "(hover: hover) and (pointer: fine)";
export const STATISTICS_SCROLL_START = "top 78%";
export const STATISTICS_HEADER_AT = 0;
export const STATISTICS_INTRO_AT = 0.14;
export const STATISTICS_ITEMS_AT = 0.28;

export interface StatisticsAnimationOptions {
  compact?: boolean;
  enableScrollTrigger?: boolean;
}

export interface StatisticsAnimationResult {
  timeline: gsap.core.Timeline;
}

interface StatisticsItemTargets {
  accent: HTMLElement | undefined;
  item: HTMLElement;
}

interface StatisticsTargets {
  heading: HTMLElement | null;
  intro: HTMLElement | null;
  items: Array<StatisticsItemTargets>;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function collectTargets(root: HTMLElement): StatisticsTargets {
  const items = queryAll(root, "[data-statistics-item]").map((item) => ({
    accent:
      item.querySelector<HTMLElement>("[data-statistics-accent]") ?? undefined,
    item,
  }));

  return {
    heading: root.querySelector<HTMLElement>("[data-statistics-heading]"),
    intro: root.querySelector<HTMLElement>("[data-statistics-intro]"),
    items,
  };
}

function setInitialStates(targets: StatisticsTargets): void {
  if (targets.heading !== null) {
    gsap.set(targets.heading, {
      opacity: 0,
      y: STATISTICS_HEADING_Y_PX,
    });
  }

  if (targets.intro !== null) {
    gsap.set(targets.intro, { opacity: 0, y: STATISTICS_INTRO_Y_PX });
  }

  for (const target of targets.items) {
    gsap.set(target.item, {
      force3D: true,
      opacity: 0,
      y: STATISTICS_ITEM_Y_PX,
    });

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
  targets: StatisticsTargets,
  duration: number,
): void {
  if (targets.heading !== null) {
    timeline.to(targets.heading, { opacity: 1, y: 0 }, STATISTICS_HEADER_AT);
  }

  if (targets.intro !== null) {
    timeline.to(
      targets.intro,
      { duration: duration * 0.75, opacity: 1, y: 0 },
      STATISTICS_INTRO_AT,
    );
  }

  for (const [index, target] of targets.items.entries()) {
    const at = STATISTICS_ITEMS_AT + index * STATISTICS_ITEM_STAGGER;

    timeline.to(target.item, { opacity: 1, y: 0 }, at);

    if (target.accent !== undefined) {
      timeline.to(
        target.accent,
        {
          duration: duration * STATISTICS_ACCENT_DURATION_RATIO,
          scaleX: 1,
        },
        at,
      );
    }
  }
}

export function createStatisticsAnimation(
  root: HTMLElement,
  options: StatisticsAnimationOptions = {},
): StatisticsAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const targets = collectTargets(root);
  const duration = compact
    ? STATISTICS_DURATION_MOBILE
    : STATISTICS_DURATION_DESKTOP;

  setInitialStates(targets);

  if (enableScrollTrigger) {
    registerGsapPlugins(ScrollTrigger);
  }

  const timeline = createPausedTimeline(duration);
  addStoryTweens(timeline, targets, duration);

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        if (self.scroll() >= self.start) {
          timeline.progress(1);
          return;
        }

        timeline.progress(0);
      },
      start: STATISTICS_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  return { timeline };
}
