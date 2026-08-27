import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const ABOUT_TEAM_COPY_X_PX = 30;
export const ABOUT_TEAM_COPY_Y_PX = 24;
export const ABOUT_TEAM_IMAGE_SCALE_FROM = 1.05;
export const ABOUT_TEAM_IMAGE_SCALE_MOBILE = 1.03;
export const ABOUT_TEAM_DURATION = 0.8;
export const ABOUT_TEAM_DURATION_MOBILE = 0.55;
export const ABOUT_TEAM_CLIP_HIDDEN = "inset(0 100% 0 0)";
export const ABOUT_TEAM_CLIP_VISIBLE = "inset(0 0% 0 0)";
export const ABOUT_TEAM_SCROLL_START = "top 75%";
export const ABOUT_TEAM_PARALLAX_Y_PERCENT = 4;
export const ABOUT_TEAM_PARALLAX_SCRUB = 0.55;

export interface AboutTeamAnimationOptions {
  compact?: boolean;
  enableClipPath?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface AboutTeamAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createAboutTeamAnimation(
  root: HTMLElement,
  options: AboutTeamAnimationOptions = {},
): AboutTeamAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableClipPath = options.enableClipPath ?? !compact;
  const enableParallax = options.enableParallax ?? !compact;
  const duration = compact ? ABOUT_TEAM_DURATION_MOBILE : ABOUT_TEAM_DURATION;
  const imageScale = compact
    ? ABOUT_TEAM_IMAGE_SCALE_MOBILE
    : ABOUT_TEAM_IMAGE_SCALE_FROM;
  const copyItems = queryAll(root, "[data-about-team-copy]");
  const mask = root.querySelector<HTMLElement>("[data-about-team-mask]");
  const image = root.querySelector<HTMLElement>("[data-about-team-image]");
  const parallax = root.querySelector<HTMLElement>(
    "[data-about-team-parallax]",
  );

  if (compact) {
    gsap.set(copyItems, { opacity: 0, y: ABOUT_TEAM_COPY_Y_PX });
  } else {
    gsap.set(copyItems, { opacity: 0, x: ABOUT_TEAM_COPY_X_PX });
  }

  if (image !== null) {
    gsap.set(image, { force3D: true, scale: imageScale });
  }

  if (mask !== null && enableClipPath) {
    gsap.set(mask, { clipPath: ABOUT_TEAM_CLIP_HIDDEN });
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

  if (mask !== null && enableClipPath) {
    timeline.to(mask, { clipPath: ABOUT_TEAM_CLIP_VISIBLE }, 0);
  }

  if (image !== null) {
    timeline.to(image, { scale: 1 }, 0);
  }

  timeline.to(
    copyItems,
    compact
      ? { opacity: 1, stagger: 0.08, y: 0 }
      : { opacity: 1, stagger: 0.08, x: 0 },
    0.12,
  );

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        timeline.progress(self.scroll() >= self.start ? 1 : 0);
      },
      start: ABOUT_TEAM_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  if (enableParallax && enableScrollTrigger && parallax !== null) {
    gsap.fromTo(
      parallax,
      { yPercent: -ABOUT_TEAM_PARALLAX_Y_PERCENT },
      {
        ease: "none",
        scrollTrigger: {
          end: "bottom top",
          invalidateOnRefresh: true,
          scrub: ABOUT_TEAM_PARALLAX_SCRUB,
          start: "top bottom",
          trigger: parallax,
        },
        yPercent: ABOUT_TEAM_PARALLAX_Y_PERCENT,
      },
    );
  }

  return { timeline };
}
