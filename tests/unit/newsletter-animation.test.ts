/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  createNewsletterAnimation,
  NEWSLETTER_IMAGE_SCALE_FROM,
} from "@/components/sections/newsletter/newsletter-animation";

function createNewsletterMarkup(): HTMLElement {
  const root = document.createElement("div");

  const media = document.createElement("div");
  media.setAttribute("data-newsletter-media", "");
  const parallax = document.createElement("div");
  parallax.setAttribute("data-newsletter-parallax", "");
  media.append(parallax);
  root.append(media);

  const eyebrow = document.createElement("p");
  eyebrow.setAttribute("data-newsletter-eyebrow", "");
  root.append(eyebrow);

  const heading = document.createElement("h2");
  heading.setAttribute("data-newsletter-heading", "");
  root.append(heading);

  const intro = document.createElement("p");
  intro.setAttribute("data-newsletter-intro", "");
  root.append(intro);

  const form = document.createElement("form");
  form.setAttribute("data-newsletter-form", "");
  root.append(form);

  const consent = document.createElement("div");
  consent.setAttribute("data-newsletter-consent", "");
  root.append(consent);

  document.body.append(root);

  return root;
}

describe("createNewsletterAnimation", (): void => {
  it("sequences the story and restores it when reversed", (): void => {
    const root = createNewsletterMarkup();
    const eyebrow = root.querySelector<HTMLElement>(
      "[data-newsletter-eyebrow]",
    );
    const heading = root.querySelector<HTMLElement>(
      "[data-newsletter-heading]",
    );
    const intro = root.querySelector<HTMLElement>("[data-newsletter-intro]");
    const form = root.querySelector<HTMLElement>("[data-newsletter-form]");
    const consent = root.querySelector<HTMLElement>(
      "[data-newsletter-consent]",
    );
    const media = root.querySelector<HTMLElement>("[data-newsletter-media]");

    if (
      eyebrow === null ||
      heading === null ||
      intro === null ||
      form === null ||
      consent === null ||
      media === null
    ) {
      throw new Error("Newsletter animation fixtures were not created.");
    }

    const { timeline } = createNewsletterAnimation(root, {
      compact: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(intro, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(form, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(consent, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(media, "scale"))).toBe(
      NEWSLETTER_IMAGE_SCALE_FROM,
    );

    timeline.progress(1);
    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(intro, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(form, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(consent, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(media, "scale"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(form, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });
});
