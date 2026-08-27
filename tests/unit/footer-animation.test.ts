/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import { createFooterAnimation } from "@/components/sections/footer-animation";

function createFooterMarkup(): HTMLElement {
  const root = document.createElement("div");

  const brand = document.createElement("div");
  brand.setAttribute("data-footer-brand", "");
  root.append(brand);

  const rule = document.createElement("div");
  rule.setAttribute("data-footer-rule", "");
  root.append(rule);

  for (let index = 0; index < 3; index += 1) {
    const column = document.createElement("nav");
    column.setAttribute("data-footer-column", "");
    root.append(column);
  }

  const bar = document.createElement("div");
  bar.setAttribute("data-footer-bar", "");
  root.append(bar);

  document.body.append(root);

  return root;
}

describe("createFooterAnimation", (): void => {
  it("hides footer columns at the start and restores them when reversed", (): void => {
    const root = createFooterMarkup();
    const brand = root.querySelector<HTMLElement>("[data-footer-brand]");
    const rule = root.querySelector<HTMLElement>("[data-footer-rule]");
    const firstColumn = root.querySelector<HTMLElement>("[data-footer-column]");
    const lastColumn = root.querySelectorAll<HTMLElement>(
      "[data-footer-column]",
    )[2];
    const bar = root.querySelector<HTMLElement>("[data-footer-bar]");

    if (
      brand === null ||
      rule === null ||
      firstColumn === null ||
      lastColumn === undefined ||
      bar === null
    ) {
      throw new Error("Footer animation fixtures were not created.");
    }

    const { timeline } = createFooterAnimation(root, {
      compact: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(brand, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstColumn, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(rule, "scaleX"))).toBe(0);
    expect(Number(gsap.getProperty(bar, "opacity"))).toBe(0);

    timeline.progress(1);
    expect(Number(gsap.getProperty(brand, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(lastColumn, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(rule, "scaleX"))).toBe(1);
    expect(Number(gsap.getProperty(bar, "opacity"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(brand, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(lastColumn, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });
});
