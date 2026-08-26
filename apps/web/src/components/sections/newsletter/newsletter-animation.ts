import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const NEWSLETTER_EYEBROW_Y_PX = 20;
export const NEWSLETTER_HEADING_Y_PX = 36;
export const NEWSLETTER_INTRO_Y_PX = 20;
export const NEWSLETTER_FORM_Y_PX = 24;
export const NEWSLETTER_IMAGE_SCALE_FROM = 1.08;
export const NEWSLETTER_DURATION_DESKTOP = 0.75;
export const NEWSLETTER_DURATION_MOBILE = 0.55;
export const NEWSLETTER_HEADER_STAGGER = 0.08;
export const NEWSLETTER_PARALLAX_Y_PERCENT = 6;
export const NEWSLETTER_PARALLAX_SCRUB = 0.6;
export const NEWSLETTER_STORY_SCRUB = 0.5;
export const NEWSLETTER_MOBILE_QUERY = "(max-width: 767px)";
export const NEWSLETTER_SCROLL_START = "top 78%";
export const NEWSLETTER_STORY_END = "center 58%";
export const NEWSLETTER_HEADER_AT = 0;
export const NEWSLETTER_INTRO_AT = 0.16;
export const NEWSLETTER_FORM_AT = 0.32;
export const NEWSLETTER_MEDIA_AT = 0;

export interface NewsletterAnimationOptions {
  compact?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface NewsletterAnimationResult {
  timeline: gsap.core.Timeline;
}

interface NewsletterTargets {
  consent: HTMLElement | null;
  eyebrow: HTMLElement | null;
  form: HTMLElement | null;
  heading: HTMLElement | null;
  intro: HTMLElement | null;
  media: HTMLElement | null;
  parallax: HTMLElement | null;
}

function collectTargets(root: HTMLElement): NewsletterTargets {
  return {
    consent: root.querySelector<HTMLElement>("[data-newsletter-consent]"),
    eyebrow: root.querySelector<HTMLElement>("[data-newsletter-eyebrow]"),
    form: root.querySelector<HTMLElement>("[data-newsletter-form]"),
    heading: root.querySelector<HTMLElement>("[data-newsletter-heading]"),
    intro: root.querySelector<HTMLElement>("[data-newsletter-intro]"),
    media: root.querySelector<HTMLElement>("[data-newsletter-media]"),
    parallax: root.querySelector<HTMLElement>("[data-newsletter-parallax]"),
  };
}

function setInitialStates(targets: NewsletterTargets): void {
  if (targets.eyebrow !== null) {
    gsap.set(targets.eyebrow, { opacity: 0, y: NEWSLETTER_EYEBROW_Y_PX });
  }

  if (targets.heading !== null) {
    gsap.set(targets.heading, { opacity: 0, y: NEWSLETTER_HEADING_Y_PX });
  }

  if (targets.intro !== null) {
    gsap.set(targets.intro, { opacity: 0, y: NEWSLETTER_INTRO_Y_PX });
  }

  if (targets.form !== null) {
    gsap.set(targets.form, { opacity: 0, y: NEWSLETTER_FORM_Y_PX });
  }

  if (targets.consent !== null) {
    gsap.set(targets.consent, { opacity: 0, y: NEWSLETTER_FORM_Y_PX });
  }

  if (targets.media !== null) {
    gsap.set(targets.media, {
      force3D: true,
      scale: NEWSLETTER_IMAGE_SCALE_FROM,
    });
  }
}

function createPausedTimeline(duration: number): gsap.core.Timeline {
  return gsap.timeline({
    defaults: {
      duration,
      ease: easings.enter.gsap,
    },
    paused: true,
  });
}

function addStoryTweens(
  timeline: gsap.core.Timeline,
  targets: NewsletterTargets,
  duration: number,
): void {
  if (targets.media !== null) {
    timeline.to(targets.media, { scale: 1 }, NEWSLETTER_MEDIA_AT);
  }

  if (targets.eyebrow !== null) {
    timeline.to(
      targets.eyebrow,
      { duration: duration * 0.75, opacity: 1, y: 0 },
      NEWSLETTER_HEADER_AT,
    );
  }

  if (targets.heading !== null) {
    timeline.to(
      targets.heading,
      { opacity: 1, y: 0 },
      NEWSLETTER_HEADER_AT + NEWSLETTER_HEADER_STAGGER,
    );
  }

  if (targets.intro !== null) {
    timeline.to(
      targets.intro,
      { duration: duration * 0.75, opacity: 1, y: 0 },
      NEWSLETTER_INTRO_AT,
    );
  }

  if (targets.form !== null) {
    timeline.to(targets.form, { opacity: 1, y: 0 }, NEWSLETTER_FORM_AT);
  }

  if (targets.consent !== null) {
    timeline.to(
      targets.consent,
      { duration: duration * 0.7, opacity: 1, y: 0 },
      NEWSLETTER_FORM_AT + NEWSLETTER_HEADER_STAGGER,
    );
  }
}

function createParallax(targets: NewsletterTargets): void {
  if (targets.parallax === null) {
    return;
  }

  gsap.fromTo(
    targets.parallax,
    { yPercent: -NEWSLETTER_PARALLAX_Y_PERCENT },
    {
      ease: "none",
      scrollTrigger: {
        end: "bottom top",
        invalidateOnRefresh: true,
        scrub: NEWSLETTER_PARALLAX_SCRUB,
        start: "top bottom",
        trigger: targets.parallax,
      },
      yPercent: NEWSLETTER_PARALLAX_Y_PERCENT,
    },
  );
}

export function createNewsletterAnimation(
  root: HTMLElement,
  options: NewsletterAnimationOptions = {},
): NewsletterAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableParallax = options.enableParallax ?? !compact;
  const targets = collectTargets(root);
  const duration = compact
    ? NEWSLETTER_DURATION_MOBILE
    : NEWSLETTER_DURATION_DESKTOP;

  setInitialStates(targets);

  if (enableScrollTrigger) {
    registerGsapPlugins(ScrollTrigger);
  }

  const timeline = createPausedTimeline(duration);
  addStoryTweens(timeline, targets, duration);

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      end: NEWSLETTER_STORY_END,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      scrub: NEWSLETTER_STORY_SCRUB,
      start: NEWSLETTER_SCROLL_START,
      trigger: root,
    });
  }

  if (enableParallax && enableScrollTrigger) {
    createParallax(targets);
  }

  return { timeline };
}
