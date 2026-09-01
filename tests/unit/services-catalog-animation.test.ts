/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  CATALOG_CARD_Y_PX,
  createCatalogAnimation,
} from "@/components/sections/catalog/services-catalog-animation";
import {
  createServicesHeroAnimation,
  SERVICES_HERO_IMAGE_SCALE_FROM,
} from "@/components/sections/catalog/services-hero-animation";

function createCatalogMarkup(): HTMLElement {
  const root = document.createElement("div");
  const header = document.createElement("p");
  header.setAttribute("data-catalog-header-item", "");
  root.append(header);

  for (let index = 0; index < 2; index += 1) {
    const card = document.createElement("article");
    card.setAttribute("data-catalog-card", "");
    root.append(card);
  }

  document.body.append(root);
  return root;
}

function createHeroMarkup(): HTMLElement {
  const root = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.setAttribute("data-services-hero-eyebrow", "");
  const line = document.createElement("span");
  line.setAttribute("data-services-hero-line", "");
  const copy = document.createElement("p");
  copy.setAttribute("data-services-hero-copy", "");
  const cta = document.createElement("div");
  cta.setAttribute("data-services-hero-cta", "");
  const mask = document.createElement("div");
  mask.setAttribute("data-services-hero-mask", "");
  const image = document.createElement("div");
  image.setAttribute("data-services-hero-image", "");
  mask.append(image);
  root.append(eyebrow, line, copy, cta, mask);
  document.body.append(root);
  return root;
}

describe("createCatalogAnimation", (): void => {
  it("reveals catalog cards from a short distance", (): void => {
    const root = createCatalogMarkup();
    const firstCard = root.querySelector<HTMLElement>("[data-catalog-card]");

    if (firstCard === null) {
      throw new Error("Catalog animation fixtures were not created.");
    }

    const { timeline } = createCatalogAnimation(root, {
      compact: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(firstCard, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstCard, "y"))).toBe(CATALOG_CARD_Y_PX);

    timeline.progress(1);
    expect(Number(gsap.getProperty(firstCard, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstCard, "y"))).toBe(0);

    timeline.progress(0);
    expect(Number(gsap.getProperty(firstCard, "opacity"))).toBe(0);
  });
});

describe("createServicesHeroAnimation", (): void => {
  it("hides the services hero until the entrance plays", (): void => {
    const root = createHeroMarkup();
    const image = root.querySelector<HTMLElement>("[data-services-hero-image]");
    const eyebrow = root.querySelector<HTMLElement>(
      "[data-services-hero-eyebrow]",
    );

    if (image === null || eyebrow === null) {
      throw new Error("Services hero animation fixtures were not created.");
    }

    const { timeline } = createServicesHeroAnimation(root, {
      compact: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(
      SERVICES_HERO_IMAGE_SCALE_FROM,
    );

    timeline.progress(1);
    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(1);
  });
});
