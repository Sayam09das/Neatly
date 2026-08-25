# UI Quality Control & Self-Inspection Skill — Neatly

This skill provides a self-inspection protocol for AI agents and developers to audit UI implementations before declaring a task complete.

---

## UI Quality Audit Checklist

Every implemented UI component or page MUST pass the following 12 quality checks:

- [ ] **1. Visual Finish:** Does the UI convey Neatly's **Clean, Minimal, High-Trust** aesthetic?
- [ ] **2. Information Hierarchy:** Is the heading-to-body contrast clear? Does the eye naturally find the primary focal point?
- [ ] **3. Whitespace:** Is there generous padding (`py-16` / `py-24`) preventing visual crowding?
- [ ] **4. Typography:** Are semantic heading tags (`<h1>`-`<h3>`) and line heights (`leading-relaxed`) applied correctly?
- [ ] **5. Design Tokens:** Are standard color tokens (`text-foreground`, `bg-card`, `border-border`) used without hardcoded hex values?
- [ ] **6. Component States:** Are `Idle`, `Hover`, `Focus`, `Active`, `Disabled`, and `Loading` states implemented?
- [ ] **7. Responsiveness:** Rendered cleanly across 320px, 390px, 768px, 1024px, 1280px, and 1440px without overflow?
- [ ] **8. Touch Targets:** Minimum 44x44px touch targets enforced on mobile viewports?
- [ ] **9. Accessibility:** Semantic HTML used? Form labels linked? Focus visible on keyboard `Tab` navigation?
- [ ] **10. Motion Cleanup:** Are GSAP / Motion / Lenis animation contexts safely cleaned up on component unmount?
- [ ] **11. Performance:** Images rendered via Next.js `<Image>` with explicit width/height or `fill`? No CLS layout shifts?
- [ ] **12. Error States:** Are 4 UX states (Loading, Success, Error, Empty) implemented for dynamic data views?
