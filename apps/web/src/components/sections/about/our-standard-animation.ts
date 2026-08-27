import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const ABOUT_STANDARD_HEADER_Y_PX = 24;
export const ABOUT_STANDARD_ITEM_X_PX = 40;
export const ABOUT_STANDARD_ITEM_X_MOBILE_PX = 20;
export const ABOUT_STANDARD_DURATION = 0.75;
export const ABOUT_STANDARD_DURATION_MOBILE = 0.55;
export const ABOUT_STANDARD_STAGGER = 0.12;
export const ABOUT_STANDARD_SCROLL_START = "top 75%";
export const ABOUT_STANDARD_ITEM_START = "top 82%";

export interface AboutStandardAnimationOptions {
  compact?: boolean;
  enableScrollTrigger?: boolean;
}

export interface AboutStandardAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createAboutStandardAnimation(
  root: HTMLElement,
  options: AboutStandardAnimationOptions = {},
): AboutStandardAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const duration = compact
    ? ABOUT_STANDARD_DURATION_MOBILE
    : ABOUT_STANDARD_DURATION;
  const itemX = compact
    ? ABOUT_STANDARD_ITEM_X_MOBILE_PX
    : ABOUT_STANDARD_ITEM_X_PX;
  const headerItems = queryAll(root, "[data-about-standard-header]");
  const items = queryAll(root, "[data-about-standard-item]");

  gsap.set(headerItems, { opacity: 0, y: ABOUT_STANDARD_HEADER_Y_PX });

  for (const item of items) {
    gsap.set(item, { opacity: 0, x: itemX });
    const number = item.querySelector<HTMLElement>(
      "[data-about-standard-number]",
    );
    const rule = item.querySelector<HTMLElement>("[data-about-standard-rule]");
    const title = item.querySelector<HTMLElement>(
      "[data-about-standard-title]",
    );
    const body = item.querySelector<HTMLElement>("[data-about-standard-body]");

    if (number !== null) {
      gsap.set(number, { opacity: 0, x: itemX });
    }

    if (rule !== null) {
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
    }

    if (title !== null) {
      gsap.set(title, { opacity: 0, x: itemX });
    }

    if (body !== null) {
      gsap.set(body, { opacity: 0, x: itemX });
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
      "[data-about-standard-header-block]",
    );

    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        timeline.progress(self.scroll() >= self.start ? 1 : 0);
      },
      start: ABOUT_STANDARD_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: header ?? root,
    });

    for (const item of items) {
      const itemTimeline = gsap.timeline({
        defaults: { duration, ease: easings.enter.gsap },
        paused: true,
      });
      addItemTweens(itemTimeline, item, 0);
      ScrollTrigger.create({
        animation: itemTimeline,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onRefresh: (self): void => {
          itemTimeline.progress(self.scroll() >= self.start ? 1 : 0);
        },
        start: ABOUT_STANDARD_ITEM_START,
        toggleActions: "play none none reverse",
        trigger: item,
      });
    }

    return { timeline };
  }

  for (const [index, item] of items.entries()) {
    addItemTweens(timeline, item, 0.2 + index * ABOUT_STANDARD_STAGGER);
  }

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        timeline.progress(self.scroll() >= self.start ? 1 : 0);
      },
      start: ABOUT_STANDARD_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  return { timeline };
}

function addItemTweens(
  timeline: gsap.core.Timeline,
  item: HTMLElement,
  at: number,
): void {
  const number = item.querySelector<HTMLElement>(
    "[data-about-standard-number]",
  );
  const rule = item.querySelector<HTMLElement>("[data-about-standard-rule]");
  const title = item.querySelector<HTMLElement>("[data-about-standard-title]");
  const body = item.querySelector<HTMLElement>("[data-about-standard-body]");

  timeline.to(item, { opacity: 1, x: 0 }, at);

  if (number !== null) {
    timeline.to(number, { opacity: 1, x: 0 }, at);
  }

  if (rule !== null) {
    timeline.to(rule, { duration: 0.4, scaleX: 1 }, at + 0.06);
  }

  if (title !== null) {
    timeline.to(title, { opacity: 1, x: 0 }, at + 0.08);
  }

  if (body !== null) {
    timeline.to(body, { opacity: 1, x: 0 }, at + 0.12);
  }
}
