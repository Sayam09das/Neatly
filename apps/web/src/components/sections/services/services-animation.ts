import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const SERVICES_CARD_COUNT = 3;
export const SERVICES_HEADER_Y_PX = 16;
export const SERVICES_CARD_Y_DESKTOP_PX = 40;
export const SERVICES_CARD_Y_MOBILE_PX = 20;
export const SERVICES_IMAGE_SCALE_FROM_DESKTOP = 1.08;
export const SERVICES_IMAGE_SCALE_FROM_MOBILE = 1.04;
export const SERVICES_DURATION_DESKTOP = 0.8;
export const SERVICES_DURATION_MOBILE = 0.55;
export const SERVICES_HEADER_STAGGER = 0.08;
export const SERVICES_CARD_STAGGER = 0.14;
export const SERVICES_PARALLAX_Y_PERCENT = 5;
export const SERVICES_PARALLAX_SCRUB = 0.55;
export const SERVICES_HOVER_LIFT_PX = 4;
export const SERVICES_HOVER_IMAGE_SCALE = 1.04;
export const SERVICES_HOVER_ARROW_X_PX = 4;
export const SERVICES_TAP_SCALE = 0.99;
export const SERVICES_CLIP_HIDDEN = "inset(0% 0% 100% 0%)";
export const SERVICES_CLIP_VISIBLE = "inset(0% 0% 0% 0%)";
export const SERVICES_MOBILE_QUERY = "(max-width: 767px)";
export const SERVICES_FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
export const SERVICES_SCROLL_START = "top 75%";

export interface ServicesAnimationOptions {
  compact?: boolean;
  enableParallax?: boolean;
  enableScrollTrigger?: boolean;
}

export interface ServicesAnimationResult {
  timeline: gsap.core.Timeline;
}

function queryAll(root: HTMLElement, selector: string): Array<HTMLElement> {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

export function createServicesAnimation(
  root: HTMLElement,
  options: ServicesAnimationOptions = {},
): ServicesAnimationResult {
  const compact = options.compact ?? false;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const enableParallax = options.enableParallax ?? !compact;
  const cardY = compact
    ? SERVICES_CARD_Y_MOBILE_PX
    : SERVICES_CARD_Y_DESKTOP_PX;
  const imageScale = compact
    ? SERVICES_IMAGE_SCALE_FROM_MOBILE
    : SERVICES_IMAGE_SCALE_FROM_DESKTOP;
  const duration = compact
    ? SERVICES_DURATION_MOBILE
    : SERVICES_DURATION_DESKTOP;

  const headerItems = queryAll(root, "[data-services-header-item]");
  const rule = root.querySelector<HTMLElement>("[data-services-rule]");
  const cards = queryAll(root, "[data-service-card]");
  const masks = queryAll(root, "[data-service-image-mask]");
  const images = queryAll(root, "[data-service-image-reveal]");
  const parallaxLayers = queryAll(root, "[data-service-image-parallax]");

  gsap.set(headerItems, { opacity: 0, y: SERVICES_HEADER_Y_PX });
  gsap.set(cards, { force3D: true, opacity: 0, y: cardY });
  gsap.set(images, { force3D: true, scale: imageScale });

  if (rule !== null) {
    gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
  }

  if (!compact) {
    gsap.set(masks, { clipPath: SERVICES_CLIP_HIDDEN });
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
      stagger: SERVICES_HEADER_STAGGER,
      y: 0,
    },
    0,
  );

  if (rule !== null) {
    timeline.to(rule, { duration: duration * 0.5, scaleX: 1 }, 0.12);
  }

  cards.forEach((card, index) => {
    const at = 0.28 + index * SERVICES_CARD_STAGGER;
    const mask = masks[index];
    const image = images[index];

    timeline.to(card, { opacity: 1, y: 0 }, at);

    if (!compact && mask !== undefined) {
      timeline.to(mask, { clipPath: SERVICES_CLIP_VISIBLE }, at);
    }

    if (image !== undefined) {
      timeline.to(image, { scale: 1 }, at);
    }
  });

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
      start: SERVICES_SCROLL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  if (enableParallax && enableScrollTrigger) {
    for (const layer of parallaxLayers) {
      gsap.fromTo(
        layer,
        { yPercent: -SERVICES_PARALLAX_Y_PERCENT },
        {
          ease: "none",
          scrollTrigger: {
            end: "bottom top",
            invalidateOnRefresh: true,
            scrub: SERVICES_PARALLAX_SCRUB,
            start: "top bottom",
            trigger: layer,
          },
          yPercent: SERVICES_PARALLAX_Y_PERCENT,
        },
      );
    }
  }

  return { timeline };
}
