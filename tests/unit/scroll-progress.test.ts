import { describe, expect, it } from "vitest";
import {
  clampScrollProgress,
  SCROLL_PROGRESS_MAX,
  SCROLL_PROGRESS_MIN,
  shouldEnableScrollLinkedMotion,
} from "@/animations/scroll/progress";

describe("scroll progress helpers", (): void => {
  it("clamps progress to the 0–1 range", (): void => {
    expect(clampScrollProgress(-0.2)).toBe(SCROLL_PROGRESS_MIN);
    expect(clampScrollProgress(0.4)).toBe(0.4);
    expect(clampScrollProgress(1.8)).toBe(SCROLL_PROGRESS_MAX);
  });

  it("disables scroll-linked motion when reduced motion is preferred", (): void => {
    expect(shouldEnableScrollLinkedMotion(true)).toBe(false);
    expect(shouldEnableScrollLinkedMotion(false)).toBe(true);
  });
});
