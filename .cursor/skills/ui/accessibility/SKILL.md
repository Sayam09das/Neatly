# Accessibility (WCAG 2.1 AA) Skill — Neatly

This skill provides guidelines for enforcing WCAG 2.1 Level AA accessibility standards across all components and flows in **Neatly**.

---

## 1. Non-Negotiable Accessibility Rules

Accessibility is a mandatory core requirement built directly into components during initial development, NEVER patched as an afterthought.

---

## 2. Technical Standards & Directives

### 2.1 Semantic HTML
* Use `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<button>`, and `<a>` elements strictly according to their semantic purpose.
* Never use `<div onClick={...}>` as a button replacement. Interactive elements MUST use native `<button>` or `<a>` tags.

### 2.2 Form Labeling & Error Handling
* Every `<input>`, `<textarea>`, and `<select>` element MUST have a linked `<label htmlFor="...">` or carry an explicit `aria-label`.
* Dynamic inline validation errors and submit feedback banners MUST use `aria-live="polite"` regions so screen readers announce changes instantly.

### 2.3 Focus Management & Traps
* **Focus Outlines:** All interactive elements must render a high-contrast focus outline on keyboard `Tab` navigation (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`).
* **Modal Focus Traps:** Modal dialogs and mobile navigation drawers MUST trap focus while open and return focus to the trigger button upon closing.

### 2.4 Color Contrast Ratio
* Normal body text (below 18pt) MUST achieve a minimum contrast ratio of **4.5:1** against its background.
* Large headings (18pt+ bold or 24pt+ normal) MUST achieve a minimum contrast ratio of **3:1**.
* Color MUST NOT be the sole indicator used to convey state or error warnings (always pair color with icons or descriptive text).

### 2.5 Screen Reader & Alt Text
* All non-decorative images MUST include descriptive, accessibility-tested `alt` attributes.
* Decorative images (background flourishes, subtle graphics) MUST carry `alt=""` or `aria-hidden="true"` to prevent screen reader noise.

### 2.6 Reduced Motion Support
* All CSS transitions and JS animation hooks MUST respect OS settings (`@media (prefers-reduced-motion: reduce)`).
