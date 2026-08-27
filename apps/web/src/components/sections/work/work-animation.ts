import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const WORK_TILE_COUNT = 6;
export const WORK_HEADER_Y_PX = 16;
export const WORK_TILE_Y_DESKTOP_PX = 40;
export const WORK_TILE_Y_MOBILE_PX = 20;
export const WORK_CTA_Y_PX = 16;
export const WORK_IMAGE_SCALE_FROM_DESKTOP = 1.08;
export const WORK_IMAGE_SCALE_FROM_MOBILE = 1.04;
export const WORK_DURATION_DESKTOP = 0.8;
export const WORK_DURATION_MOBILE = 0.55;
export const WORK_HEADER_STAGGER = 0.08;
export const WORK_TILE_STAGGER = 0.12;
export const WORK_PARALLAX_Y_PERCENT = 5;
export const WORK_PARALLAX_SCRUB = 0.55;
export const WORK_HOVER_LIFT_PX = 4;
export const WORK_HOVER_IMAGE_SCALE = 1.04;
export const WORK_INACTIVE_SCALE = 0.97;
export const WORK_TAP_SCALE = 0.99;
export const WORK_CLIP_HIDDEN = "inset(0% 0% 100% 0%)";
export const WORK_CLIP_VISIBLE = "inset(0% 0% 0% 0%)";
export const WORK_MOBILE_QUERY = "(max-width: 767px)";
export const WORK_FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
export const WORK_SCROLL_START = "top 75%";
export const WORK_GALLERY_LABEL = "Featured work photographs";
export const WORK_NEXT_PHOTO_LABEL = "Next work photograph";
export const WORK_PREVIOUS_PHOTO_LABEL = "Previous work photograph";

export interface WorkAnimationOptions {
  compact?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface WorkAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createWorkAnimation(
  root: HTMLElement,
  options: WorkAnimationOptions = {},
): WorkAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableParallax = options.enableParallax ?? !compact;
  const tileY = compact ? WORK_TILE_Y_MOBILE_PX : WORK_TILE_Y_DESKTOP_PX;
  const imageScale = compact
    ? WORK_IMAGE_SCALE_FROM_MOBILE
    : WORK_IMAGE_SCALE_FROM_DESKTOP;
  const duration = compact ? WORK_DURATION_MOBILE : WORK_DURATION_DESKTOP;

  const headerItems = queryAll(root, "[data-work-header-item]");
  const rule = root.querySelector<HTMLElement>("[data-work-rule]");
  const tiles = queryAll(root, "[data-work-tile]");
  const masks = queryAll(root, "[data-work-image-mask]");
  const images = queryAll(root, "[data-work-image-reveal]");
  const parallaxLayers = queryAll(root, "[data-work-image-parallax]");
  const empty = root.querySelector<HTMLElement>("[data-work-empty]");
  const cta = root.querySelector<HTMLElement>("[data-work-cta]");

  gsap.set(headerItems, { opacity: 0, y: WORK_HEADER_Y_PX });
  gsap.set(tiles, { force3D: true, opacity: 0, y: tileY });
  gsap.set(images, { force3D: true, scale: imageScale });

  if (rule !== null) {
    gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
  }

  if (!compact) {
    gsap.set(masks, { clipPath: WORK_CLIP_HIDDEN });
  }

  if (empty !== null) {
    gsap.set(empty, { opacity: 0, y: WORK_CTA_Y_PX });
  }

  if (cta !== null) {
    gsap.set(cta, { opacity: 0, y: WORK_CTA_Y_PX });
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

  timeline.to(
    headerItems,
    {
      duration: duration * 0.75,
      opacity: 1,
      stagger: WORK_HEADER_STAGGER,
      y: 0,
    },
    0,
  );

  if (rule !== null) {
    timeline.to(rule, { duration: duration * 0.5, scaleX: 1 }, 0.12);
  }

  tiles.forEach((tile, index) => {
    const at = 0.28 + index * WORK_TILE_STAGGER;
    const mask = masks[index];
    const image = images[index];

    timeline.to(tile, { opacity: 1, y: 0 }, at);

    if (!compact && mask !== undefined) {
      timeline.to(mask, { clipPath: WORK_CLIP_VISIBLE }, at);
    }

    if (image !== undefined) {
      timeline.to(image, { scale: 1 }, at);
    }
  });

  const afterTiles = 0.28 + Math.max(tiles.length - 1, 0) * WORK_TILE_STAGGER;

  if (empty !== null) {
    timeline.to(
      empty,
      { duration: duration * 0.75, opacity: 1, y: 0 },
      afterTiles + 0.16,
    );
  }

  if (cta !== null) {
    timeline.to(
      cta,
      { duration: duration * 0.75, opacity: 1, y: 0 },
      afterTiles + 0.24,
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
      start: WORK_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  if (enableParallax && enableScrollTrigger) {
    for (const layer of parallaxLayers) {
      gsap.fromTo(
        layer,
        { yPercent: -WORK_PARALLAX_Y_PERCENT },
        {
          ease: "none",
          scrollTrigger: {
            end: "bottom top",
            invalidateOnRefresh: true,
            scrub: WORK_PARALLAX_SCRUB,
            start: "top bottom",
            trigger: layer,
          },
          yPercent: WORK_PARALLAX_Y_PERCENT,
        },
      );
    }
  }

  return { timeline };
}
