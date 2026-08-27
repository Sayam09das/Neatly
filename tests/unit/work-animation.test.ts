/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  createWorkAnimation,
  WORK_CLIP_HIDDEN,
  WORK_IMAGE_SCALE_FROM_DESKTOP,
  WORK_IMAGE_SCALE_FROM_MOBILE,
  WORK_TILE_COUNT,
} from "@/components/sections/work/work-animation";

function createWorkMarkup(): HTMLElement {
  const root = document.createElement("div");

  for (let index = 0; index < 3; index += 1) {
    const header = document.createElement("p");
    header.setAttribute("data-work-header-item", "");
    root.append(header);
  }

  const rule = document.createElement("div");
  rule.setAttribute("data-work-rule", "");
  root.append(rule);

  for (let index = 0; index < WORK_TILE_COUNT; index += 1) {
    const tile = document.createElement("div");
    tile.setAttribute("data-work-tile", "");

    const mask = document.createElement("div");
    mask.setAttribute("data-work-image-mask", "");
    tile.append(mask);

    const image = document.createElement("div");
    image.setAttribute("data-work-image-reveal", "");
    mask.append(image);

    root.append(tile);
  }

  const empty = document.createElement("p");
  empty.setAttribute("data-work-empty", "");
  root.append(empty);

  const cta = document.createElement("div");
  cta.setAttribute("data-work-cta", "");
  root.append(cta);

  document.body.append(root);

  return root;
}

describe("createWorkAnimation", (): void => {
  it("hides the gallery at the start and restores it when reversed", (): void => {
    const root = createWorkMarkup();
    const firstTile = root.querySelector<HTMLElement>("[data-work-tile]");
    const lastTile =
      root.querySelectorAll<HTMLElement>("[data-work-tile]")[
        WORK_TILE_COUNT - 1
      ];
    const firstMask = root.querySelector<HTMLElement>("[data-work-image-mask]");
    const firstImage = root.querySelector<HTMLElement>(
      "[data-work-image-reveal]",
    );
    const rule = root.querySelector<HTMLElement>("[data-work-rule]");
    const empty = root.querySelector<HTMLElement>("[data-work-empty]");
    const cta = root.querySelector<HTMLElement>("[data-work-cta]");

    if (
      firstTile === null ||
      lastTile === undefined ||
      firstMask === null ||
      firstImage === null ||
      rule === null ||
      empty === null ||
      cta === null
    ) {
      throw new Error("Work animation fixtures were not created.");
    }

    const { timeline } = createWorkAnimation(root, {
      compact: false,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(firstTile, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(firstImage, "scale"))).toBe(
      WORK_IMAGE_SCALE_FROM_DESKTOP,
    );
    expect(gsap.getProperty(firstMask, "clipPath")).toBe(WORK_CLIP_HIDDEN);
    expect(Number(gsap.getProperty(rule, "scaleX"))).toBe(0);
    expect(Number(gsap.getProperty(empty, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(0);

    timeline.progress(1);
    expect(Number(gsap.getProperty(firstTile, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(lastTile, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(firstImage, "scale"))).toBe(1);
    expect(Number(gsap.getProperty(rule, "scaleX"))).toBe(1);
    expect(Number(gsap.getProperty(empty, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(firstTile, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(lastTile, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });

  it("skips image clip-path and uses the mobile image scale in compact mode", (): void => {
    const root = createWorkMarkup();
    const mask = root.querySelector<HTMLElement>("[data-work-image-mask]");
    const image = root.querySelector<HTMLElement>("[data-work-image-reveal]");

    if (mask === null || image === null) {
      throw new Error("Work animation fixtures were not created.");
    }

    const { timeline } = createWorkAnimation(root, {
      compact: true,
      enableParallax: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(image, "scale"))).toBe(
      WORK_IMAGE_SCALE_FROM_MOBILE,
    );
    expect(gsap.getProperty(mask, "clipPath")).not.toBe(WORK_CLIP_HIDDEN);

    timeline.progress(1);
    expect(Number(gsap.getProperty(image, "scale"))).toBe(1);

    timeline.kill();
    root.remove();
  });
});
