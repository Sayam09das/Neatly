import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const WORK_HEADER_Y_PX = 16;
export const WORK_CTA_Y_PX = 16;
export const WORK_DURATION_DESKTOP = 0.8;
export const WORK_DURATION_MOBILE = 0.55;
export const WORK_HEADER_STAGGER = 0.08;
export const WORK_MOBILE_QUERY = "(max-width: 767px)";
export const WORK_SCROLL_START = "top 75%";
export const WORK_GALLERY_LABEL = "Featured work photographs";
export const WORK_NEXT_PHOTO_LABEL = "Next work photograph";
export const WORK_PREVIOUS_PHOTO_LABEL = "Previous work photograph";
export const WORK_SWIPER_SPEED_MS = 800;
export const WORK_SWIPER_REDUCED_SPEED_MS = 0;
export const WORK_SWIPER_AUTOPLAY_MS = 3500;
export const WORK_SLIDE_INACTIVE_SCALE = 0.94;
export const WORK_SLIDE_INACTIVE_OPACITY = 0.85;
export const WORK_SWIPER_MOBILE_PER_VIEW = 1.22;
export const WORK_SWIPER_TABLET_PER_VIEW = 2.2;
export const WORK_SWIPER_LAPTOP_PER_VIEW = 2.45;
export const WORK_SWIPER_DESKTOP_PER_VIEW = 2.7;
export const WORK_SWIPER_TABLET_MIN_PX = 768;
export const WORK_SWIPER_LAPTOP_MIN_PX = 1024;
export const WORK_SWIPER_DESKTOP_MIN_PX = 1280;
export const WORK_SWIPER_SPACE_MOBILE_PX = 24;
export const WORK_SWIPER_SPACE_TABLET_PX = 32;
export const WORK_SWIPER_SPACE_DESKTOP_PX = 40;

export interface WorkAnimationOptions {
  compact?: boolean;
  enableScrollTrigger?: boolean;
}

export interface WorkAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createWorkAnimation(
  root: HTMLElement,
  options: WorkAnimationOptions = {},
): WorkAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const duration = compact ? WORK_DURATION_MOBILE : WORK_DURATION_DESKTOP;

  const headerItems = queryAll(root, "[data-work-header-item]");
  const rule = root.querySelector<HTMLElement>("[data-work-rule]");
  const empty = root.querySelector<HTMLElement>("[data-work-empty]");
  const cta = root.querySelector<HTMLElement>("[data-work-cta]");

  gsap.set(headerItems, { opacity: 0, y: WORK_HEADER_Y_PX });

  if (rule !== null) {
    gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
  }

  if (empty !== null) {
    gsap.set(empty, { opacity: 0, y: WORK_CTA_Y_PX });
  }

  if (cta !== null) {
    gsap.set(cta, { opacity: 0, y: WORK_CTA_Y_PX });
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
      stagger: WORK_HEADER_STAGGER,
      y: 0,
    },
    0,
  );

  if (rule !== null) {
    timeline.to(rule, { duration: duration * 0.5, scaleX: 1 }, 0.12);
  }

  if (empty !== null) {
    timeline.to(empty, { duration: duration * 0.75, opacity: 1, y: 0 }, 0.36);
  }

  if (cta !== null) {
    timeline.to(cta, { duration: duration * 0.75, opacity: 1, y: 0 }, 0.44);
  }

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
      start: WORK_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  return { timeline };
}
