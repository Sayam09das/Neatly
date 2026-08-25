# Anime.js Skill — Neatly

This skill provides guidelines for using **Anime.js** for lightweight SVG stroke morphing and standalone micro-animations in **Neatly**.

---

## 1. When to Use Anime.js

Anime.js is a lightweight, flexible JavaScript animation engine. In Neatly's animation stack hierarchy:

* **Primary Use Cases for Anime.js:**
  * Complex SVG path morphing (e.g., animating custom icon strokes, checkmarks, or organic badge paths).
  * Standalone canvas micro-interactions.
  * Lightweight numerical counter reveals (e.g., stats section counting up from 0 to 500+ homes cleaned).
* **When NOT to Use Anime.js:**
  * DO NOT use for page smooth scrolling (use Lenis).
  * DO NOT use for complex scroll-driven timeline reveals or pinned scenes (use GSAP + ScrollTrigger).
  * DO NOT use for component state transitions or modals (use Motion).

---

## 2. Coexistence Rules & Conflict Prevention

* **Single-Owner Property Rule:** NEVER allow Anime.js and GSAP or Motion to animate the same property of the same element simultaneously.
* **Scope Isolation:** Wrap Anime.js instances inside dedicated Client Components or specific DOM nodes (e.g., `<svg>` icon wrapper).

---

## 3. Implementation Pattern: SVG & Number Counter Reveals

### Example: Animated Counter Widget

```tsx
"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

interface StatCounterProps {
  targetValue: number;
  suffix?: string;
}

export function StatCounter({ targetValue, suffix = "" }: StatCounterProps) {
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obj = { count: 0 };

    const anim = anime({
      targets: obj,
      count: targetValue,
      easing: "easeOutExpo",
      duration: 2000,
      round: 1,
      update: () => {
        if (countRef.current) {
          countRef.current.textContent = `${obj.count}${suffix}`;
        }
      },
    });

    return () => anim.pause(); // Cleanup on unmount
  }, [targetValue, suffix]);

  return <span ref={countRef}>0{suffix}</span>;
}
```

---

## 4. Performance & Cleanup

* **Pause on Unmount:** Always store the Anime.js instance reference and call `.pause()` or `.remove()` in the `useEffect` cleanup return.
* **Transform Focus:** Animate `translateX`, `translateY`, `scale`, `rotate`, and SVG `strokeDashoffset`. Avoid layout-heavy property mutations.
