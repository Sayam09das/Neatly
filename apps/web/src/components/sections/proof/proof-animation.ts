import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const PROOF_ITEM_COUNT = 4;
export const PROOF_EYEBROW_Y_PX = 24;
export const PROOF_INTRO_Y_PX = 24;
export const PROOF_ITEM_Y_PX = 20;
export const PROOF_NUMBER_Y_PX = 10;
export const PROOF_NUMBER_SCALE_FROM = 0.96;
export const PROOF_IMAGE_SCALE_FROM_DESKTOP = 1.1;
export const PROOF_IMAGE_SCALE_SETTLE = 1.06;
export const PROOF_IMAGE_SCALE_FROM_MOBILE = 1.05;
export const PROOF_IMAGE_Y_MOBILE_PX = 20;
export const PROOF_DURATION_DESKTOP = 0.8;
export const PROOF_DURATION_MOBILE = 0.65;
export const PROOF_RULE_DURATION_RATIO = 0.5;
export const PROOF_HEADER_STAGGER = 0.1;
export const PROOF_ITEM_STAGGER = 0.12;
export const PROOF_PARALLAX_Y_PERCENT = 4;
export const PROOF_PARALLAX_SCRUB = 0.55;
export const PROOF_STORY_SCRUB = 0.55;
export const PROOF_HOVER_LIFT_PX = 3;
export const PROOF_HOVER_IMAGE_SCALE = 1.03;
export const PROOF_TAP_SCALE = 0.99;
export const PROOF_ITEM_INACTIVE_OPACITY = 0.62;
export const PROOF_CLIP_IMAGE_HIDDEN = "inset(0 100% 0 0)";
export const PROOF_CLIP_IMAGE_VISIBLE = "inset(0 0% 0 0)";
export const PROOF_CLIP_HEADING_HIDDEN = "inset(0 0 100% 0)";
export const PROOF_CLIP_HEADING_VISIBLE = "inset(0 0 0% 0)";
export const PROOF_MOBILE_QUERY = "(max-width: 767px)";
export const PROOF_STACKED_QUERY = "(max-width: 1023px)";
export const PROOF_FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
export const PROOF_SCROLL_START = "top 75%";
export const PROOF_STORY_END = "center 48%";
export const PROOF_MOBILE_BLOCK_START = "top 82%";
export const PROOF_ACTIVE_START = "top 58%";
export const PROOF_ACTIVE_END = "bottom 42%";
export const PROOF_EYEBROW_AT = 0;
export const PROOF_HEADING_AT = 0.1;
export const PROOF_INTRO_AT = 0.2;
export const PROOF_IMAGE_AT = 0.28;
export const PROOF_ITEMS_AT = 0.42;

export interface ProofAnimationOptions {
  compact?: boolean;
  enableActiveState?: boolean;
  enableClipPath?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface ProofAnimationResult {
  timeline: gsap.core.Timeline;
}

interface ProofItemTargets {
  body: HTMLElement | undefined;
  item: HTMLElement;
  number: HTMLElement | undefined;
  rule: HTMLElement | undefined;
}

interface ProofTargets {
  copy: HTMLElement | null;
  eyebrow: HTMLElement | null;
  heading: HTMLElement | null;
  headingMask: HTMLElement | null;
  intro: HTMLElement | null;
  items: Array<ProofItemTargets>;
  list: HTMLElement | null;
  media: HTMLElement | null;
  mask: HTMLElement | null;
  image: HTMLElement | null;
  parallax: HTMLElement | null;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function collectTargets(root: HTMLElement): ProofTargets {
  const items = queryAll(root, "[data-proof-item]").map((item) => ({
    body:
      item.querySelector<HTMLElement>("[data-proof-item-body]") ?? undefined,
    item,
    number: item.querySelector<HTMLElement>("[data-proof-number]") ?? undefined,
    rule:
      item.querySelector<HTMLElement>("[data-proof-item-rule]") ?? undefined,
  }));

  return {
    copy: root.querySelector<HTMLElement>("[data-proof-copy]"),
    eyebrow: root.querySelector<HTMLElement>("[data-proof-eyebrow]"),
    heading: root.querySelector<HTMLElement>("[data-proof-heading]"),
    headingMask: root.querySelector<HTMLElement>("[data-proof-heading-mask]"),
    intro: root.querySelector<HTMLElement>("[data-proof-intro]"),
    items,
    list: root.querySelector<HTMLElement>("[data-proof-list]"),
    media: root.querySelector<HTMLElement>("[data-proof-media]"),
    mask: root.querySelector<HTMLElement>("[data-proof-image-mask]"),
    image: root.querySelector<HTMLElement>("[data-proof-image-reveal]"),
    parallax: root.querySelector<HTMLElement>("[data-proof-image-parallax]"),
  };
}

function setInitialStates(
  targets: ProofTargets,
  compact: boolean,
  enableClipPath: boolean,
): void {
  if (targets.eyebrow !== null) {
    gsap.set(targets.eyebrow, { opacity: 0, y: PROOF_EYEBROW_Y_PX });
  }

  if (targets.headingMask !== null) {
    gsap.set(targets.headingMask, { clipPath: PROOF_CLIP_HEADING_HIDDEN });
  }

  if (targets.heading !== null) {
    gsap.set(targets.heading, { opacity: 0 });
  }

  if (targets.intro !== null) {
    gsap.set(targets.intro, { opacity: 0, y: PROOF_INTRO_Y_PX });
  }

  if (enableClipPath && targets.mask !== null) {
    gsap.set(targets.mask, { clipPath: PROOF_CLIP_IMAGE_HIDDEN });
  }

  if (targets.image !== null) {
    if (compact && !enableClipPath) {
      gsap.set(targets.image, {
        force3D: true,
        opacity: 0,
        scale: PROOF_IMAGE_SCALE_FROM_MOBILE,
        y: PROOF_IMAGE_Y_MOBILE_PX,
      });
    } else {
      gsap.set(targets.image, {
        force3D: true,
        scale: PROOF_IMAGE_SCALE_FROM_DESKTOP,
      });
    }
  }

  for (const target of targets.items) {
    gsap.set(target.item, { force3D: true, opacity: 0, y: PROOF_ITEM_Y_PX });

    if (target.number !== undefined) {
      gsap.set(target.number, {
        opacity: 0,
        scale: PROOF_NUMBER_SCALE_FROM,
        y: PROOF_NUMBER_Y_PX,
      });
    }

    if (target.rule !== undefined) {
      gsap.set(target.rule, { scaleX: 0, transformOrigin: "left center" });
    }
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

function addHeaderTweens(
  timeline: gsap.core.Timeline,
  targets: ProofTargets,
  duration: number,
): void {
  if (targets.eyebrow !== null) {
    timeline.to(
      targets.eyebrow,
      { duration: duration * 0.85, opacity: 1, y: 0 },
      PROOF_EYEBROW_AT,
    );
  }

  if (targets.headingMask !== null) {
    timeline.to(
      targets.headingMask,
      { clipPath: PROOF_CLIP_HEADING_VISIBLE },
      PROOF_HEADING_AT,
    );
  }

  if (targets.heading !== null) {
    timeline.to(targets.heading, { opacity: 1 }, PROOF_HEADING_AT);
  }

  if (targets.intro !== null) {
    timeline.to(
      targets.intro,
      { duration: duration * 0.85, opacity: 1, y: 0 },
      PROOF_INTRO_AT,
    );
  }
}

function addImageTweens(
  timeline: gsap.core.Timeline,
  targets: ProofTargets,
  compact: boolean,
  enableClipPath: boolean,
  duration: number,
  at: number,
): void {
  if (enableClipPath && targets.mask !== null) {
    timeline.to(targets.mask, { clipPath: PROOF_CLIP_IMAGE_VISIBLE }, at);
  }

  if (targets.image === null) {
    return;
  }

  if (compact && !enableClipPath) {
    timeline.to(targets.image, { opacity: 1, scale: 1, y: 0 }, at);
    return;
  }

  timeline.to(targets.image, { scale: PROOF_IMAGE_SCALE_SETTLE }, at);
  timeline.to(
    targets.image,
    { duration: duration * 0.7, scale: 1 },
    at + duration * 0.45,
  );
}

function addItemTweens(
  timeline: gsap.core.Timeline,
  target: ProofItemTargets,
  duration: number,
  at: number,
): void {
  if (target.rule !== undefined) {
    timeline.to(
      target.rule,
      { duration: duration * PROOF_RULE_DURATION_RATIO, scaleX: 1 },
      at,
    );
  }

  timeline.to(target.item, { opacity: 1, y: 0 }, at + 0.04);

  if (target.number !== undefined) {
    timeline.to(target.number, { opacity: 1, scale: 1, y: 0 }, at + 0.04);
  }
}

function addListTweens(
  timeline: gsap.core.Timeline,
  targets: ProofTargets,
  duration: number,
): void {
  for (const [index, target] of targets.items.entries()) {
    addItemTweens(
      timeline,
      target,
      duration,
      PROOF_ITEMS_AT + index * PROOF_ITEM_STAGGER,
    );
  }
}

function attachPlayTrigger(
  timeline: gsap.core.Timeline,
  trigger: HTMLElement,
  start: string,
): void {
  ScrollTrigger.create({
    animation: timeline,
    fastScrollEnd: true,
    invalidateOnRefresh: true,
    onRefresh: (self): void => {
      timeline.progress(self.scroll() >= self.start ? 1 : 0);
    },
    start,
    toggleActions: "play none none reverse",
    trigger,
  });
}

function createHeaderTimeline(
  targets: ProofTargets,
  duration: number,
): gsap.core.Timeline {
  const timeline = createPausedTimeline(duration);
  addHeaderTweens(timeline, targets, duration);
  return timeline;
}

function createImageTimeline(
  targets: ProofTargets,
  compact: boolean,
  enableClipPath: boolean,
  duration: number,
): gsap.core.Timeline {
  const timeline = createPausedTimeline(duration);
  addImageTweens(timeline, targets, compact, enableClipPath, duration, 0);
  return timeline;
}

function createStoryTimeline(
  targets: ProofTargets,
  compact: boolean,
  enableClipPath: boolean,
): gsap.core.Timeline {
  const duration = compact ? PROOF_DURATION_MOBILE : PROOF_DURATION_DESKTOP;
  const timeline = createPausedTimeline(duration);
  addHeaderTweens(timeline, targets, duration);
  addImageTweens(
    timeline,
    targets,
    compact,
    enableClipPath,
    duration,
    compact ? PROOF_IMAGE_AT * 0.6 : PROOF_IMAGE_AT,
  );
  addListTweens(timeline, targets, duration);
  return timeline;
}

function createStackedBlockTriggers(
  root: HTMLElement,
  targets: ProofTargets,
  enableClipPath: boolean,
): gsap.core.Timeline {
  const duration = PROOF_DURATION_MOBILE;
  const headerTimeline = createHeaderTimeline(targets, duration);

  attachPlayTrigger(headerTimeline, targets.copy ?? root, PROOF_SCROLL_START);

  const imageTimeline = createImageTimeline(
    targets,
    true,
    enableClipPath,
    duration,
  );
  attachPlayTrigger(
    imageTimeline,
    targets.media ?? targets.mask ?? root,
    PROOF_MOBILE_BLOCK_START,
  );

  for (const target of targets.items) {
    const itemTimeline = createPausedTimeline(duration);
    addItemTweens(itemTimeline, target, duration, 0);
    attachPlayTrigger(itemTimeline, target.item, PROOF_MOBILE_BLOCK_START);
  }

  return headerTimeline;
}

function createParallax(targets: ProofTargets): void {
  if (targets.parallax === null) {
    return;
  }

  gsap.fromTo(
    targets.parallax,
    { yPercent: -PROOF_PARALLAX_Y_PERCENT },
    {
      ease: "none",
      scrollTrigger: {
        end: "bottom top",
        invalidateOnRefresh: true,
        scrub: PROOF_PARALLAX_SCRUB,
        start: "top bottom",
        trigger: targets.parallax,
      },
      yPercent: PROOF_PARALLAX_Y_PERCENT,
    },
  );
}

function createActiveItemTriggers(targets: ProofTargets): void {
  const bodies = targets.items
    .map((target) => target.body)
    .filter((body): body is HTMLElement => body !== undefined);
  const list = targets.list ?? targets.items[0]?.item.parentElement ?? null;

  if (bodies.length === 0 || list === null) {
    return;
  }

  let activeIndex = -1;

  const setActive = (nextIndex: number): void => {
    if (nextIndex === activeIndex) {
      return;
    }

    activeIndex = nextIndex;

    for (const [index, body] of bodies.entries()) {
      gsap.to(body, {
        duration: 0.35,
        ease: easings.standard.gsap,
        opacity: index === nextIndex ? 1 : PROOF_ITEM_INACTIVE_OPACITY,
        overwrite: "auto",
      });
    }
  };

  const clearActive = (): void => {
    activeIndex = -1;
    gsap.to(bodies, {
      duration: 0.3,
      ease: easings.standard.gsap,
      opacity: 1,
      overwrite: "auto",
    });
  };

  ScrollTrigger.create({
    end: PROOF_ACTIVE_END,
    fastScrollEnd: true,
    invalidateOnRefresh: true,
    onLeave: clearActive,
    onLeaveBack: clearActive,
    onUpdate: (self): void => {
      const nextIndex = Math.min(
        bodies.length - 1,
        Math.floor(self.progress * bodies.length),
      );
      setActive(nextIndex);
    },
    start: PROOF_ACTIVE_START,
    trigger: list,
  });
}

export function createProofAnimation(
  root: HTMLElement,
  options: ProofAnimationOptions = {},
): ProofAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableClipPath = options.enableClipPath ?? !compact;
  const enableParallax = options.enableParallax ?? !compact;
  const enableActiveState = options.enableActiveState ?? !compact;
  const targets = collectTargets(root);

  setInitialStates(targets, compact, enableClipPath);

  if (enableScrollTrigger) {
    registerGsapPlugins(ScrollTrigger);
  }

  if (enableScrollTrigger && compact) {
    const timeline = createStackedBlockTriggers(root, targets, enableClipPath);

    if (enableParallax) {
      createParallax(targets);
    }

    if (enableActiveState) {
      createActiveItemTriggers(targets);
    }

    return { timeline };
  }

  const timeline = createStoryTimeline(targets, compact, enableClipPath);

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      end: PROOF_STORY_END,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      scrub: PROOF_STORY_SCRUB,
      start: PROOF_SCROLL_START,
      trigger: root,
    });
  }

  if (enableParallax && enableScrollTrigger) {
    createParallax(targets);
  }

  if (enableActiveState && enableScrollTrigger) {
    createActiveItemTriggers(targets);
  }

  return { timeline };
}
