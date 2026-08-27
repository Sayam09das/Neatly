import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const ABOUT_QUALITY_COPY_Y_PX = 24;
export const ABOUT_QUALITY_SECONDARY_Y_PX = 50;
export const ABOUT_QUALITY_IMAGE_SCALE_FROM = 1.08;
export const ABOUT_QUALITY_IMAGE_SCALE_MOBILE = 1.04;
export const ABOUT_QUALITY_DURATION = 0.8;
export const ABOUT_QUALITY_DURATION_MOBILE = 0.55;
export const ABOUT_QUALITY_CLIP_HIDDEN = "inset(0 0 100% 0)";
export const ABOUT_QUALITY_CLIP_VISIBLE = "inset(0 0 0% 0)";
export const ABOUT_QUALITY_SCROLL_START = "top 75%";
export const ABOUT_QUALITY_PARALLAX_Y_PERCENT = 5;
export const ABOUT_QUALITY_PARALLAX_SCRUB = 0.55;

export interface AboutQualityAnimationOptions {
  compact?: boolean;
  enableClipPath?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface AboutQualityAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createAboutQualityAnimation(
  root: HTMLElement,
  options: AboutQualityAnimationOptions = {},
): AboutQualityAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableClipPath = options.enableClipPath ?? !compact;
  const enableParallax = options.enableParallax ?? !compact;
  const duration = compact
    ? ABOUT_QUALITY_DURATION_MOBILE
    : ABOUT_QUALITY_DURATION;
  const imageScale = compact
    ? ABOUT_QUALITY_IMAGE_SCALE_MOBILE
    : ABOUT_QUALITY_IMAGE_SCALE_FROM;
  const copyItems = queryAll(root, "[data-about-quality-copy]");
  const mask = root.querySelector<HTMLElement>("[data-about-quality-mask]");
  const primary = root.querySelector<HTMLElement>(
    "[data-about-quality-primary]",
  );
  const secondary = queryAll(root, "[data-about-quality-secondary]");
  const parallaxLayers = queryAll(root, "[data-about-quality-parallax]");

  gsap.set(copyItems, { opacity: 0, y: ABOUT_QUALITY_COPY_Y_PX });
  gsap.set(secondary, {
    opacity: 0,
    y: compact ? ABOUT_QUALITY_COPY_Y_PX : ABOUT_QUALITY_SECONDARY_Y_PX,
  });

  if (primary !== null) {
    gsap.set(primary, { force3D: true, scale: imageScale });
  }

  if (mask !== null && enableClipPath) {
    gsap.set(mask, { clipPath: ABOUT_QUALITY_CLIP_HIDDEN });
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

  timeline.to(copyItems, { opacity: 1, stagger: 0.08, y: 0 }, 0);

  if (mask !== null && enableClipPath) {
    timeline.to(mask, { clipPath: ABOUT_QUALITY_CLIP_VISIBLE }, 0.12);
  }

  if (primary !== null) {
    timeline.to(primary, { scale: 1 }, 0.12);
  }

  timeline.to(secondary, { opacity: 1, stagger: 0.1, y: 0 }, 0.28);

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        timeline.progress(self.scroll() >= self.start ? 1 : 0);
      },
      start: ABOUT_QUALITY_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  if (enableParallax && enableScrollTrigger) {
    for (const layer of parallaxLayers) {
      gsap.fromTo(
        layer,
        { yPercent: -ABOUT_QUALITY_PARALLAX_Y_PERCENT },
        {
          ease: "none",
          scrollTrigger: {
            end: "bottom top",
            invalidateOnRefresh: true,
            scrub: ABOUT_QUALITY_PARALLAX_SCRUB,
            start: "top bottom",
            trigger: layer,
          },
          yPercent: ABOUT_QUALITY_PARALLAX_Y_PERCENT,
        },
      );
    }
  }

  return { timeline };
}
