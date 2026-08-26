import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easings } from "@/animations/config/easings";
import { registerGsapPlugins } from "@/animations/gsap/plugins";

export const SECTION_REVEAL_Y_PX = 24;
export const SECTION_REVEAL_DURATION = 0.7;
export const SECTION_REVEAL_STAGGER = 0.08;
export const SECTION_REVEAL_START = "top 78%";
export const SECTION_REVEAL_SELECTOR = "[data-reveal]";

export interface SectionRevealOptions {
  enableScrollTrigger?: boolean;
  selector?: string;
  y?: number;
}

export function createSectionReveal(
  root: HTMLElement,
  options: SectionRevealOptions = {},
): gsap.core.Timeline {
  const selector = options.selector ?? SECTION_REVEAL_SELECTOR;
  const y = options.y ?? SECTION_REVEAL_Y_PX;
  const enableScrollTrigger = options.enableScrollTrigger ?? true;
  const items = Array.from(root.querySelectorAll<HTMLElement>(selector));

  gsap.set(items, { opacity: 0, y });

  if (enableScrollTrigger) {
    registerGsapPlugins(ScrollTrigger);
  }

  const timeline = gsap.timeline({
    defaults: {
      duration: SECTION_REVEAL_DURATION,
      ease: easings.enter.gsap,
    },
    paused: true,
  });

  timeline.to(items, { opacity: 1, stagger: SECTION_REVEAL_STAGGER, y: 0 }, 0);

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
      start: SECTION_REVEAL_START,
      toggleActions: "play none none reverse",
      trigger: root,
    });
  }

  return timeline;
}
