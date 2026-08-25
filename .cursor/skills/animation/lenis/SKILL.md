# Lenis Smooth Scroll Skill — Neatly

This skill provides setup, synchronization, and performance rules for **Lenis** smooth scrolling integration in **Neatly**.

---

## 1. Role of Lenis in Neatly

Lenis normalizes scroll momentum across platforms, providing a fluid, soft, and luxurious feel that reinforces Neatly's calm and premium brand position.

---

## 2. Global Provider Setup & GSAP Integration

Lenis MUST synchronize seamlessly with GSAP ScrollTrigger via the requestAnimationFrame (RAF) loop:

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Respect OS reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Clean easeOutExpo
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // Synchronize Lenis scroll events with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Synchronize RAF loop
    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

---

## 3. Strict Safety & Accessibility Safeguards

Lenis MUST NEVER compromise standard browser navigation or accessibility:
1. **Touch Scrolling:** Touch multiplier must feel natural on mobile devices (`touchMultiplier: 1.5` - 2.0). Never hijack touch scrolling completely.
2. **Keyboard Navigation:** Native `Tab` key navigation and `Space` / `Arrow` keys must continue scrolling focusable elements into view automatically.
3. **Anchor Navigation:** Clicking anchor links (`#services`, `#pricing`) must smoothly scroll to target sections via `lenis.scrollTo(target)`.
4. **Modal Dialog Lock:** When an administrative modal or mobile menu drawer is open, scroll locking MUST pause Lenis (`lenis.stop()`) and resume on close (`lenis.start()`).
5. **Reduced Motion:** If `prefers-reduced-motion` is active, Lenis setup MUST be bypassed completely to rely on native browser scrolling.
