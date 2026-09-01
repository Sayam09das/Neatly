import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const SERVICES_HERO_EYEBROW_Y_PX = 16;
export const SERVICES_HERO_COPY_Y_PX = 20;
export const SERVICES_HERO_CTA_Y_PX = 16;
export const SERVICES_HERO_LINE_Y_PERCENT = 100;
export const SERVICES_HERO_IMAGE_SCALE_FROM = 1.06;
export const SERVICES_HERO_IMAGE_SCALE_MOBILE = 1.03;
export const SERVICES_HERO_EYEBROW_DURATION = 0.45;
export const SERVICES_HERO_HEADING_DURATION = 0.75;
export const SERVICES_HERO_HEADING_DURATION_COMPACT = 0.55;
export const SERVICES_HERO_COPY_DURATION = 0.45;
export const SERVICES_HERO_CTA_DURATION = 0.4;
export const SERVICES_HERO_IMAGE_DURATION = 0.9;
export const SERVICES_HERO_IMAGE_DURATION_COMPACT = 0.7;
export const SERVICES_HERO_LINE_STAGGER = 0.08;
export const SERVICES_HERO_PARALLAX_Y_PERCENT = 4;
export const SERVICES_HERO_PARALLAX_SCRUB = 0.55;
export const SERVICES_HERO_CLIP_HIDDEN = "inset(0 0 100% 0)";
export const SERVICES_HERO_CLIP_VISIBLE = "inset(0 0 0% 0)";
export const SERVICES_HERO_SCROLL_START = "top 92%";

export interface ServicesHeroAnimationOptions {
  compact?: boolean;
  enableClipPath?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface ServicesHeroAnimationResult {
  timeline: gsap.core.Timeline;
}

interface ServicesHeroTargets {
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

function collectTargets(root: HTMLElement): ServicesHeroTargets {
  return {
    copy: root.querySelector<HTMLElement>("[data-services-hero-copy]"),
    cta: root.querySelector<HTMLElement>("[data-services-hero-cta]"),
    eyebrow: root.querySelector<HTMLElement>("[data-services-hero-eyebrow]"),
    image: root.querySelector<HTMLElement>("[data-services-hero-image]"),
    lines: queryAll(root, "[data-services-hero-line]"),
    mask: root.querySelector<HTMLElement>("[data-services-hero-mask]"),
    parallax: root.querySelector<HTMLElement>("[data-services-hero-parallax]"),
  };
}

export function createServicesHeroAnimation(
  root: HTMLElement,
  options: ServicesHeroAnimationOptions = {},
): ServicesHeroAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableClipPath = options.enableClipPath ?? true;
  const enableParallax = options.enableParallax ?? !compact;
  const imageScale = compact
    ? SERVICES_HERO_IMAGE_SCALE_MOBILE
    : SERVICES_HERO_IMAGE_SCALE_FROM;
  const headingDuration = compact
    ? SERVICES_HERO_HEADING_DURATION_COMPACT
    : SERVICES_HERO_HEADING_DURATION;
  const imageDuration = compact
    ? SERVICES_HERO_IMAGE_DURATION_COMPACT
    : SERVICES_HERO_IMAGE_DURATION;
  const targets = collectTargets(root);

  if (targets.eyebrow !== null) {
    gsap.set(targets.eyebrow, { opacity: 0, y: SERVICES_HERO_EYEBROW_Y_PX });
  }

  gsap.set(targets.lines, {
    opacity: 0,
    yPercent: SERVICES_HERO_LINE_Y_PERCENT,
  });

  if (targets.copy !== null) {
    gsap.set(targets.copy, { opacity: 0, y: SERVICES_HERO_COPY_Y_PX });
  }

  if (targets.cta !== null) {
    gsap.set(targets.cta, { opacity: 0, y: SERVICES_HERO_CTA_Y_PX });
  }

  if (targets.image !== null) {
    gsap.set(targets.image, {
      force3D: true,
      opacity: 0,
      scale: imageScale,
    });
  }

  if (targets.mask !== null && enableClipPath) {
    gsap.set(targets.mask, { clipPath: SERVICES_HERO_CLIP_HIDDEN });
  }

  if (enableScrollTrigger) {
    registerGsapPlugins(ScrollTrigger);
  }

  const timeline = gsap.timeline({
    defaults: { ease: easings.enter.gsap },
    paused: true,
  });

  if (targets.eyebrow !== null) {
    timeline.to(
      targets.eyebrow,
      {
        duration: SERVICES_HERO_EYEBROW_DURATION,
        opacity: 1,
        y: 0,
      },
      0,
    );
  }

  if (targets.lines.length > 0) {
    timeline.to(
      targets.lines,
      {
        duration: headingDuration,
        opacity: 1,
        stagger: SERVICES_HERO_LINE_STAGGER,
        yPercent: 0,
      },
      0.16,
    );
  }

  if (targets.copy !== null) {
    timeline.to(
      targets.copy,
      {
        duration: SERVICES_HERO_COPY_DURATION,
        opacity: 1,
        y: 0,
      },
      0.42,
    );
  }

  if (targets.cta !== null) {
    timeline.to(
      targets.cta,
      {
        duration: SERVICES_HERO_CTA_DURATION,
        opacity: 1,
        y: 0,
      },
      0.62,
    );
  }

  if (targets.mask !== null && enableClipPath) {
    timeline.to(
      targets.mask,
      {
        clipPath: SERVICES_HERO_CLIP_VISIBLE,
        duration: imageDuration,
      },
      0.7,
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
      0.7,
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
      start: SERVICES_HERO_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  if (enableParallax && enableScrollTrigger && targets.parallax !== null) {
    gsap.fromTo(
      targets.parallax,
      { yPercent: -SERVICES_HERO_PARALLAX_Y_PERCENT },
      {
        ease: "none",
        scrollTrigger: {
          end: "bottom top",
          invalidateOnRefresh: true,
          scrub: SERVICES_HERO_PARALLAX_SCRUB,
          start: "top bottom",
          trigger: targets.parallax,
        },
        yPercent: SERVICES_HERO_PARALLAX_Y_PERCENT,
      },
    );
  }

  return { timeline };
}
