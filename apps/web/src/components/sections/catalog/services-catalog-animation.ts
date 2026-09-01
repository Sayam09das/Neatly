import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const CATALOG_HEADER_Y_PX = 16;
export const CATALOG_CARD_Y_PX = 20;
export const CATALOG_CARD_Y_COMPACT_PX = 12;
export const CATALOG_DURATION = 0.7;
export const CATALOG_DURATION_COMPACT = 0.5;
export const CATALOG_HEADER_STAGGER = 0.06;
export const CATALOG_CARD_STAGGER = 0.08;
export const CATALOG_SCROLL_START = "top 78%";
export const CATALOG_HOVER_IMAGE_SCALE = 1.03;
export const CATALOG_HOVER_ARROW_X_PX = 4;
export const CATALOG_FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

export interface CatalogAnimationOptions {
  compact?: boolean;
  enableScrollTrigger?: boolean;
}

export interface CatalogAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createCatalogAnimation(
  root: HTMLElement,
  options: CatalogAnimationOptions = {},
): CatalogAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const cardY = compact ? CATALOG_CARD_Y_COMPACT_PX : CATALOG_CARD_Y_PX;
  const duration = compact ? CATALOG_DURATION_COMPACT : CATALOG_DURATION;
  const headerItems = queryAll(root, "[data-catalog-header-item]");
  const cards = queryAll(root, "[data-catalog-card]");

  gsap.set(headerItems, { opacity: 0, y: CATALOG_HEADER_Y_PX });
  gsap.set(cards, { force3D: true, opacity: 0, y: cardY });

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

  timeline.to(
    headerItems,
    {
      duration: duration * 0.75,
      opacity: 1,
      stagger: CATALOG_HEADER_STAGGER,
      y: 0,
    },
    0,
  );

  timeline.to(
    cards,
    {
      opacity: 1,
      stagger: CATALOG_CARD_STAGGER,
      y: 0,
    },
    0.16,
  );

  if (enableScrollTrigger) {
    ScrollTrigger.create({
      animation: timeline,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      onRefresh: (self): void => {
        timeline.progress(self.scroll() >= self.start ? 1 : 0);
      },
      start: CATALOG_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  return { timeline };
}
