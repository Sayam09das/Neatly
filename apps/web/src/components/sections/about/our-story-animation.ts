import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const ABOUT_STORY_EYEBROW_Y_PX = 20;
export const ABOUT_STORY_EYEBROW_Y_PX_COMPACT = 12;
export const ABOUT_STORY_COPY_Y_PX = 25;
export const ABOUT_STORY_COPY_Y_PX_COMPACT = 16;
export const ABOUT_STORY_DETAIL_Y_PX = 40;
export const ABOUT_STORY_DETAIL_Y_PX_COMPACT = 24;
export const ABOUT_STORY_LINE_Y_PERCENT = 100;
export const ABOUT_STORY_IMAGE_SCALE_FROM = 1.06;
export const ABOUT_STORY_IMAGE_SCALE_MOBILE = 1.03;
export const ABOUT_STORY_EYEBROW_DURATION = 0.5;
export const ABOUT_STORY_HEADING_DURATION = 0.8;
export const ABOUT_STORY_HEADING_DURATION_COMPACT = 0.6;
export const ABOUT_STORY_COPY_DURATION = 0.5;
export const ABOUT_STORY_DETAIL_DURATION = 0.6;
export const ABOUT_STORY_IMAGE_DURATION = 1;
export const ABOUT_STORY_IMAGE_DURATION_COMPACT = 0.8;
export const ABOUT_STORY_LINE_STAGGER = 0.08;
export const ABOUT_STORY_LINE_STAGGER_COMPACT = 0.05;
export const ABOUT_STORY_COPY_STAGGER = 0.1;
export const ABOUT_STORY_PARALLAX_Y_PERCENT = 4;
export const ABOUT_STORY_PARALLAX_SCRUB = 0.6;
export const ABOUT_STORY_CLIP_HIDDEN = "inset(0 0 100% 0)";
export const ABOUT_STORY_CLIP_VISIBLE = "inset(0 0 0% 0)";
export const ABOUT_STORY_SCROLL_START = "top 80%";
export const ABOUT_STORY_EYEBROW_AT = 0;
export const ABOUT_STORY_HEADING_AT = 0.16;
export const ABOUT_STORY_COPY_AT = 0.42;
export const ABOUT_STORY_IMAGE_AT = 0.62;
export const ABOUT_STORY_DETAIL_AT = 0.88;

export interface AboutStoryAnimationOptions {
  compact?: boolean;
  enableClipPath?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface AboutStoryAnimationResult {
  timeline: gsap.core.Timeline;
}

interface AboutStoryTargets {
  copy: Array<HTMLElement>;
  detail: HTMLElement | null;
  eyebrow: HTMLElement | null;
  image: HTMLElement | null;
  lines: Array<HTMLElement>;
  mask: HTMLElement | null;
  parallax: HTMLElement | null;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function collectTargets(root: HTMLElement): AboutStoryTargets {
  return {
    copy: queryAll(root, "[data-about-story-copy]"),
    detail: root.querySelector<HTMLElement>("[data-about-story-detail]"),
    eyebrow: root.querySelector<HTMLElement>("[data-about-story-eyebrow]"),
    image: root.querySelector<HTMLElement>("[data-about-story-image]"),
    lines: queryAll(root, "[data-about-story-line]"),
    mask: root.querySelector<HTMLElement>("[data-about-story-mask]"),
    parallax: root.querySelector<HTMLElement>("[data-about-story-parallax]"),
  };
}

export function createAboutStoryAnimation(
  root: HTMLElement,
  options: AboutStoryAnimationOptions = {},
): AboutStoryAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableClipPath = options.enableClipPath ?? true;
  const enableParallax = options.enableParallax ?? !compact;
  const imageScale = compact
    ? ABOUT_STORY_IMAGE_SCALE_MOBILE
    : ABOUT_STORY_IMAGE_SCALE_FROM;
  const eyebrowY = compact
    ? ABOUT_STORY_EYEBROW_Y_PX_COMPACT
    : ABOUT_STORY_EYEBROW_Y_PX;
  const copyY = compact ? ABOUT_STORY_COPY_Y_PX_COMPACT : ABOUT_STORY_COPY_Y_PX;
  const detailY = compact
    ? ABOUT_STORY_DETAIL_Y_PX_COMPACT
    : ABOUT_STORY_DETAIL_Y_PX;
  const headingDuration = compact
    ? ABOUT_STORY_HEADING_DURATION_COMPACT
    : ABOUT_STORY_HEADING_DURATION;
  const imageDuration = compact
    ? ABOUT_STORY_IMAGE_DURATION_COMPACT
    : ABOUT_STORY_IMAGE_DURATION;
  const lineStagger = compact
    ? ABOUT_STORY_LINE_STAGGER_COMPACT
    : ABOUT_STORY_LINE_STAGGER;
  const targets = collectTargets(root);

  if (targets.eyebrow !== null) {
    gsap.set(targets.eyebrow, { opacity: 0, y: eyebrowY });
  }

  gsap.set(targets.lines, {
    opacity: 0,
    yPercent: ABOUT_STORY_LINE_Y_PERCENT,
  });

  gsap.set(targets.copy, { opacity: 0, y: copyY });

  if (targets.detail !== null) {
    gsap.set(targets.detail, { opacity: 0, y: detailY });
  }

  if (targets.image !== null) {
    gsap.set(targets.image, {
      force3D: true,
      opacity: 0,
      scale: imageScale,
    });
  }

  if (targets.mask !== null && enableClipPath) {
    gsap.set(targets.mask, { clipPath: ABOUT_STORY_CLIP_HIDDEN });
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
        duration: ABOUT_STORY_EYEBROW_DURATION,
        opacity: 1,
        y: 0,
      },
      ABOUT_STORY_EYEBROW_AT,
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
      ABOUT_STORY_HEADING_AT,
    );
  }

  if (targets.copy.length > 0) {
    timeline.to(
      targets.copy,
      {
        duration: ABOUT_STORY_COPY_DURATION,
        opacity: 1,
        stagger: ABOUT_STORY_COPY_STAGGER,
        y: 0,
      },
      ABOUT_STORY_COPY_AT,
    );
  }

  if (targets.mask !== null && enableClipPath) {
    timeline.to(
      targets.mask,
      {
        clipPath: ABOUT_STORY_CLIP_VISIBLE,
        duration: imageDuration,
      },
      ABOUT_STORY_IMAGE_AT,
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
      ABOUT_STORY_IMAGE_AT,
    );
  }

  if (targets.detail !== null) {
    timeline.to(
      targets.detail,
      {
        duration: ABOUT_STORY_DETAIL_DURATION,
        opacity: 1,
        y: 0,
      },
      ABOUT_STORY_DETAIL_AT,
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
      start: ABOUT_STORY_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  if (enableParallax && enableScrollTrigger && targets.parallax !== null) {
    gsap.fromTo(
      targets.parallax,
      { yPercent: -ABOUT_STORY_PARALLAX_Y_PERCENT },
      {
        ease: "none",
        scrollTrigger: {
          end: "bottom top",
          invalidateOnRefresh: true,
          scrub: ABOUT_STORY_PARALLAX_SCRUB,
          start: "top bottom",
          trigger: targets.parallax,
        },
        yPercent: ABOUT_STORY_PARALLAX_Y_PERCENT,
      },
    );
  }

  return { timeline };
}
