# 21st.dev Component Adaptation Skill — Neatly

This skill provides rules for inspecting, adapting, and integrating high-quality modern component inspirations from **21st.dev** into Neatly without introducing dependency bloat or visual inconsistency.

---

## 1. Role of 21st.dev Component Inspirations

21st.dev serves as a design inspiration catalog for modern UI patterns (e.g., interactive before/after sliders, hero showcases, pricing tables, process cards).

---

## 2. Adaptation Rules: Never Copy Blindly

When adapting a component concept from 21st.dev:

1. **Brand Alignment:** Strip away heavy dark-mode gradients, neon borders, or floating 3D fluff. Refactor styling to use Neatly's clean color tokens (`bg-background`, `text-foreground`, `border-border`).
2. **Typography Alignment:** Replace generic font declarations with Neatly's font scale and line-height tokens (`tracking-tight`, `leading-relaxed`).
3. **Spacing Alignment:** Adjust margins and padding to match Neatly's spacious vertical rhythm (`py-16 md:py-24`, `gap-6` or `gap-8`).
4. **Dependency Audit:** DO NOT install heavy third-party packages required by a 21st.dev component snippet if a simple Tailwind class, Motion transition, or small TypeScript utility function satisfies the component behavior natively.
5. **Accessibility Check:** Verify that adapted components carry semantic HTML markup, proper keyboard focus states, and screen reader labels.

---

## 3. Adaptation Checklist Before Adding to Repository

- [ ] Does the adapted component match Neatly's **Clean, Minimal, High-Trust** aesthetic?
- [ ] Have all arbitrary inline colors or non-standard Tailwind values been replaced with Neatly design tokens?
- [ ] Is the component fully responsive across all 5 breakpoints (`sm` to `2xl`)?
- [ ] Does it compile cleanly under strict TypeScript without using `any`?
- [ ] Has unnecessary third-party package dependency bloat been eliminated?
