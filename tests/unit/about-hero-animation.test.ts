/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  ABOUT_HERO_CLIP_HIDDEN,
  ABOUT_HERO_CLIP_VISIBLE,
  ABOUT_HERO_IMAGE_SCALE_FROM,
  ABOUT_HERO_IMAGE_SCALE_MOBILE,
  ABOUT_HERO_LINE_Y_PERCENT,
  createAboutHeroAnimation,
} from "@/components/sections/about/about-hero-animation";
import { aboutHero } from "@/config/about";

function createHeroMarkup(): HTMLElement {
  const root = document.createElement("div");

  const eyebrow = document.createElement("p");
  eyebrow.setAttribute("data-about-hero-eyebrow", "");
  root.append(eyebrow);

  for (let index = 0; index < aboutHero.headingLines.length; index += 1) {
    const line = document.createElement("span");
    line.setAttribute("data-about-hero-line", "");
    root.append(line);
  }

  const copy = document.createElement("p");
  copy.setAttribute("data-about-hero-copy", "");
  root.append(copy);

  const cta = document.createElement("div");
  cta.setAttribute("data-about-hero-cta", "");
  root.append(cta);

  const mask = document.createElement("div");
  mask.setAttribute("data-about-hero-mask", "");
  const image = document.createElement("div");
  image.setAttribute("data-about-hero-image", "");
  const parallax = document.createElement("div");
  parallax.setAttribute("data-about-hero-parallax", "");
  image.append(parallax);
  mask.append(image);
  root.append(mask);

  document.body.append(root);

  return root;
}

describe("createAboutHeroAnimation", (): void => {
  it("reveals lines then the image and restores on reverse", (): void => {
    const root = createHeroMarkup();
    const eyebrow = root.querySelector<HTMLElement>(
      "[data-about-hero-eyebrow]",
    );
    const lines = Array.from(
      root.querySelectorAll<HTMLElement>("[data-about-hero-line]"),
    );
    const copy = root.querySelector<HTMLElement>("[data-about-hero-copy]");
    const cta = root.querySelector<HTMLElement>("[data-about-hero-cta]");
    const mask = root.querySelector<HTMLElement>("[data-about-hero-mask]");
    const image = root.querySelector<HTMLElement>("[data-about-hero-image]");

    const firstLine = lines[0];

    if (
      eyebrow === null ||
      firstLine === undefined ||
      copy === null ||
      cta === null ||
      mask === null ||
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
    expect(Number(gsap.getProperty(firstLine, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstLine, "yPercent"))).toBe(
      ABOUT_HERO_LINE_Y_PERCENT,
    );
    expect(gsap.getProperty(mask, "clipPath")).toBe(ABOUT_HERO_CLIP_HIDDEN);
    expect(Number(gsap.getProperty(copy, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(
      ABOUT_HERO_IMAGE_SCALE_FROM,
    );

    timeline.progress(1);
    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstLine, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstLine, "yPercent"))).toBe(0);
    expect(gsap.getProperty(mask, "clipPath")).toBe(ABOUT_HERO_CLIP_VISIBLE);
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

  it("keeps the image clip-path and uses the compact scale on mobile", (): void => {
    const root = createHeroMarkup();
    const mask = root.querySelector<HTMLElement>("[data-about-hero-mask]");
    const image = root.querySelector<HTMLElement>("[data-about-hero-image]");

    if (mask === null || image === null) {
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
    expect(gsap.getProperty(mask, "clipPath")).toBe(ABOUT_HERO_CLIP_HIDDEN);

    timeline.progress(1);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(1);
    expect(gsap.getProperty(mask, "clipPath")).toBe(ABOUT_HERO_CLIP_VISIBLE);

    timeline.kill();
    root.remove();
  });

  it("skips clip-path when it is disabled", (): void => {
    const root = createHeroMarkup();
    const mask = root.querySelector<HTMLElement>("[data-about-hero-mask]");

    if (mask === null) {
      throw new Error("About hero fixtures were not created.");
    }

    const { timeline } = createAboutHeroAnimation(root, {
      compact: false,
      enableClipPath: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(gsap.getProperty(mask, "clipPath")).not.toBe(ABOUT_HERO_CLIP_HIDDEN);

    timeline.kill();
    root.remove();
  });
});
