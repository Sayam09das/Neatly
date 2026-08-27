import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const ABOUT_COMMITMENT_COPY_Y_PX = 25;
export const ABOUT_COMMITMENT_DURATION = 0.8;
export const ABOUT_COMMITMENT_DURATION_MOBILE = 0.55;
export const ABOUT_COMMITMENT_CLIP_HIDDEN = "inset(0 0 100% 0)";
export const ABOUT_COMMITMENT_CLIP_VISIBLE = "inset(0 0 0% 0)";
export const ABOUT_COMMITMENT_SCROLL_START = "top 75%";

export interface AboutCommitmentAnimationOptions {
  compact?: boolean;
  enableClipPath?: boolean;
  enableScrollTrigger?: boolean;
}

export interface AboutCommitmentAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createAboutCommitmentAnimation(
  root: HTMLElement,
  options: AboutCommitmentAnimationOptions = {},
): AboutCommitmentAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableClipPath = options.enableClipPath ?? !compact;
  const duration = compact
    ? ABOUT_COMMITMENT_DURATION_MOBILE
    : ABOUT_COMMITMENT_DURATION;
  const eyebrow = root.querySelector<HTMLElement>(
    "[data-about-commitment-eyebrow]",
  );
  const headingMask = root.querySelector<HTMLElement>(
    "[data-about-commitment-heading-mask]",
  );
  const heading = root.querySelector<HTMLElement>(
    "[data-about-commitment-heading]",
  );
  const copyItems = queryAll(root, "[data-about-commitment-copy]");
  const rule = root.querySelector<HTMLElement>("[data-about-commitment-rule]");

  if (eyebrow !== null) {
    gsap.set(eyebrow, { opacity: 0, y: ABOUT_COMMITMENT_COPY_Y_PX });
  }

  if (heading !== null) {
    gsap.set(heading, { opacity: 0, y: ABOUT_COMMITMENT_COPY_Y_PX });
  }

  if (headingMask !== null && enableClipPath) {
    gsap.set(headingMask, { clipPath: ABOUT_COMMITMENT_CLIP_HIDDEN });
  }

  gsap.set(copyItems, { opacity: 0, y: ABOUT_COMMITMENT_COPY_Y_PX });

  if (rule !== null) {
    gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
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

  if (eyebrow !== null) {
    timeline.to(eyebrow, { opacity: 1, y: 0 }, 0);
  }

  if (heading !== null) {
    timeline.to(heading, { opacity: 1, y: 0 }, 0.08);
  }

  if (headingMask !== null && enableClipPath) {
    timeline.to(headingMask, { clipPath: ABOUT_COMMITMENT_CLIP_VISIBLE }, 0.08);
  }

  if (rule !== null) {
    timeline.to(rule, { duration: duration * 0.5, scaleX: 1 }, 0.18);
  }

  timeline.to(copyItems, { opacity: 1, stagger: 0.08, y: 0 }, 0.24);

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        timeline.progress(self.scroll() >= self.start ? 1 : 0);
      },
      start: ABOUT_COMMITMENT_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  return { timeline };
}
