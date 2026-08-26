import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const WHY_CARD_COUNT = 3;
export const WHY_METRIC_COUNT = 4;
export const WHY_CARD_Y_DESKTOP_PX = 50;
export const WHY_CARD_Y_MOBILE_PX = 24;
export const WHY_CARD_SCALE_FROM = 0.98;
export const WHY_IMAGE_SCALE_FROM_DESKTOP = 1.08;
export const WHY_IMAGE_SCALE_FROM_MOBILE = 1.04;
export const WHY_HEADER_Y_PX = 16;
export const WHY_CONTENT_Y_PX = 20;
export const WHY_METRIC_Y_PX = 24;
export const WHY_DURATION_DESKTOP = 0.8;
export const WHY_DURATION_MOBILE = 0.55;
export const WHY_HEADER_STAGGER = 0.08;
export const WHY_CARD_STAGGER = 0.12;
export const WHY_METRIC_STAGGER = 0.1;
export const WHY_METRIC_ACCENT_DURATION_RATIO = 0.55;
export const WHY_METRICS_OVERLAP = 0.18;
export const WHY_PARALLAX_Y_PX = 8;
export const WHY_PARALLAX_SCRUB = 0.55;
export const WHY_HOVER_LIFT_PX = 4;
export const WHY_HOVER_IMAGE_SCALE = 1.04;
export const WHY_METRIC_HOVER_LIFT_PX = 3;
export const WHY_TAP_SCALE = 0.99;
export const WHY_METRIC_TAP_SCALE = 0.99;
export const WHY_MOBILE_QUERY = "(max-width: 767px)";
export const WHY_FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
export const WHY_SCROLL_START = "top 75%";
export const WHY_METRICS_SCROLL_START = "top 82%";

export interface WhyNeatlyAnimationOptions {
  compact?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface WhyNeatlyAnimationResult {
  timeline: gsap.core.Timeline;
}

interface WhyMetricTargets {
  accent: HTMLElement | undefined;
  item: HTMLElement;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function collectMetricTargets(root: HTMLElement): Array<WhyMetricTargets> {
  return queryAll(root, "[data-why-metric-item]").map((item) => ({
    accent:
      item.querySelector<HTMLElement>("[data-why-metric-accent]") ?? undefined,
    item,
  }));
}

function setMetricInitialStates(targets: Array<WhyMetricTargets>): void {
  for (const target of targets) {
    gsap.set(target.item, { force3D: true, opacity: 0, y: WHY_METRIC_Y_PX });

    if (target.accent !== undefined) {
      gsap.set(target.accent, {
        scaleX: 0,
        transformOrigin: "left center",
      });
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

function addMetricTweens(
  timeline: gsap.core.Timeline,
  targets: Array<WhyMetricTargets>,
  duration: number,
  startAt = 0,
): void {
  for (const [index, target] of targets.entries()) {
    const at = startAt + index * WHY_METRIC_STAGGER;

    timeline.to(target.item, { opacity: 1, y: 0 }, at);

    if (target.accent !== undefined) {
      timeline.to(
        target.accent,
        {
          duration: duration * WHY_METRIC_ACCENT_DURATION_RATIO,
          scaleX: 1,
        },
        at,
      );
    }
  }
}

export function createWhyMetricsAnimation(
  root: HTMLElement,
  options: Pick<
    WhyNeatlyAnimationOptions,
    "compact" | "enableScrollTrigger"
  > = {},
): WhyNeatlyAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const duration = compact ? WHY_DURATION_MOBILE : WHY_DURATION_DESKTOP;
  const targets = collectMetricTargets(root);

  setMetricInitialStates(targets);

  if (enableScrollTrigger) {
    registerGsapPlugins(ScrollTrigger);
  }

  const timeline = createPausedTimeline(duration);
  addMetricTweens(timeline, targets, duration);

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        if (self.scroll() >= self.start) {
          timeline.progress(1);
          return;
        }

        timeline.progress(0);
      },
      start: WHY_METRICS_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  return { timeline };
}

export function createWhyNeatlyAnimation(
  root: HTMLElement,
  options: WhyNeatlyAnimationOptions = {},
): WhyNeatlyAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableParallax = options.enableParallax ?? !compact;

  const cardY = compact ? WHY_CARD_Y_MOBILE_PX : WHY_CARD_Y_DESKTOP_PX;
  const imageScale = compact
    ? WHY_IMAGE_SCALE_FROM_MOBILE
    : WHY_IMAGE_SCALE_FROM_DESKTOP;
  const duration = compact ? WHY_DURATION_MOBILE : WHY_DURATION_DESKTOP;

  const headerItems = queryAll(root, "[data-why-header-item]");
  const cards = queryAll(root, "[data-why-card]");
  const images = queryAll(root, "[data-why-image-reveal]");
  const contents = queryAll(root, "[data-why-card-content]");
  const metricsBand = root.querySelector<HTMLElement>(
    "[data-why-metrics-band]",
  );
  const parallaxLayers = queryAll(root, "[data-why-image-parallax]");

  gsap.set(headerItems, { opacity: 0, y: WHY_HEADER_Y_PX });
  gsap.set(cards, {
    force3D: true,
    opacity: 0,
    scale: WHY_CARD_SCALE_FROM,
    y: cardY,
  });
  gsap.set(images, { force3D: true, scale: imageScale });
  gsap.set(contents, { opacity: 0, y: WHY_CONTENT_Y_PX });

  if (enableScrollTrigger) {
    registerGsapPlugins(ScrollTrigger);
  }

  const timeline = createPausedTimeline(duration);

  timeline.to(
    headerItems,
    {
      duration: duration * 0.75,
      opacity: 1,
      stagger: WHY_HEADER_STAGGER,
      y: 0,
    },
    0,
  );

  cards.forEach((card, index) => {
    const at = WHY_HEADER_STAGGER * 2 + index * WHY_CARD_STAGGER;
    const image = images[index];
    const content = contents[index];

    timeline.to(card, { opacity: 1, scale: 1, y: 0 }, at);

    if (image !== undefined) {
      timeline.to(image, { scale: 1 }, at);
    }

    if (content !== undefined) {
      timeline.to(
        content,
        { duration: duration * 0.7, opacity: 1, y: 0 },
        at + WHY_CARD_STAGGER / 2,
      );
    }
  });

  if (metricsBand !== null && !enableScrollTrigger) {
    const metricTargets = collectMetricTargets(metricsBand);
    setMetricInitialStates(metricTargets);
    addMetricTweens(
      timeline,
      metricTargets,
      duration,
      Math.max(timeline.duration() - WHY_METRICS_OVERLAP, 0),
    );
  }

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        if (self.scroll() >= self.start) {
          timeline.progress(1);
          return;
        }

        timeline.progress(0);
      },
      start: WHY_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });

    if (metricsBand !== null) {
      createWhyMetricsAnimation(metricsBand, {
        compact,
        enableScrollTrigger: true,
      });
    }
  }

  if (enableParallax && enableScrollTrigger) {
    for (const layer of parallaxLayers) {
      gsap.fromTo(
        layer,
        { y: -WHY_PARALLAX_Y_PX },
        {
          ease: "none",
          scrollTrigger: {
            end: "bottom top",
            invalidateOnRefresh: true,
            scrub: WHY_PARALLAX_SCRUB,
            start: "top bottom",
            trigger: layer,
          },
          y: WHY_PARALLAX_Y_PX,
        },
      );
    }
  }

  return { timeline };
}
