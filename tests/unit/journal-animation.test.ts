/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  createJournalAnimation,
  JOURNAL_CLIP_HIDDEN,
  JOURNAL_IMAGE_SCALE_FROM_DESKTOP,
  JOURNAL_IMAGE_SCALE_FROM_MOBILE,
  JOURNAL_SLOT_COUNT,
} from "@/components/sections/journal/journal-animation";

function createJournalMarkup(): HTMLElement {
  const root = document.createElement("div");

  const eyebrow = document.createElement("p");
  eyebrow.setAttribute("data-journal-eyebrow", "");
  root.append(eyebrow);

  const heading = document.createElement("h2");
  heading.setAttribute("data-journal-heading", "");
  root.append(heading);

  const intro = document.createElement("p");
  intro.setAttribute("data-journal-intro", "");
  root.append(intro);

  const featured = document.createElement("article");
  featured.setAttribute("data-journal-featured", "");
  const featuredMask = document.createElement("div");
  featuredMask.setAttribute("data-journal-featured-mask", "");
  const featuredReveal = document.createElement("div");
  featuredReveal.setAttribute("data-journal-featured-reveal", "");
  const featuredParallax = document.createElement("div");
  featuredParallax.setAttribute("data-journal-featured-parallax", "");
  featuredReveal.append(featuredParallax);
  featuredMask.append(featuredReveal);
  featured.append(featuredMask);
  root.append(featured);

  for (let index = 0; index < JOURNAL_SLOT_COUNT; index += 1) {
    const slot = document.createElement("li");
    slot.setAttribute("data-journal-slot", "");
    const mask = document.createElement("div");
    mask.setAttribute("data-journal-slot-mask", "");
    const reveal = document.createElement("div");
    reveal.setAttribute("data-journal-slot-reveal", "");
    mask.append(reveal);
    slot.append(mask);
    root.append(slot);
  }

  const cta = document.createElement("div");
  cta.setAttribute("data-journal-cta", "");
  root.append(cta);

  document.body.append(root);

  return root;
}

describe("createJournalAnimation", (): void => {
  it("sequences the desktop story and restores it when reversed", (): void => {
    const root = createJournalMarkup();
    const eyebrow = root.querySelector<HTMLElement>("[data-journal-eyebrow]");
    const heading = root.querySelector<HTMLElement>("[data-journal-heading]");
    const intro = root.querySelector<HTMLElement>("[data-journal-intro]");
    const featured = root.querySelector<HTMLElement>("[data-journal-featured]");
    const mask = root.querySelector<HTMLElement>(
      "[data-journal-featured-mask]",
    );
    const image = root.querySelector<HTMLElement>(
      "[data-journal-featured-reveal]",
    );
    const firstSlot = root.querySelector<HTMLElement>("[data-journal-slot]");
    const lastSlot = root.querySelectorAll<HTMLElement>(
      "[data-journal-slot]",
    )[2];
    const cta = root.querySelector<HTMLElement>("[data-journal-cta]");

    if (
      eyebrow === null ||
      heading === null ||
      intro === null ||
      featured === null ||
      mask === null ||
      image === null ||
      firstSlot === null ||
      lastSlot === undefined ||
      cta === null
    ) {
      throw new Error("Journal animation fixtures were not created.");
    }

    const { timeline } = createJournalAnimation(root, {
      compact: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(intro, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(featured, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstSlot, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(
      JOURNAL_IMAGE_SCALE_FROM_DESKTOP,
    );
    expect(gsap.getProperty(mask, "clipPath")).toBe(JOURNAL_CLIP_HIDDEN);

    timeline.progress(1);
    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(intro, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(featured, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstSlot, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(lastSlot, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(lastSlot, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });

  it("skips image clip-path and uses the mobile image scale in compact mode", (): void => {
    const root = createJournalMarkup();
    const mask = root.querySelector<HTMLElement>(
      "[data-journal-featured-mask]",
    );
    const image = root.querySelector<HTMLElement>(
      "[data-journal-featured-reveal]",
    );

    if (mask === null || image === null) {
      throw new Error("Journal animation fixtures were not created.");
    }

    const { timeline } = createJournalAnimation(root, {
      compact: true,
      enableClipPath: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(image, "scale"))).toBe(
      JOURNAL_IMAGE_SCALE_FROM_MOBILE,
    );
    expect(gsap.getProperty(mask, "clipPath")).not.toBe(JOURNAL_CLIP_HIDDEN);

    timeline.progress(1);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(1);

    timeline.kill();
    root.remove();
  });
});
