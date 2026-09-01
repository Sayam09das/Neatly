/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  createWhyNeatlyAnimation,
  WHY_FEATURE_COUNT,
  WHY_ICON_SCALE_FROM,
} from "@/components/sections/why-neatly/why-neatly-animation";

function createWhyMarkup(): HTMLElement {
  const root = document.createElement("div");

  for (let index = 0; index < 3; index += 1) {
    const header = document.createElement("p");
    header.setAttribute("data-why-header-item", "");
    root.append(header);
  }

  for (let index = 0; index < WHY_FEATURE_COUNT; index += 1) {
    const feature = document.createElement("li");
    feature.setAttribute("data-why-feature", "");

    const icon = document.createElement("span");
    icon.setAttribute("data-why-feature-icon", "");
    feature.append(icon);

    root.append(feature);
  }

  const cta = document.createElement("div");
  cta.setAttribute("data-why-cta", "");
  root.append(cta);

  document.body.append(root);

  return root;
}

describe("createWhyNeatlyAnimation", (): void => {
  it("hides the heading, features, and icons at the start and restores them when reversed", (): void => {
    const root = createWhyMarkup();
    const firstHeader = root.querySelector<HTMLElement>(
      "[data-why-header-item]",
    );
    const firstFeature = root.querySelector<HTMLElement>("[data-why-feature]");
    const lastFeature =
      root.querySelectorAll<HTMLElement>("[data-why-feature]")[3];
    const firstIcon = root.querySelector<HTMLElement>(
      "[data-why-feature-icon]",
    );
    const cta = root.querySelector<HTMLElement>("[data-why-cta]");

    if (
      firstHeader === null ||
      firstFeature === null ||
      lastFeature === undefined ||
      firstIcon === null ||
      cta === null
    ) {
      throw new Error("Why Neatly animation fixtures were not created.");
    }

    const { timeline } = createWhyNeatlyAnimation(root, {
      compact: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(firstHeader, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstFeature, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(lastFeature, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstIcon, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstIcon, "scale"))).toBe(
      WHY_ICON_SCALE_FROM,
    );
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(0);

    timeline.progress(1);
    expect(Number(gsap.getProperty(firstHeader, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstFeature, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(lastFeature, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstIcon, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstIcon, "scale"))).toBe(1);
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(firstHeader, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(lastFeature, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstIcon, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });
});
