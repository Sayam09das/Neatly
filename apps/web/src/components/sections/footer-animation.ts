import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const FOOTER_BRAND_Y_PX = 20;
export const FOOTER_COLUMN_Y_PX = 24;
export const FOOTER_BAR_Y_PX = 16;
export const FOOTER_DURATION_DESKTOP = 0.7;
export const FOOTER_DURATION_MOBILE = 0.5;
export const FOOTER_COLUMN_STAGGER = 0.1;
export const FOOTER_MOBILE_QUERY = "(max-width: 767px)";
export const FOOTER_SCROLL_START = "top 88%";

export interface FooterAnimationOptions {
  compact?: boolean;
  enableScrollTrigger?: boolean;
}

export interface FooterAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createFooterAnimation(
  root: HTMLElement,
  options: FooterAnimationOptions = {},
): FooterAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const duration = compact ? FOOTER_DURATION_MOBILE : FOOTER_DURATION_DESKTOP;

  const brand = root.querySelector<HTMLElement>("[data-footer-brand]");
  const rule = root.querySelector<HTMLElement>("[data-footer-rule]");
  const columns = queryAll(root, "[data-footer-column]");
  const bar = root.querySelector<HTMLElement>("[data-footer-bar]");

  if (brand !== null) {
    gsap.set(brand, { opacity: 0, y: FOOTER_BRAND_Y_PX });
  }

  if (rule !== null) {
    gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
  }

  gsap.set(columns, { force3D: true, opacity: 0, y: FOOTER_COLUMN_Y_PX });

  if (bar !== null) {
    gsap.set(bar, { opacity: 0, y: FOOTER_BAR_Y_PX });
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

  if (brand !== null) {
    timeline.to(brand, { opacity: 1, y: 0 }, 0);
  }

  if (rule !== null) {
    timeline.to(rule, { duration: duration * 0.5, scaleX: 1 }, 0.12);
  }

  timeline.to(
    columns,
    {
      opacity: 1,
      stagger: FOOTER_COLUMN_STAGGER,
      y: 0,
    },
    0.2,
  );

  if (bar !== null) {
    timeline.to(
      bar,
      { duration: duration * 0.75, opacity: 1, y: 0 },
      0.2 + columns.length * FOOTER_COLUMN_STAGGER,
    );
  }

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        timeline.progress(self.scroll() >= self.start ? 1 : 0);
      },
      start: FOOTER_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  return { timeline };
}
