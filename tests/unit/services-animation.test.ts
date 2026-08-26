/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  createServicesAnimation,
  SERVICES_CARD_COUNT,
  SERVICES_CLIP_HIDDEN,
  SERVICES_IMAGE_SCALE_FROM_DESKTOP,
} from "@/components/sections/services/services-animation";

function createServicesMarkup(): HTMLElement {
  const root = document.createElement("div");

  for (let index = 0; index < 3; index += 1) {
    const header = document.createElement("p");
    header.setAttribute("data-services-header-item", "");
    root.append(header);
  }

  const rule = document.createElement("div");
  rule.setAttribute("data-services-rule", "");
  root.append(rule);

  for (let index = 0; index < SERVICES_CARD_COUNT; index += 1) {
    const card = document.createElement("article");
    card.setAttribute("data-service-card", "");

    const mask = document.createElement("div");
    mask.setAttribute("data-service-image-mask", "");
    card.append(mask);

    const image = document.createElement("div");
    image.setAttribute("data-service-image-reveal", "");
    mask.append(image);

    root.append(card);
  }

  document.body.append(root);

  return root;
}

describe("createServicesAnimation", (): void => {
  it("hides services at the start and restores them when reversed", (): void => {
    const root = createServicesMarkup();
    const firstCard = root.querySelector<HTMLElement>("[data-service-card]");
    const lastCard = root.querySelectorAll<HTMLElement>(
      "[data-service-card]",
    )[2];
    const firstMask = root.querySelector<HTMLElement>(
      "[data-service-image-mask]",
    );
    const firstImage = root.querySelector<HTMLElement>(
      "[data-service-image-reveal]",
    );
    const rule = root.querySelector<HTMLElement>("[data-services-rule]");

    if (
      firstCard === null ||
      lastCard === undefined ||
      firstMask === null ||
      firstImage === null ||
      rule === null
    ) {
      throw new Error("Services animation fixtures were not created.");
    }

    const { timeline } = createServicesAnimation(root, {
      compact: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(firstCard, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstImage, "scale"))).toBe(
      SERVICES_IMAGE_SCALE_FROM_DESKTOP,
    );
    expect(gsap.getProperty(firstMask, "clipPath")).toBe(SERVICES_CLIP_HIDDEN);
    expect(Number(gsap.getProperty(rule, "scaleX"))).toBe(0);

    timeline.progress(1);
    expect(Number(gsap.getProperty(firstCard, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(lastCard, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstImage, "scale"))).toBe(1);
    expect(Number(gsap.getProperty(rule, "scaleX"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(firstCard, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(lastCard, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });
});
