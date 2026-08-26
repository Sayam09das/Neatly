/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  createProcessAnimation,
  PROCESS_CLIP_HIDDEN,
  PROCESS_DOT_ACTIVE_SCALE,
  PROCESS_DOT_INACTIVE_OPACITY,
  PROCESS_IMAGE_SCALE_FROM_DESKTOP,
  PROCESS_IMAGE_SCALE_FROM_MOBILE,
  PROCESS_STEP_COUNT,
} from "@/components/sections/process/process-animation";

function createProcessMarkup(): HTMLElement {
  const root = document.createElement("div");
  const header = document.createElement("div");
  header.setAttribute("data-process-header", "");
  root.append(header);

  const eyebrow = document.createElement("p");
  eyebrow.setAttribute("data-process-eyebrow", "");
  header.append(eyebrow);

  const heading = document.createElement("h2");
  heading.setAttribute("data-process-heading", "");
  header.append(heading);

  const intro = document.createElement("p");
  intro.setAttribute("data-process-intro", "");
  header.append(intro);

  const rule = document.createElement("div");
  rule.setAttribute("data-process-rule", "");
  header.append(rule);

  const progressLine = document.createElement("div");
  progressLine.setAttribute("data-process-progress-line", "");
  root.append(progressLine);

  for (let index = 0; index < PROCESS_STEP_COUNT; index += 1) {
    const dot = document.createElement("span");
    dot.setAttribute("data-process-dot", "");
    root.append(dot);

    const step = document.createElement("li");
    step.setAttribute("data-process-step", "");

    const mask = document.createElement("div");
    mask.setAttribute("data-process-image-mask", "");
    step.append(mask);

    const image = document.createElement("div");
    image.setAttribute("data-process-image-reveal", "");
    mask.append(image);

    const number = document.createElement("p");
    number.setAttribute("data-process-number", "");
    step.append(number);

    root.append(step);
  }

  document.body.append(root);

  return root;
}

describe("createProcessAnimation", (): void => {
  it("sequences the desktop story and restores it when reversed", (): void => {
    const root = createProcessMarkup();
    const heading = root.querySelector<HTMLElement>("[data-process-heading]");
    const firstStep = root.querySelector<HTMLElement>("[data-process-step]");
    const lastStep = root.querySelectorAll<HTMLElement>(
      "[data-process-step]",
    )[2];
    const firstMask = root.querySelector<HTMLElement>(
      "[data-process-image-mask]",
    );
    const firstImage = root.querySelector<HTMLElement>(
      "[data-process-image-reveal]",
    );
    const firstNumber = root.querySelector<HTMLElement>(
      "[data-process-number]",
    );
    const firstDot = root.querySelector<HTMLElement>("[data-process-dot]");
    const lastDot = root.querySelectorAll<HTMLElement>("[data-process-dot]")[2];
    const rule = root.querySelector<HTMLElement>("[data-process-rule]");
    const progressLine = root.querySelector<HTMLElement>(
      "[data-process-progress-line]",
    );

    if (
      heading === null ||
      firstStep === null ||
      lastStep === undefined ||
      firstMask === null ||
      firstImage === null ||
      firstNumber === null ||
      firstDot === null ||
      lastDot === undefined ||
      rule === null ||
      progressLine === null
    ) {
      throw new Error("Process animation fixtures were not created.");
    }

    const { timeline } = createProcessAnimation(root, {
      compact: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstStep, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstImage, "scale"))).toBe(
      PROCESS_IMAGE_SCALE_FROM_DESKTOP,
    );
    expect(gsap.getProperty(firstMask, "clipPath")).toBe(PROCESS_CLIP_HIDDEN);
    expect(Number(gsap.getProperty(rule, "scaleX"))).toBe(0);
    expect(Number(gsap.getProperty(progressLine, "scaleX"))).toBe(0);
    expect(Number(gsap.getProperty(firstDot, "opacity"))).toBe(
      PROCESS_DOT_INACTIVE_OPACITY,
    );

    timeline.progress(1);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstStep, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(lastStep, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstImage, "scale"))).toBe(1);
    expect(Number(gsap.getProperty(firstNumber, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(rule, "scaleX"))).toBe(1);
    expect(Number(gsap.getProperty(progressLine, "scaleX"))).toBe(1);
    expect(Number(gsap.getProperty(lastDot, "scale"))).toBe(
      PROCESS_DOT_ACTIVE_SCALE,
    );

    timeline.progress(0);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstStep, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(lastStep, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(progressLine, "scaleX"))).toBe(0);

    timeline.kill();
    root.remove();
  });

  it("skips clip-path and uses the mobile image scale in compact mode", (): void => {
    const root = createProcessMarkup();
    const firstMask = root.querySelector<HTMLElement>(
      "[data-process-image-mask]",
    );
    const firstImage = root.querySelector<HTMLElement>(
      "[data-process-image-reveal]",
    );

    if (firstMask === null || firstImage === null) {
      throw new Error("Process animation fixtures were not created.");
    }

    const { timeline } = createProcessAnimation(root, {
      compact: true,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(firstImage, "scale"))).toBe(
      PROCESS_IMAGE_SCALE_FROM_MOBILE,
    );
    expect(gsap.getProperty(firstMask, "clipPath")).not.toBe(
      PROCESS_CLIP_HIDDEN,
    );

    timeline.progress(1);
    expect(Number(gsap.getProperty(firstImage, "scale"))).toBe(1);

    timeline.kill();
    root.remove();
  });
});
