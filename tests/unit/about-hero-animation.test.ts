/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  ABOUT_HERO_CLIP_HIDDEN,
  ABOUT_HERO_IMAGE_SCALE_FROM,
  ABOUT_HERO_IMAGE_SCALE_MOBILE,
  createAboutHeroAnimation,
} from "@/components/sections/about/about-hero-animation";

function createHeroMarkup(): HTMLElement {
  const root = document.createElement("div");

  const eyebrow = document.createElement("p");
  eyebrow.setAttribute("data-about-hero-eyebrow", "");
  root.append(eyebrow);

  const headingMask = document.createElement("div");
  headingMask.setAttribute("data-about-hero-heading-mask", "");
  const heading = document.createElement("h1");
  heading.setAttribute("data-about-hero-heading", "");
  headingMask.append(heading);
  root.append(headingMask);

  const copy = document.createElement("p");
  copy.setAttribute("data-about-hero-copy", "");
  root.append(copy);

  const cta = document.createElement("div");
  cta.setAttribute("data-about-hero-cta", "");
  root.append(cta);

  const image = document.createElement("div");
  image.setAttribute("data-about-hero-image", "");
  root.append(image);

  document.body.append(root);

  return root;
}

describe("createAboutHeroAnimation", (): void => {
  it("reveals copy then the image and restores on reverse", (): void => {
    const root = createHeroMarkup();
    const eyebrow = root.querySelector<HTMLElement>(
      "[data-about-hero-eyebrow]",
    );
    const heading = root.querySelector<HTMLElement>(
      "[data-about-hero-heading]",
    );
    const headingMask = root.querySelector<HTMLElement>(
      "[data-about-hero-heading-mask]",
    );
    const copy = root.querySelector<HTMLElement>("[data-about-hero-copy]");
    const cta = root.querySelector<HTMLElement>("[data-about-hero-cta]");
    const image = root.querySelector<HTMLElement>("[data-about-hero-image]");

    if (
      eyebrow === null ||
      heading === null ||
      headingMask === null ||
      copy === null ||
      cta === null ||
      image === null
    ) {
      throw new Error("About hero fixtures were not created.");
    }

    const { timeline } = createAboutHeroAnimation(root, {
      compact: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(0);
    expect(gsap.getProperty(headingMask, "clipPath")).toBe(
      ABOUT_HERO_CLIP_HIDDEN,
    );
    expect(Number(gsap.getProperty(copy, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(
      ABOUT_HERO_IMAGE_SCALE_FROM,
    );

    timeline.progress(1);
    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(copy, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(image, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(image, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });

  it("skips clip-path and uses the compact image scale on mobile", (): void => {
    const root = createHeroMarkup();
    const headingMask = root.querySelector<HTMLElement>(
      "[data-about-hero-heading-mask]",
    );
    const image = root.querySelector<HTMLElement>("[data-about-hero-image]");

    if (headingMask === null || image === null) {
      throw new Error("About hero fixtures were not created.");
    }

    const { timeline } = createAboutHeroAnimation(root, {
      compact: true,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(image, "scale"))).toBe(
      ABOUT_HERO_IMAGE_SCALE_MOBILE,
    );
    expect(gsap.getProperty(headingMask, "clipPath")).not.toBe(
      ABOUT_HERO_CLIP_HIDDEN,
    );

    timeline.progress(1);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(1);

    timeline.kill();
    root.remove();
  });
});
