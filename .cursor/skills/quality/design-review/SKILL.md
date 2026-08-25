# Pre-Completion Design Review Skill — Neatly

This skill provides a 13-point design review checklist that AI agents and developers MUST execute before declaring any page or component finished.

---

## 13-Point Pre-Completion Inspection Checklist

Before declaring any feature task finished in Neatly, answer these 13 inspection questions:

1. **Hierarchy:** Does the page visual hierarchy make sense at a glance? Is the primary heading clearly distinguished from body copy?
2. **Brand Alignment:** Does the page feel **Clean, Minimal, High-Trust, Premium, Modern, and Professional**? Is it free of cheap SaaS cliches?
3. **Whitespace:** Is spacing intentional, spacious, and consistent with vertical rhythm guidelines (`py-16` / `py-24`)?
4. **Typography:** Are font scales, line heights (`leading-relaxed`), and line lengths (`max-w-prose`) visually balanced?
5. **Animation Purpose:** Are animations meaningful, non-intrusive, and restrained? Do they enhance content understanding without causing distraction?
6. **Restraint:** Is anything visually excessive (e.g., unnecessary gradients, heavy glassmorphic blurs, floating cards)?
7. **Mobile Quality:** Does the mobile layout (`320px` to `430px`) feel intentionally designed rather than squished desktop code?
8. **Tablet Quality:** Does the tablet layout (`768px`) adapt grids cleanly without awkward multi-column wrapping?
9. **Clear Affordances:** Are interactive buttons, links, inputs, and tabs immediately recognizable as clickable?
10. **Conversion Focus:** Is the primary "Request a Free Quote" CTA clear, high-contrast, and un-obscured?
11. **State Handling:** Are `Loading`, `Success`, `Error`, and `Empty` visual states fully supported for dynamic data blocks?
12. **Accessibility:** Is keyboard navigation smooth with visible focus rings? Are form labels linked and reduced motion respected?
13. **Performance:** Does the page compile with zero TypeScript/lint errors, zero layout shifts (CLS), and optimized Next.js `<Image>` tags?
