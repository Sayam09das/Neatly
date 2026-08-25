import { describe, expect, it } from "vitest";
import { durationMs } from "@/animations/config/durations";
import { createGsapContext, registerGsapPlugins } from "@/animations/gsap";
import { getPrefersReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { fade, fadeUp } from "@/animations/motion/variants";

describe("animation infrastructure imports", (): void => {
  it("exposes motion tokens and variants without running animations", (): void => {
    expect(durationMs.normal).toBe(200);
    expect(fade.hidden.opacity).toBe(0);
    expect(fadeUp.visible.y).toBe(0);
  });

  it("treats reduced motion as off when window is unavailable", (): void => {
    expect(getPrefersReducedMotion()).toBe(false);
  });

  it("does not register GSAP plugins on the server", (): void => {
    expect((): void => {
      registerGsapPlugins({});
    }).not.toThrow();
  });

  it("creates a scoped GSAP context that can be reverted", (): void => {
    const context = createGsapContext((): void => undefined);
    expect((): void => {
      context.revert();
    }).not.toThrow();
  });
});
