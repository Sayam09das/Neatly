import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const ABOUT_WHY_HEADER_Y_PX = 24;
export const ABOUT_WHY_ITEM_Y_PX = 20;
export const ABOUT_WHY_DURATION = 0.7;
export const ABOUT_WHY_DURATION_MOBILE = 0.5;
export const ABOUT_WHY_STAGGER = 0.08;
export const ABOUT_WHY_SCROLL_START = "top 75%";
export const ABOUT_WHY_HOVER_LIFT_PX = 2;
export const ABOUT_WHY_HOVER_SCALE = 1.01;
export const ABOUT_WHY_FINE_POINTER_QUERY =
  "(hover: hover) and (pointer: fine)";

export interface AboutWhyAnimationOptions {
  compact?: boolean;
  enableScrollTrigger?: boolean;
}

export interface AboutWhyAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createAboutWhyAnimation(
  root: HTMLElement,
  options: AboutWhyAnimationOptions = {},
): AboutWhyAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const duration = compact ? ABOUT_WHY_DURATION_MOBILE : ABOUT_WHY_DURATION;
  const headerItems = queryAll(root, "[data-about-why-header]");
  const items = queryAll(root, "[data-about-why-item]");

  gsap.set(headerItems, { opacity: 0, y: ABOUT_WHY_HEADER_Y_PX });
  gsap.set(items, { opacity: 0, y: ABOUT_WHY_ITEM_Y_PX });

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
  timeline.to(items, { opacity: 1, stagger: ABOUT_WHY_STAGGER, y: 0 }, 0.16);

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        timeline.progress(self.scroll() >= self.start ? 1 : 0);
      },
      start: ABOUT_WHY_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  return { timeline };
}
