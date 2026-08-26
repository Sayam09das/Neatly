/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  createStatisticsAnimation,
  STATISTICS_ITEM_COUNT,
} from "@/components/sections/statistics/statistics-animation";

function createStatisticsMarkup(): HTMLElement {
  const root = document.createElement("div");

  const heading = document.createElement("h2");
  heading.setAttribute("data-statistics-heading", "");
  root.append(heading);

  const intro = document.createElement("p");
  intro.setAttribute("data-statistics-intro", "");
  root.append(intro);

  for (let index = 0; index < STATISTICS_ITEM_COUNT; index += 1) {
    const item = document.createElement("li");
    item.setAttribute("data-statistics-item", "");
    const accent = document.createElement("div");
    accent.setAttribute("data-statistics-accent", "");
    item.append(accent);
    root.append(item);
  }

  document.body.append(root);

  return root;
}

describe("createStatisticsAnimation", (): void => {
  it("sequences the story and restores it when reversed", (): void => {
    const root = createStatisticsMarkup();
    const heading = root.querySelector<HTMLElement>(
      "[data-statistics-heading]",
    );
    const intro = root.querySelector<HTMLElement>("[data-statistics-intro]");
    const firstItem = root.querySelector<HTMLElement>("[data-statistics-item]");
    const lastItem = root.querySelectorAll<HTMLElement>(
      "[data-statistics-item]",
    )[2];
    const accent = root.querySelector<HTMLElement>("[data-statistics-accent]");

    if (
      heading === null ||
      intro === null ||
      firstItem === null ||
      lastItem === undefined ||
      accent === null
    ) {
      throw new Error("Statistics animation fixtures were not created.");
    }

    const { timeline } = createStatisticsAnimation(root, {
      compact: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(heading, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(intro, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstItem, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(accent, "scaleX"))).toBe(0);

    timeline.progress(1);
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
