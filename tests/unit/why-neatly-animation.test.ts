/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  createWhyMetricsAnimation,
  createWhyNeatlyAnimation,
  WHY_CARD_COUNT,
  WHY_CARD_SCALE_FROM,
  WHY_METRIC_COUNT,
} from "@/components/sections/why-neatly/why-neatly-animation";

function createWhyMarkup(): HTMLElement {
  const root = document.createElement("div");

  for (let index = 0; index < 3; index += 1) {
    const header = document.createElement("p");
    header.setAttribute("data-why-header-item", "");
    root.append(header);
  }

  for (let index = 0; index < WHY_CARD_COUNT; index += 1) {
    const card = document.createElement("article");
    card.setAttribute("data-why-card", "");

    const image = document.createElement("div");
    image.setAttribute("data-why-image-reveal", "");
    card.append(image);

    const content = document.createElement("div");
    content.setAttribute("data-why-card-content", "");
    card.append(content);

    root.append(card);
  }

  const band = document.createElement("div");
  band.setAttribute("data-why-metrics-band", "");

  const metrics = document.createElement("ul");
  metrics.setAttribute("data-why-metrics", "");

  for (let index = 0; index < WHY_METRIC_COUNT; index += 1) {
    const item = document.createElement("li");
    item.setAttribute("data-why-metric-item", "");
    const accent = document.createElement("div");
    accent.setAttribute("data-why-metric-accent", "");
    item.append(accent);
    metrics.append(item);
  }

  band.append(metrics);
  root.append(band);
  document.body.append(root);

  return root;
}

describe("createWhyNeatlyAnimation", (): void => {
  it("hides cards at the start and restores them when reversed", (): void => {
    const root = createWhyMarkup();
    const firstCard = root.querySelector<HTMLElement>("[data-why-card]");
    const lastCard = root.querySelectorAll<HTMLElement>("[data-why-card]")[2];
    const firstImage = root.querySelector<HTMLElement>(
      "[data-why-image-reveal]",
    );
    const firstMetric = root.querySelector<HTMLElement>(
      "[data-why-metric-item]",
    );
    const lastMetric = root.querySelectorAll<HTMLElement>(
      "[data-why-metric-item]",
    )[3];
    const accent = root.querySelector<HTMLElement>("[data-why-metric-accent]");

    if (
      firstCard === null ||
      lastCard === undefined ||
      firstImage === null ||
      firstMetric === null ||
      lastMetric === undefined ||
      accent === null
    ) {
      throw new Error("Why Neatly animation fixtures were not created.");
    }

    const { timeline } = createWhyNeatlyAnimation(root, {
      compact: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(firstCard, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstCard, "scale"))).toBe(
      WHY_CARD_SCALE_FROM,
    );
    expect(Number(gsap.getProperty(firstImage, "scale"))).toBeGreaterThan(1);
    expect(Number(gsap.getProperty(firstMetric, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(accent, "scaleX"))).toBe(0);

    timeline.progress(1);
    expect(Number(gsap.getProperty(firstCard, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(lastCard, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstImage, "scale"))).toBe(1);
    expect(Number(gsap.getProperty(firstMetric, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(lastMetric, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(accent, "scaleX"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(firstCard, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(lastCard, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(lastMetric, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });
});

describe("createWhyMetricsAnimation", (): void => {
  it("staggers metric items and draws accent bars", (): void => {
    const root = createWhyMarkup();
    const band = root.querySelector<HTMLElement>("[data-why-metrics-band]");
    const firstItem = root.querySelector<HTMLElement>("[data-why-metric-item]");
    const lastItem = root.querySelectorAll<HTMLElement>(
      "[data-why-metric-item]",
    )[3];
    const accent = root.querySelector<HTMLElement>("[data-why-metric-accent]");

    if (
      band === null ||
      firstItem === null ||
      lastItem === undefined ||
      accent === null
    ) {
      throw new Error("Why metrics animation fixtures were not created.");
    }

    const { timeline } = createWhyMetricsAnimation(band, {
      compact: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(firstItem, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(accent, "scaleX"))).toBe(0);

    timeline.progress(1);
    expect(Number(gsap.getProperty(firstItem, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(lastItem, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(accent, "scaleX"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(firstItem, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(accent, "scaleX"))).toBe(0);

    timeline.kill();
    root.remove();
  });
});
