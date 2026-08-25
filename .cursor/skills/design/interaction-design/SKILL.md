# Interaction Design & Affordance Skill — Neatly

This skill provides guidelines for interactive element states, hover/focus behaviors, touch target feedback, and state transitions in **Neatly**.

---

## 1. Interactive Element State Requirements

Every interactive UI element (button, link, form input, card trigger, mobile menu item) MUST support six distinct visual states:

```text
Interactive States Matrix
├── 1. IDLE     -> Base un-focused styling (clean border, high-contrast text).
├── 2. HOVER    -> Subtle 150ms transition (light background shift or elevation).
├── 3. FOCUS    -> High-contrast keyboard focus outline (focus-visible:ring-2).
├── 4. ACTIVE   -> Press down physical feedback (active:scale-[0.98]).
├── 5. DISABLED -> Visually muted state (opacity-50 pointer-events-none).
└── 6. LOADING  -> Disabled state + inline spinner icon / shimmer placeholder.
```

---

## 2. Touch & Pointer Rules

* **Desktop Hover:** Use smooth CSS transitions (`transition-colors duration-200` or `transition-all duration-200`). Never animate layout properties (`width`, `height`, `margin`) on hover.
* **Mobile Touch Targets:** On touch viewports (`< md`), ensure touch targets satisfy the 44x44px minimum sizing rule.
* **Touch Ripple / Press:** Use active scaling (`active:scale-[0.98]`) for tactile feedback on touch screens.

---

## 3. Form Input Feedback

* Inputs must highlight clean focus borders on tap/focus.
* Invalid input fields must highlight an inline error border (`border-destructive`) and display inline error text (`aria-live="polite"`).
* Valid input fields must clear error styles immediately upon user correction.
