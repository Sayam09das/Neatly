/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  ABOUT_PROCESS_CLIP_HIDDEN,
  ABOUT_PROCESS_IMAGE_SCALE_FROM,
  ABOUT_PROCESS_STEP_COUNT,
  createAboutProcessAnimation,
} from "@/components/sections/about/about-process-animation";
import { createAboutStandardAnimation } from "@/components/sections/about/our-standard-animation";

function createStandardMarkup(): HTMLElement {
  const root = document.createElement("div");
  const header = document.createElement("div");
  header.setAttribute("data-about-standard-header-block", "");
  const eyebrow = document.createElement("p");
  eyebrow.setAttribute("data-about-standard-header", "");
  header.append(eyebrow);
  root.append(header);

  for (let index = 0; index < 4; index += 1) {
    const item = document.createElement("li");
    item.setAttribute("data-about-standard-item", "");
    const number = document.createElement("p");
    number.setAttribute("data-about-standard-number", "");
    const rule = document.createElement("div");
    rule.setAttribute("data-about-standard-rule", "");
    const title = document.createElement("h3");
    title.setAttribute("data-about-standard-title", "");
    const body = document.createElement("p");
    body.setAttribute("data-about-standard-body", "");
    item.append(number, rule, title, body);
    root.append(item);
  }

  document.body.append(root);

  return root;
}

function createProcessMarkup(): HTMLElement {
  const root = document.createElement("div");
  const header = document.createElement("div");
  header.setAttribute("data-about-process-header-block", "");
  const heading = document.createElement("h2");
  heading.setAttribute("data-about-process-header", "");
  header.append(heading);
  root.append(header);

  const progress = document.createElement("div");
  progress.setAttribute("data-about-process-progress", "");
  root.append(progress);

  for (let index = 0; index < ABOUT_PROCESS_STEP_COUNT; index += 1) {
    const step = document.createElement("li");
    step.setAttribute("data-about-process-step", "");
    const mask = document.createElement("div");
    mask.setAttribute("data-about-process-mask", "");
    const image = document.createElement("div");
    image.setAttribute("data-about-process-image", "");
    mask.append(image);
    step.append(mask);
    root.append(step);
  }

  document.body.append(root);

  return root;
}

describe("createAboutStandardAnimation", (): void => {
  it("reveals numbered principles and restores them when reversed", (): void => {
    const root = createStandardMarkup();
    const firstItem = root.querySelector<HTMLElement>(
      "[data-about-standard-item]",
    );
    const firstRule = root.querySelector<HTMLElement>(
      "[data-about-standard-rule]",
    );
    const firstTitle = root.querySelector<HTMLElement>(
      "[data-about-standard-title]",
    );

    if (firstItem === null || firstRule === null || firstTitle === null) {
      throw new Error("About standard fixtures were not created.");
    }

    const { timeline } = createAboutStandardAnimation(root, {
      compact: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(firstItem, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstRule, "scaleX"))).toBe(0);

    timeline.progress(1);
    expect(Number(gsap.getProperty(firstItem, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstRule, "scaleX"))).toBe(1);
    expect(Number(gsap.getProperty(firstTitle, "opacity"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(firstItem, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });
});

describe("createAboutProcessAnimation", (): void => {
  it("sequences all four stages on desktop", (): void => {
    const root = createProcessMarkup();
    const steps = root.querySelectorAll<HTMLElement>(
      "[data-about-process-step]",
    );
    const firstMask = root.querySelector<HTMLElement>(
      "[data-about-process-mask]",
    );
    const firstImage = root.querySelector<HTMLElement>(
      "[data-about-process-image]",
    );
    const progress = root.querySelector<HTMLElement>(
      "[data-about-process-progress]",
    );

    const firstStep = steps[0];
    const lastStep = steps[3];

    if (
      steps.length !== ABOUT_PROCESS_STEP_COUNT ||
      firstStep === undefined ||
      lastStep === undefined ||
      firstMask === null ||
      firstImage === null ||
      progress === null
    ) {
      throw new Error("About process fixtures were not created.");
    }

    const { timeline } = createAboutProcessAnimation(root, {
      compact: false,
      enableClipPath: true,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(firstStep, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstImage, "scale"))).toBe(
      ABOUT_PROCESS_IMAGE_SCALE_FROM,
    );
    expect(gsap.getProperty(firstMask, "clipPath")).toBe(
      ABOUT_PROCESS_CLIP_HIDDEN,
    );

    timeline.progress(1);
    expect(Number(gsap.getProperty(firstStep, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(lastStep, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstImage, "scale"))).toBe(1);
    expect(Number(gsap.getProperty(progress, "scaleX"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(firstStep, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });
});
