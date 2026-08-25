import { describe, expect, it } from "vitest";
import {
  durationMs,
  durationSeconds,
  motionDuration,
} from "@/animations/config/durations";

describe("animation duration tokens", (): void => {
  it("matches the design-system motion scale", (): void => {
    expect(durationMs).toEqual({
      fast: 150,
      normal: 200,
      slow: 300,
    });
    expect(durationSeconds.fast).toBe(0.15);
    expect(motionDuration.micro).toBe(durationSeconds.fast);
    expect(motionDuration.short).toBe(durationSeconds.normal);
    expect(motionDuration.medium).toBe(durationSeconds.slow);
  });
});
