/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import { createSectionReveal } from "@/animations/gsap/section-reveal";

describe("createSectionReveal", (): void => {
  it("hides reveal items at the start and restores them when reversed", (): void => {
    const root = document.createElement("div");
    const first = document.createElement("p");
    const second = document.createElement("p");
    first.setAttribute("data-reveal", "");
    second.setAttribute("data-reveal", "");
    root.append(first, second);
    document.body.append(root);

    const timeline = createSectionReveal(root, { enableScrollTrigger: false });

    expect(Number(gsap.getProperty(first, "opacity"))).toBe(0);
    timeline.progress(1);
    expect(Number(gsap.getProperty(first, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(second, "opacity"))).toBe(1);
    timeline.progress(0);
    expect(Number(gsap.getProperty(first, "opacity"))).toBe(0);

    timeline.kill();
    root.remove();
  });
});
