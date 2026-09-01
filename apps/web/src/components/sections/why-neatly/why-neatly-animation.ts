import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const WHY_FEATURE_COUNT = 4;
export const WHY_HEADER_Y_PX = 16;
export const WHY_FEATURE_Y_PX = 20;
export const WHY_FEATURE_Y_COMPACT_PX = 12;
export const WHY_ICON_SCALE_FROM = 0.92;
export const WHY_DURATION = 0.7;
export const WHY_DURATION_COMPACT = 0.5;
export const WHY_HEADER_STAGGER = 0.06;
export const WHY_FEATURE_STAGGER = 0.08;
export const WHY_SCROLL_START = "top 78%";

export interface WhyNeatlyAnimationOptions {
  compact?: boolean;
  enableScrollTrigger?: boolean;
}

export interface WhyNeatlyAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createWhyNeatlyAnimation(
  root: HTMLElement,
  options: WhyNeatlyAnimationOptions = {},
): WhyNeatlyAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const featureY = compact ? WHY_FEATURE_Y_COMPACT_PX : WHY_FEATURE_Y_PX;
  const duration = compact ? WHY_DURATION_COMPACT : WHY_DURATION;
  const headerItems = queryAll(root, "[data-why-header-item]");
  const features = queryAll(root, "[data-why-feature]");
  const icons = queryAll(root, "[data-why-feature-icon]");
  const cta = root.querySelector<HTMLElement>("[data-why-cta]");

  gsap.set(headerItems, { opacity: 0, y: WHY_HEADER_Y_PX });
  gsap.set(features, { force3D: true, opacity: 0, y: featureY });
  gsap.set(icons, { force3D: true, opacity: 0, scale: WHY_ICON_SCALE_FROM });

  if (cta !== null) {
    gsap.set(cta, { opacity: 0, y: WHY_HEADER_Y_PX });
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

  timeline.to(
    headerItems,
    {
      duration: duration * 0.75,
      opacity: 1,
      stagger: WHY_HEADER_STAGGER,
      y: 0,
    },
    0,
  );

  if (cta !== null) {
    timeline.to(cta, { opacity: 1, y: 0 }, 0.12);
  }

  timeline.to(
    features,
    {
      opacity: 1,
      stagger: WHY_FEATURE_STAGGER,
      y: 0,
    },
    0.16,
  );

  timeline.to(
    icons,
    {
      duration: duration * 0.6,
      opacity: 1,
      scale: 1,
      stagger: WHY_FEATURE_STAGGER,
    },
    0.2,
  );

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        timeline.progress(self.scroll() >= self.start ? 1 : 0);
      },
      start: WHY_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  return { timeline };
}
