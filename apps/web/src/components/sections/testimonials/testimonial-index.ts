import type { LandingTestimonial } from "@/config/landing";

export function formatTestimonialIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function getTestimonialByIndex(
  items: ReadonlyArray<LandingTestimonial>,
  index: number,
): LandingTestimonial | undefined {
  if (items.length === 0) {
    return undefined;
  }

  const normalized = ((index % items.length) + items.length) % items.length;
  return items[normalized];
}
