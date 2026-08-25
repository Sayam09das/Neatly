# GSAP & ScrollTrigger Skill — Neatly

This skill provides technical and performance rules for implementing GSAP, ScrollTrigger, and scroll-driven timeline reveals in **Neatly**.

---

## 1. When to Use GSAP

* **Primary Use Cases:** Complex hero timelines, scroll-driven section reveals, pinned storytelling scenes, staggered element reveals, parallax image effects, and clip-path masking.
* **DO NOT Use GSAP For:** Simple component hover states (use CSS transitions), simple modal/drawer open-close states (use Motion/Framer Motion), or basic button presses.

---

## 2. React & Next.js Integration Rules (`useGSAP`)

Every GSAP animation inside a React Client Component MUST use `@gsap/react` (`useGSAP()`) or clean up contexts explicitly upon unmounting:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-title", { y: 40, opacity: 0, duration: 0.8 })
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3");
    },
    { scope: containerRef }
  );

  return <div ref={containerRef}>{/* Hero markup */}</div>;
}
```

### Context Cleanup Mandatory Rule
If writing raw `useEffect`, mandatory `ctx.revert()` cleanup MUST be executed:
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // GSAP animations
  }, containerRef);

  return () => ctx.revert(); // Reverts all ScrollTriggers & inline styles safely
}, []);
```

---

## 3. Performance & GPU Acceleration

* **Animate GPU Properties Only:** Animate `transform` (`x`, `y`, `scale`, `rotation`) and `opacity` exclusively.
* **Avoid Layout Thrashing:** Never animate layout-heavy properties like `width`, `height`, `margin`, `padding`, `top`, or `left`.
* **Will-Change Caching:** Apply `will-change: transform` only during active animation, or rely on GSAP's automatic transform caching.

---

## 4. ScrollTrigger Guidelines

* **Scrub vs. Trigger:**
  * Use `scrub: 1` or `scrub: true` for smooth scroll-tied progress (e.g., pinning a before/after slider or tracking process steps).
  * Use `start: "top 80%"` for one-shot section entrance reveals (`once: true`).
* **Pinning Rules:** Always reserve container space when using `pin: true` to prevent layout collapse.
* **Responsive Refresh:** Call `ScrollTrigger.refresh()` after dynamic content loading or layout shifts.

---

## 5. Accessibility & Reduced Motion Support

All GSAP timelines MUST respect the user's OS reduced-motion preferences:

```tsx
useGSAP(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  if (prefersReducedMotion) return; // Skip complex motion entirely

  // Proceed with GSAP animation
});
```
