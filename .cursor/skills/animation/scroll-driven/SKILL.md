# Scroll-Driven Storytelling Skill — Neatly

This skill provides creative and technical principles for designing scroll-driven reveals, pinned scenes, and interactive storytelling in **Neatly**.

---

## 1. Principles of Purposeful Scroll Storytelling

Scroll animation must **reinforce content, build trust, and clarify service value**—NEVER animate purely for superficial showmanship.

### Core Rules
* **Content First:** The user reads content to make a purchasing decision. Motion should draw attention to key visual evidence (before/after proof, satisfaction guarantees, service checklists).
* **Non-Blocking Control:** The user must maintain full control over scrolling velocity. Avoid locking the scroll position for long durations unless explaining a critical multi-step visual process (e.g., How Neatly Cleans in 3 Steps).
* **Responsive Adaptation:** Disable complex pinned scenes on mobile portrait viewports (`< 640px`), converting them into simple vertical stack reveals to preserve touch usability.

---

## 2. Key Scroll Patterns for Neatly

### Pattern A: Hero Entrance & Scroll Cue Fade
* **Choreography:** As the user scrolls down from the Hero section, the background image subtly zooms (`scale: 1.05`), while headline elements move upward (`y: -40`) and fade (`opacity: 0`), seamlessly introducing the Trust Indicators bar.

### Pattern B: Interactive Before/After Pinned Showcase
* **Choreography:** Pin the Before/After section on viewports `>= 1024px` for 100vh of scroll progress. As the user scrolls, a divider moves across the image automatically, revealing the pristine "After" cleaning state before unlocking vertical scroll.

### Pattern C: Step-by-Step Cleaning Process Reveal
* **Choreography:** Pinned 3-step vertical process timeline (1. Request Quote -> 2. Customized Plan -> 3. Pristine Space). As the user scrolls, step numbers light up sequentially with high-contrast active styling.

---

## 3. Technical Implementation Guidelines

* Use GSAP `ScrollTrigger` with `scrub: 0.5` or `scrub: 1` for fluid scroll-locked progress.
* Utilize `clip-path` masks for high-performance image reveals rather than layout property mutations.
* Always clean up triggers on unmount using `useGSAP()` or `ctx.revert()`.
* Automatically disable scroll triggers when `prefers-reduced-motion: reduce` is active.
