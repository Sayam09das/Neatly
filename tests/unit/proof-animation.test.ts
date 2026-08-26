/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  createProofAnimation,
  PROOF_CLIP_HEADING_HIDDEN,
  PROOF_CLIP_IMAGE_HIDDEN,
  PROOF_IMAGE_SCALE_FROM_DESKTOP,
  PROOF_IMAGE_SCALE_FROM_MOBILE,
  PROOF_ITEM_COUNT,
  PROOF_NUMBER_SCALE_FROM,
} from "@/components/sections/proof/proof-animation";

function createProofMarkup(): HTMLElement {
  const root = document.createElement("div");

  const copy = document.createElement("div");
  copy.setAttribute("data-proof-copy", "");

  const eyebrow = document.createElement("p");
  eyebrow.setAttribute("data-proof-eyebrow", "");
  copy.append(eyebrow);

  const headingMask = document.createElement("div");
  headingMask.setAttribute("data-proof-heading-mask", "");
  const heading = document.createElement("h2");
  heading.setAttribute("data-proof-heading", "");
  headingMask.append(heading);
  copy.append(headingMask);

  const intro = document.createElement("p");
  intro.setAttribute("data-proof-intro", "");
  copy.append(intro);
  root.append(copy);

  const media = document.createElement("div");
  media.setAttribute("data-proof-media", "");
  const mask = document.createElement("div");
  mask.setAttribute("data-proof-image-mask", "");
  const image = document.createElement("div");
  image.setAttribute("data-proof-image-reveal", "");
  const parallax = document.createElement("div");
  parallax.setAttribute("data-proof-image-parallax", "");
  image.append(parallax);
  mask.append(image);
  media.append(mask);
  root.append(media);

  const list = document.createElement("ol");
  list.setAttribute("data-proof-list", "");

  for (let index = 0; index < PROOF_ITEM_COUNT; index += 1) {
    const item = document.createElement("li");
    item.setAttribute("data-proof-item", "");

    const body = document.createElement("article");
    body.setAttribute("data-proof-item-body", "");

    const number = document.createElement("p");
    number.setAttribute("data-proof-number", "");
    body.append(number);

    const rule = document.createElement("div");
    rule.setAttribute("data-proof-item-rule", "");
    body.append(rule);

    item.append(body);
    list.append(item);
  }

  root.append(list);
  document.body.append(root);

  return root;
}

describe("createProofAnimation", (): void => {
  it("sequences the desktop story and restores it when reversed", (): void => {
    const root = createProofMarkup();
    const eyebrow = root.querySelector<HTMLElement>("[data-proof-eyebrow]");
    const heading = root.querySelector<HTMLElement>("[data-proof-heading]");
    const headingMask = root.querySelector<HTMLElement>(
      "[data-proof-heading-mask]",
    );
    const intro = root.querySelector<HTMLElement>("[data-proof-intro]");
    const firstItem = root.querySelector<HTMLElement>("[data-proof-item]");
    const lastItem = root.querySelectorAll<HTMLElement>("[data-proof-item]")[3];
    const mask = root.querySelector<HTMLElement>("[data-proof-image-mask]");
    const image = root.querySelector<HTMLElement>("[data-proof-image-reveal]");
    const number = root.querySelector<HTMLElement>("[data-proof-number]");
    const rule = root.querySelector<HTMLElement>("[data-proof-item-rule]");

    if (
      eyebrow === null ||
      heading === null ||
      headingMask === null ||
      intro === null ||
      firstItem === null ||
      lastItem === undefined ||
      mask === null ||
      image === null ||
      number === null ||
      rule === null
    ) {
      throw new Error("Proof animation fixtures were not created.");
    }

    const { timeline } = createProofAnimation(root, {
      compact: false,
      enableActiveState: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(0);
    expect(gsap.getProperty(headingMask, "clipPath")).toBe(
      PROOF_CLIP_HEADING_HIDDEN,
    );
    expect(Number(gsap.getProperty(intro, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstItem, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(number, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(number, "scale"))).toBe(
      PROOF_NUMBER_SCALE_FROM,
    );
    expect(Number(gsap.getProperty(image, "scale"))).toBe(
      PROOF_IMAGE_SCALE_FROM_DESKTOP,
    );
    expect(gsap.getProperty(mask, "clipPath")).toBe(PROOF_CLIP_IMAGE_HIDDEN);
    expect(Number(gsap.getProperty(rule, "scaleX"))).toBe(0);

    timeline.progress(1);
    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(intro, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstItem, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(lastItem, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(number, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(1);
    expect(Number(gsap.getProperty(rule, "scaleX"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(lastItem, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(number, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });

  it("skips image clip-path and uses the mobile image scale in compact mode", (): void => {
    const root = createProofMarkup();
    const mask = root.querySelector<HTMLElement>("[data-proof-image-mask]");
    const image = root.querySelector<HTMLElement>("[data-proof-image-reveal]");

    if (mask === null || image === null) {
      throw new Error("Proof animation fixtures were not created.");
    }

    const { timeline } = createProofAnimation(root, {
      compact: true,
      enableActiveState: false,
      enableClipPath: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(image, "scale"))).toBe(
      PROOF_IMAGE_SCALE_FROM_MOBILE,
    );
    expect(Number(gsap.getProperty(image, "opacity"))).toBe(0);
    expect(gsap.getProperty(mask, "clipPath")).not.toBe(
      PROOF_CLIP_IMAGE_HIDDEN,
    );

    timeline.progress(1);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(1);
    expect(Number(gsap.getProperty(image, "opacity"))).toBe(1);

    timeline.kill();
    root.remove();
  });
});
