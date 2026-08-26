/** @vitest-environment jsdom */

import { describe, expect, it } from "vitest";
import {
  formatTestimonialIndex,
  getTestimonialByIndex,
} from "@/components/sections/testimonials/testimonial-index";
import type { LandingTestimonial } from "@/config/landing";

const items = [
  { id: "a", name: "A", quote: "One" },
  { id: "b", name: "B", quote: "Two" },
] as const satisfies ReadonlyArray<LandingTestimonial>;

describe("testimonial index helpers", (): void => {
  it("pads story numbers and wraps carousel indexes", (): void => {
    expect(formatTestimonialIndex(0)).toBe("01");
    expect(formatTestimonialIndex(2)).toBe("03");
    expect(getTestimonialByIndex(items, 0)?.id).toBe("a");
    expect(getTestimonialByIndex(items, 3)?.id).toBe("b");
    expect(getTestimonialByIndex(items, -1)?.id).toBe("b");
    expect(getTestimonialByIndex([], 0)).toBeUndefined();
  });
});
