import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const ABOUT_STORY_COPY_Y_PX = 40;
export const ABOUT_STORY_DETAIL_Y_PX = 24;
export const ABOUT_STORY_IMAGE_SCALE_FROM = 1.06;
export const ABOUT_STORY_IMAGE_SCALE_MOBILE = 1.04;
export const ABOUT_STORY_DURATION = 0.8;
export const ABOUT_STORY_DURATION_MOBILE = 0.55;
export const ABOUT_STORY_STAGGER = 0.1;
export const ABOUT_STORY_PARALLAX_Y_PERCENT = 5;
export const ABOUT_STORY_PARALLAX_SCRUB = 0.55;
export const ABOUT_STORY_CLIP_HIDDEN = "inset(0 100% 0 0)";
export const ABOUT_STORY_CLIP_VISIBLE = "inset(0 0% 0 0)";
export const ABOUT_STORY_SCROLL_START = "top 75%";

export interface AboutStoryAnimationOptions {
  compact?: boolean;
  enableClipPath?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface AboutStoryAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createAboutStoryAnimation(
  root: HTMLElement,
  options: AboutStoryAnimationOptions = {},
): AboutStoryAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableClipPath = options.enableClipPath ?? !compact;
  const enableParallax = options.enableParallax ?? !compact;
  const duration = compact ? ABOUT_STORY_DURATION_MOBILE : ABOUT_STORY_DURATION;
  const imageScale = compact
    ? ABOUT_STORY_IMAGE_SCALE_MOBILE
    : ABOUT_STORY_IMAGE_SCALE_FROM;
  const copyItems = queryAll(root, "[data-about-story-copy]");
  const detail = root.querySelector<HTMLElement>("[data-about-story-detail]");
  const mask = root.querySelector<HTMLElement>("[data-about-story-mask]");
  const image = root.querySelector<HTMLElement>("[data-about-story-image]");
  const parallax = root.querySelector<HTMLElement>(
    "[data-about-story-parallax]",
  );

  gsap.set(copyItems, { opacity: 0, y: ABOUT_STORY_COPY_Y_PX });

  if (detail !== null) {
    gsap.set(detail, { opacity: 0, y: ABOUT_STORY_DETAIL_Y_PX });
  }

  if (image !== null) {
    gsap.set(image, { force3D: true, scale: imageScale });
  }

  if (mask !== null && enableClipPath) {
    gsap.set(mask, { clipPath: ABOUT_STORY_CLIP_HIDDEN });
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

  timeline.to(copyItems, { opacity: 1, stagger: ABOUT_STORY_STAGGER, y: 0 }, 0);

  if (mask !== null && enableClipPath) {
    timeline.to(mask, { clipPath: ABOUT_STORY_CLIP_VISIBLE }, 0.16);
  }

  if (image !== null) {
    timeline.to(image, { scale: 1 }, 0.16);
  }

  if (detail !== null) {
    timeline.to(detail, { opacity: 1, y: 0 }, 0.32);
  }

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        timeline.progress(self.scroll() >= self.start ? 1 : 0);
      },
      start: ABOUT_STORY_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  if (enableParallax && enableScrollTrigger && parallax !== null) {
    gsap.fromTo(
      parallax,
      { yPercent: -ABOUT_STORY_PARALLAX_Y_PERCENT },
      {
        ease: "none",
        scrollTrigger: {
          end: "bottom top",
          invalidateOnRefresh: true,
          scrub: ABOUT_STORY_PARALLAX_SCRUB,
          start: "top bottom",
          trigger: parallax,
        },
        yPercent: ABOUT_STORY_PARALLAX_Y_PERCENT,
      },
    );
  }

  return { timeline };
}
