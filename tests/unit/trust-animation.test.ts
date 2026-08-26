/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  createTrustAnimation,
  TRUST_ITEM_COUNT,
} from "@/components/sections/trust/trust-animation";

function createTrustMarkup(): HTMLElement {
  const root = document.createElement("div");

  const eyebrow = document.createElement("p");
  eyebrow.setAttribute("data-trust-eyebrow", "");
  root.append(eyebrow);

  const heading = document.createElement("h2");
  heading.setAttribute("data-trust-heading", "");
  root.append(heading);

  const intro = document.createElement("p");
  intro.setAttribute("data-trust-intro", "");
  root.append(intro);

  for (let index = 0; index < TRUST_ITEM_COUNT; index += 1) {
    const item = document.createElement("li");
    item.setAttribute("data-trust-item", "");
    const accent = document.createElement("div");
    accent.setAttribute("data-trust-accent", "");
    item.append(accent);
    root.append(item);
  }

  document.body.append(root);

  return root;
}

describe("createTrustAnimation", (): void => {
  it("sequences the story and restores it when reversed", (): void => {
    const root = createTrustMarkup();
    const eyebrow = root.querySelector<HTMLElement>("[data-trust-eyebrow]");
    const heading = root.querySelector<HTMLElement>("[data-trust-heading]");
    const intro = root.querySelector<HTMLElement>("[data-trust-intro]");
    const firstItem = root.querySelector<HTMLElement>("[data-trust-item]");
    const lastItem = root.querySelectorAll<HTMLElement>("[data-trust-item]")[3];
    const accent = root.querySelector<HTMLElement>("[data-trust-accent]");

    if (
      eyebrow === null ||
      heading === null ||
      intro === null ||
      firstItem === null ||
      lastItem === undefined ||
      accent === null
    ) {
      throw new Error("Trust animation fixtures were not created.");
    }

    const { timeline } = createTrustAnimation(root, {
      compact: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstItem, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(accent, "scaleX"))).toBe(0);

    timeline.progress(1);
    expect(Number(gsap.getProperty(eyebrow, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(intro, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstItem, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(lastItem, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(accent, "scaleX"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(lastItem, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });
});
