import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const ABOUT_HERO_EYEBROW_Y_PX = 20;
export const ABOUT_HERO_HEADING_Y_PX = 40;
export const ABOUT_HERO_COPY_Y_PX = 25;
export const ABOUT_HERO_CTA_Y_PX = 20;
export const ABOUT_HERO_IMAGE_SCALE_FROM = 1.08;
export const ABOUT_HERO_IMAGE_SCALE_MOBILE = 1.04;
export const ABOUT_HERO_DURATION = 0.8;
export const ABOUT_HERO_DURATION_MOBILE = 0.55;
export const ABOUT_HERO_STAGGER = 0.1;
export const ABOUT_HERO_PARALLAX_Y_PERCENT = 6;
export const ABOUT_HERO_PARALLAX_SCRUB = 0.6;
export const ABOUT_HERO_CLIP_HIDDEN = "inset(0 0 100% 0)";
export const ABOUT_HERO_CLIP_VISIBLE = "inset(0 0 0% 0)";
export const ABOUT_HERO_SCROLL_START = "top 88%";

export interface AboutHeroAnimationOptions {
  compact?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface AboutHeroAnimationResult {
  timeline: gsap.core.Timeline;
}

interface AboutHeroTargets {
  copy: HTMLElement | null;
  cta: HTMLElement | null;
  eyebrow: HTMLElement | null;
  heading: HTMLElement | null;
  headingMask: HTMLElement | null;
  image: HTMLElement | null;
  parallax: HTMLElement | null;
}

function collectTargets(root: HTMLElement): AboutHeroTargets {
  return {
    copy: root.querySelector<HTMLElement>("[data-about-hero-copy]"),
    cta: root.querySelector<HTMLElement>("[data-about-hero-cta]"),
    eyebrow: root.querySelector<HTMLElement>("[data-about-hero-eyebrow]"),
    heading: root.querySelector<HTMLElement>("[data-about-hero-heading]"),
    headingMask: root.querySelector<HTMLElement>(
      "[data-about-hero-heading-mask]",
    ),
    image: root.querySelector<HTMLElement>("[data-about-hero-image]"),
    parallax: root.querySelector<HTMLElement>("[data-about-hero-parallax]"),
  };
}

export function createAboutHeroAnimation(
  root: HTMLElement,
  options: AboutHeroAnimationOptions = {},
): AboutHeroAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableParallax = options.enableParallax ?? !compact;
  const duration = compact ? ABOUT_HERO_DURATION_MOBILE : ABOUT_HERO_DURATION;
  const imageScale = compact
    ? ABOUT_HERO_IMAGE_SCALE_MOBILE
    : ABOUT_HERO_IMAGE_SCALE_FROM;
  const targets = collectTargets(root);

  if (targets.eyebrow !== null) {
    gsap.set(targets.eyebrow, { opacity: 0, y: ABOUT_HERO_EYEBROW_Y_PX });
  }

  if (targets.heading !== null) {
    gsap.set(targets.heading, { opacity: 0, y: ABOUT_HERO_HEADING_Y_PX });
  }

  if (targets.headingMask !== null && !compact) {
    gsap.set(targets.headingMask, { clipPath: ABOUT_HERO_CLIP_HIDDEN });
  }

  if (targets.copy !== null) {
    gsap.set(targets.copy, { opacity: 0, y: ABOUT_HERO_COPY_Y_PX });
  }

  if (targets.cta !== null) {
    gsap.set(targets.cta, { opacity: 0, y: ABOUT_HERO_CTA_Y_PX });
  }

  if (targets.image !== null) {
    gsap.set(targets.image, {
      force3D: true,
      opacity: 0,
      scale: imageScale,
    });
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

  if (targets.eyebrow !== null) {
    timeline.to(targets.eyebrow, { opacity: 1, y: 0 }, 0);
  }

  if (targets.heading !== null) {
    timeline.to(targets.heading, { opacity: 1, y: 0 }, ABOUT_HERO_STAGGER);
  }

  if (targets.headingMask !== null && !compact) {
    timeline.to(
      targets.headingMask,
      { clipPath: ABOUT_HERO_CLIP_VISIBLE },
      ABOUT_HERO_STAGGER,
    );
  }

  if (targets.copy !== null) {
    timeline.to(targets.copy, { opacity: 1, y: 0 }, ABOUT_HERO_STAGGER * 2);
  }

  if (targets.cta !== null) {
    timeline.to(targets.cta, { opacity: 1, y: 0 }, ABOUT_HERO_STAGGER * 3);
  }

  if (targets.image !== null) {
    timeline.to(
      targets.image,
      { opacity: 1, scale: 1 },
      ABOUT_HERO_STAGGER * 4,
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
      start: ABOUT_HERO_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  if (enableParallax && enableScrollTrigger && targets.parallax !== null) {
    gsap.fromTo(
      targets.parallax,
      { yPercent: -ABOUT_HERO_PARALLAX_Y_PERCENT },
      {
        ease: "none",
        scrollTrigger: {
          end: "bottom top",
          invalidateOnRefresh: true,
          scrub: ABOUT_HERO_PARALLAX_SCRUB,
          start: "top bottom",
          trigger: root,
        },
        yPercent: ABOUT_HERO_PARALLAX_Y_PERCENT,
      },
    );
  }

  return { timeline };
}
