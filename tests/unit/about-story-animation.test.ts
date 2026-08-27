/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  ABOUT_STORY_CLIP_HIDDEN,
  ABOUT_STORY_CLIP_VISIBLE,
  ABOUT_STORY_DETAIL_Y_PX,
  ABOUT_STORY_IMAGE_SCALE_FROM,
  ABOUT_STORY_IMAGE_SCALE_MOBILE,
  ABOUT_STORY_LINE_Y_PERCENT,
  createAboutStoryAnimation,
} from "@/components/sections/about/our-story-animation";
import { aboutStory } from "@/config/about";

function createStoryMarkup(): HTMLElement {
  const root = document.createElement("div");

  const eyebrow = document.createElement("p");
  eyebrow.setAttribute("data-about-story-eyebrow", "");
  root.append(eyebrow);

  for (let index = 0; index < aboutStory.headingLines.length; index += 1) {
    const line = document.createElement("span");
    line.setAttribute("data-about-story-line", "");
    root.append(line);
  }

  const intro = document.createElement("p");
  intro.setAttribute("data-about-story-copy", "");
  root.append(intro);

  const narrative = document.createElement("p");
  narrative.setAttribute("data-about-story-copy", "");
  root.append(narrative);

  const mask = document.createElement("div");
  mask.setAttribute("data-about-story-mask", "");
  const image = document.createElement("div");
  image.setAttribute("data-about-story-image", "");
  const parallax = document.createElement("div");
  parallax.setAttribute("data-about-story-parallax", "");
  image.append(parallax);
  mask.append(image);
  root.append(mask);

  const detail = document.createElement("figure");
  detail.setAttribute("data-about-story-detail", "");
  root.append(detail);

  document.body.append(root);

  return root;
}

describe("createAboutStoryAnimation", (): void => {
  it("reveals lines then the image and restores on reverse", (): void => {
    const root = createStoryMarkup();
    const eyebrow = root.querySelector<HTMLElement>(
      "[data-about-story-eyebrow]",
    );
    const lines = Array.from(
      root.querySelectorAll<HTMLElement>("[data-about-story-line]"),
    );
    const copy = root.querySelector<HTMLElement>("[data-about-story-copy]");
    const mask = root.querySelector<HTMLElement>("[data-about-story-mask]");
    const image = root.querySelector<HTMLElement>("[data-about-story-image]");
    const detail = root.querySelector<HTMLElement>("[data-about-story-detail]");
    const firstLine = lines[0];

    if (
      eyebrow === null ||
      firstLine === undefined ||
      copy === null ||
      mask === null ||
      image === null ||
      detail === null
    ) {
      throw new Error("About story fixtures were not created.");
    }

    const { timeline } = createAboutStoryAnimation(root, {
      compact: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstLine, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstLine, "yPercent"))).toBe(
      ABOUT_STORY_LINE_Y_PERCENT,
    );
    expect(Number(gsap.getProperty(copy, "opacity"))).toBe(0);
    expect(gsap.getProperty(mask, "clipPath")).toBe(ABOUT_STORY_CLIP_HIDDEN);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(
      ABOUT_STORY_IMAGE_SCALE_FROM,
    );
    expect(Number(gsap.getProperty(detail, "y"))).toBe(ABOUT_STORY_DETAIL_Y_PX);

    timeline.progress(1);
    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstLine, "yPercent"))).toBe(0);
    expect(gsap.getProperty(mask, "clipPath")).toBe(ABOUT_STORY_CLIP_VISIBLE);
    expect(Number(gsap.getProperty(image, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(1);
    expect(Number(gsap.getProperty(detail, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(detail, "y"))).toBe(0);

    timeline.progress(0);
    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(image, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });

  it("keeps the image clip-path and uses the compact scale on mobile", (): void => {
    const root = createStoryMarkup();
    const mask = root.querySelector<HTMLElement>("[data-about-story-mask]");
    const image = root.querySelector<HTMLElement>("[data-about-story-image]");

    if (mask === null || image === null) {
      throw new Error("About story fixtures were not created.");
    }

    const { timeline } = createAboutStoryAnimation(root, {
      compact: true,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(image, "scale"))).toBe(
      ABOUT_STORY_IMAGE_SCALE_MOBILE,
    );
    expect(gsap.getProperty(mask, "clipPath")).toBe(ABOUT_STORY_CLIP_HIDDEN);

    timeline.progress(1);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(1);
    expect(gsap.getProperty(mask, "clipPath")).toBe(ABOUT_STORY_CLIP_VISIBLE);

    timeline.kill();
    root.remove();
  });

  it("skips clip-path when it is disabled", (): void => {
    const root = createStoryMarkup();
    const mask = root.querySelector<HTMLElement>("[data-about-story-mask]");

    if (mask === null) {
      throw new Error("About story fixtures were not created.");
    }

    const { timeline } = createAboutStoryAnimation(root, {
      compact: false,
      enableClipPath: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(gsap.getProperty(mask, "clipPath")).not.toBe(
      ABOUT_STORY_CLIP_HIDDEN,
    );

    timeline.kill();
    root.remove();
  });
});
