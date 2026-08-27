/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  createWorkAnimation,
  WORK_SWIPER_AUTOPLAY_MS,
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

  const empty = document.createElement("p");
  empty.setAttribute("data-work-empty", "");
  root.append(empty);

  const cta = document.createElement("div");
  cta.setAttribute("data-work-cta", "");
  root.append(cta);

  document.body.append(root);

  return root;
}

describe("work swiper autoplay", (): void => {
  it("holds each photograph for the same interval as testimonials", (): void => {
    expect(WORK_SWIPER_AUTOPLAY_MS).toBe(3500);
  });
});

describe("createWorkAnimation", (): void => {
  it("hides the header at the start and restores it when reversed", (): void => {
    const root = createWorkMarkup();
    const firstHeader = root.querySelector<HTMLElement>(
      "[data-work-header-item]",
    );
    const rule = root.querySelector<HTMLElement>("[data-work-rule]");
    const empty = root.querySelector<HTMLElement>("[data-work-empty]");
    const cta = root.querySelector<HTMLElement>("[data-work-cta]");

    if (
      firstHeader === null ||
      rule === null ||
      empty === null ||
      cta === null
    ) {
      throw new Error("Work animation fixtures were not created.");
    }

    const { timeline } = createWorkAnimation(root, {
      compact: false,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(firstHeader, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(rule, "scaleX"))).toBe(0);
    expect(Number(gsap.getProperty(empty, "opacity"))).toBe(0);
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(0);

    timeline.progress(1);
    expect(Number(gsap.getProperty(firstHeader, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(rule, "scaleX"))).toBe(1);
    expect(Number(gsap.getProperty(empty, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(cta, "opacity"))).toBe(1);

    timeline.progress(0);
    expect(Number(gsap.getProperty(firstHeader, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });

  it("still restores the header in compact mode", (): void => {
    const root = createWorkMarkup();
    const header = root.querySelector<HTMLElement>("[data-work-header-item]");

    if (header === null) {
      throw new Error("Work animation fixtures were not created.");
    }

    const { timeline } = createWorkAnimation(root, {
      compact: true,
      enableScrollTrigger: false,
    });

    expect(Number(gsap.getProperty(header, "opacity"))).toBe(0);

    timeline.progress(1);
    expect(Number(gsap.getProperty(header, "opacity"))).toBe(1);

    timeline.kill();
    root.remove();
  });
});
