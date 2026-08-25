# Motion & Animation Quality Control Skill — Neatly

This skill provides quality control rules and execution boundaries for Neatly's multi-library animation stack.

---

## 1. Animation Stack Responsibility Hierarchy

```text
Lenis                  -> Global smooth scrolling momentum.
GSAP + ScrollTrigger   -> Complex scroll-driven reveals & hero timelines.
Motion (Framer)        -> UI state transitions (accordions, modal dialogs, drawers).
CSS Transitions        -> Simple hover states, color changes, focus rings.
Anime.js               -> Specialized SVG stroke morphing & isolated micro-animations.
```

---

## 2. Mandatory Motion Rules

1. **Tool Isolation:** NEVER let multiple animation libraries animate the same CSS property of the same element simultaneously.
2. **GPU Properties Only:** Animate CSS `transform` (`x`, `y`, `scale`, `rotation`), `opacity`, and `clip-path` exclusively. Avoid animating layout properties (`height`, `width`, `margin`).
3. **GSAP Context Cleanup:** Every GSAP timeline MUST be wrapped in `useGSAP()` or clean up context/triggers on unmount via `ctx.revert()`.
4. **Non-Blocking Rule:** Animations must NEVER block user click events, text readability, or form submission inputs.
5. **Reduced Motion:** All animation scripts MUST check for `prefers-reduced-motion: reduce` and yield gracefully to native non-animated states when active.
