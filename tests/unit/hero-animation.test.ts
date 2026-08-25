/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import { gsap } from "@/animations";
import {
  createHeroFrameTimeline,
  HERO_FRAME_COUNT,
  HERO_SEGMENT_DURATION,
} from "@/components/sections/hero/hero-animation";

describe("createHeroFrameTimeline", (): void => {
  it("builds a reversible four-frame timeline without React state", (): void => {
    const frames = Array.from({ length: HERO_FRAME_COUNT }, (): HTMLElement => {
      const frame = document.createElement("div");
      document.body.append(frame);
      return frame;
    });
    const lastFrame = frames[HERO_FRAME_COUNT - 1];
    const firstFrame = frames[0];

    if (firstFrame === undefined || lastFrame === undefined) {
      throw new Error("Hero frames were not created.");
    }

    const timeline = createHeroFrameTimeline(frames);

    expect(timeline.duration()).toBe(HERO_SEGMENT_DURATION * HERO_FRAME_COUNT);

    timeline.progress(1);
    expect(Number(gsap.getProperty(lastFrame, "autoAlpha"))).toBeGreaterThan(
      0.9,
    );

    timeline.progress(0);
    expect(Number(gsap.getProperty(firstFrame, "autoAlpha"))).toBeGreaterThan(
      0.9,
    );
    expect(Number(gsap.getProperty(lastFrame, "autoAlpha"))).toBeLessThan(0.1);

    timeline.kill();
  });
});
