import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const ABOUT_CTA_HEADING_Y_PX = 24;
export const ABOUT_CTA_Y_PX = 20;
export const ABOUT_CTA_IMAGE_SCALE_FROM = 1.05;
export const ABOUT_CTA_IMAGE_SCALE_MOBILE = 1.03;
export const ABOUT_CTA_DURATION = 0.8;
export const ABOUT_CTA_DURATION_MOBILE = 0.55;
export const ABOUT_CTA_CLIP_HIDDEN = "inset(0 0 100% 0)";
export const ABOUT_CTA_CLIP_VISIBLE = "inset(0 0 0% 0)";
export const ABOUT_CTA_SCROLL_START = "top 78%";

export interface AboutCtaAnimationOptions {
  compact?: boolean;
  enableClipPath?: boolean;
  enableScrollTrigger?: boolean;
}

export interface AboutCtaAnimationResult {
  timeline: gsap.core.Timeline;
}

export function createAboutCtaAnimation(
  root: HTMLElement,
  options: AboutCtaAnimationOptions = {},
): AboutCtaAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableClipPath = options.enableClipPath ?? !compact;
  const duration = compact ? ABOUT_CTA_DURATION_MOBILE : ABOUT_CTA_DURATION;
  const imageScale = compact
    ? ABOUT_CTA_IMAGE_SCALE_MOBILE
    : ABOUT_CTA_IMAGE_SCALE_FROM;
  const headingMask = root.querySelector<HTMLElement>(
    "[data-about-cta-heading-mask]",
  );
  const heading = root.querySelector<HTMLElement>("[data-about-cta-heading]");
  const copy = root.querySelector<HTMLElement>("[data-about-cta-copy]");
  const actions = root.querySelector<HTMLElement>("[data-about-cta-actions]");
  const image = root.querySelector<HTMLElement>("[data-about-cta-image]");

  if (heading !== null) {
    gsap.set(heading, { opacity: 0, y: ABOUT_CTA_HEADING_Y_PX });
  }

  if (headingMask !== null && enableClipPath) {
    gsap.set(headingMask, { clipPath: ABOUT_CTA_CLIP_HIDDEN });
  }

  if (copy !== null) {
    gsap.set(copy, { opacity: 0, y: ABOUT_CTA_Y_PX });
  }

  if (actions !== null) {
    gsap.set(actions, { opacity: 0, y: ABOUT_CTA_Y_PX });
  }

  if (image !== null) {
    gsap.set(image, { force3D: true, scale: imageScale });
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

  if (heading !== null) {
    timeline.to(heading, { opacity: 1, y: 0 }, 0);
  }

  if (headingMask !== null && enableClipPath) {
    timeline.to(headingMask, { clipPath: ABOUT_CTA_CLIP_VISIBLE }, 0);
  }

  if (image !== null) {
    timeline.to(image, { scale: 1 }, 0);
  }

  if (copy !== null) {
    timeline.to(copy, { opacity: 1, y: 0 }, 0.12);
  }

  if (actions !== null) {
    timeline.to(actions, { opacity: 1, y: 0 }, 0.2);
  }

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        timeline.progress(self.scroll() >= self.start ? 1 : 0);
      },
      start: ABOUT_CTA_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  return { timeline };
}
