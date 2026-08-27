import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const ABOUT_HERO_EYEBROW_Y_PX = 20;
export const ABOUT_HERO_EYEBROW_Y_PX_COMPACT = 12;
export const ABOUT_HERO_COPY_Y_PX = 25;
export const ABOUT_HERO_COPY_Y_PX_COMPACT = 16;
export const ABOUT_HERO_CTA_Y_PX = 20;
export const ABOUT_HERO_CTA_Y_PX_COMPACT = 12;
export const ABOUT_HERO_LINE_Y_PERCENT = 100;
export const ABOUT_HERO_IMAGE_SCALE_FROM = 1.06;
export const ABOUT_HERO_IMAGE_SCALE_MOBILE = 1.03;
export const ABOUT_HERO_EYEBROW_DURATION = 0.5;
export const ABOUT_HERO_HEADING_DURATION = 0.8;
export const ABOUT_HERO_HEADING_DURATION_COMPACT = 0.6;
export const ABOUT_HERO_COPY_DURATION = 0.5;
export const ABOUT_HERO_CTA_DURATION = 0.4;
export const ABOUT_HERO_IMAGE_DURATION = 1;
export const ABOUT_HERO_IMAGE_DURATION_COMPACT = 0.8;
export const ABOUT_HERO_LINE_STAGGER = 0.08;
export const ABOUT_HERO_LINE_STAGGER_COMPACT = 0.05;
export const ABOUT_HERO_PARALLAX_Y_PERCENT = 5;
export const ABOUT_HERO_PARALLAX_SCRUB = 0.6;
export const ABOUT_HERO_CLIP_HIDDEN = "inset(0 0 100% 0)";
export const ABOUT_HERO_CLIP_VISIBLE = "inset(0 0 0% 0)";
export const ABOUT_HERO_SCROLL_START = "top 92%";
export const ABOUT_HERO_EYEBROW_AT = 0;
export const ABOUT_HERO_HEADING_AT = 0.18;
export const ABOUT_HERO_COPY_AT = 0.48;
export const ABOUT_HERO_CTA_AT = 0.72;
export const ABOUT_HERO_IMAGE_AT = 0.82;

export interface AboutHeroAnimationOptions {
  compact?: boolean;
  enableClipPath?: boolean;
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
  image: HTMLElement | null;
  lines: Array<HTMLElement>;
  mask: HTMLElement | null;
  parallax: HTMLElement | null;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function collectTargets(root: HTMLElement): AboutHeroTargets {
  return {
    copy: root.querySelector<HTMLElement>("[data-about-hero-copy]"),
    cta: root.querySelector<HTMLElement>("[data-about-hero-cta]"),
    eyebrow: root.querySelector<HTMLElement>("[data-about-hero-eyebrow]"),
    image: root.querySelector<HTMLElement>("[data-about-hero-image]"),
    lines: queryAll(root, "[data-about-hero-line]"),
    mask: root.querySelector<HTMLElement>("[data-about-hero-mask]"),
    parallax: root.querySelector<HTMLElement>("[data-about-hero-parallax]"),
  };
}

export function createAboutHeroAnimation(
  root: HTMLElement,
  options: AboutHeroAnimationOptions = {},
): AboutHeroAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableClipPath = options.enableClipPath ?? true;
  const enableParallax = options.enableParallax ?? !compact;
  const imageScale = compact
    ? ABOUT_HERO_IMAGE_SCALE_MOBILE
    : ABOUT_HERO_IMAGE_SCALE_FROM;
  const eyebrowY = compact
    ? ABOUT_HERO_EYEBROW_Y_PX_COMPACT
    : ABOUT_HERO_EYEBROW_Y_PX;
  const copyY = compact ? ABOUT_HERO_COPY_Y_PX_COMPACT : ABOUT_HERO_COPY_Y_PX;
  const ctaY = compact ? ABOUT_HERO_CTA_Y_PX_COMPACT : ABOUT_HERO_CTA_Y_PX;
  const headingDuration = compact
    ? ABOUT_HERO_HEADING_DURATION_COMPACT
    : ABOUT_HERO_HEADING_DURATION;
  const imageDuration = compact
    ? ABOUT_HERO_IMAGE_DURATION_COMPACT
    : ABOUT_HERO_IMAGE_DURATION;
  const lineStagger = compact
    ? ABOUT_HERO_LINE_STAGGER_COMPACT
    : ABOUT_HERO_LINE_STAGGER;
  const targets = collectTargets(root);

  if (targets.eyebrow !== null) {
    gsap.set(targets.eyebrow, { opacity: 0, y: eyebrowY });
  }

  gsap.set(targets.lines, {
    opacity: 0,
    yPercent: ABOUT_HERO_LINE_Y_PERCENT,
  });

  if (targets.copy !== null) {
    gsap.set(targets.copy, { opacity: 0, y: copyY });
  }

  if (targets.cta !== null) {
    gsap.set(targets.cta, { opacity: 0, y: ctaY });
  }

  if (targets.image !== null) {
    gsap.set(targets.image, {
      force3D: true,
      opacity: 0,
      scale: imageScale,
    });
  }

  if (targets.mask !== null && enableClipPath) {
    gsap.set(targets.mask, { clipPath: ABOUT_HERO_CLIP_HIDDEN });
  }

  if (enableScrollTrigger) {
    registerGsapPlugins(ScrollTrigger);
  }

  const timeline = gsap.timeline({
    defaults: {
      ease: easings.enter.gsap,
    },
    paused: true,
  });

  if (targets.eyebrow !== null) {
    timeline.to(
      targets.eyebrow,
      {
        duration: ABOUT_HERO_EYEBROW_DURATION,
        opacity: 1,
        y: 0,
      },
      ABOUT_HERO_EYEBROW_AT,
    );
  }

  if (targets.lines.length > 0) {
    timeline.to(
      targets.lines,
      {
        duration: headingDuration,
        opacity: 1,
        stagger: lineStagger,
        yPercent: 0,
      },
      ABOUT_HERO_HEADING_AT,
    );
  }

  if (targets.copy !== null) {
    timeline.to(
      targets.copy,
      {
        duration: ABOUT_HERO_COPY_DURATION,
        opacity: 1,
        y: 0,
      },
      ABOUT_HERO_COPY_AT,
    );
  }

  if (targets.cta !== null) {
    timeline.to(
      targets.cta,
      {
        duration: ABOUT_HERO_CTA_DURATION,
        opacity: 1,
        y: 0,
      },
      ABOUT_HERO_CTA_AT,
    );
  }

  if (targets.mask !== null && enableClipPath) {
    timeline.to(
      targets.mask,
      {
        clipPath: ABOUT_HERO_CLIP_VISIBLE,
        duration: imageDuration,
      },
      ABOUT_HERO_IMAGE_AT,
    );
  }

  if (targets.image !== null) {
    timeline.to(
      targets.image,
      {
        duration: imageDuration,
        opacity: 1,
        scale: 1,
      },
      ABOUT_HERO_IMAGE_AT,
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
          trigger: targets.parallax,
        },
        yPercent: ABOUT_HERO_PARALLAX_Y_PERCENT,
      },
    );
  }

  return { timeline };
}
