# Responsive Design & Multi-Viewport Skill — Neatly

This skill provides guidelines for engineering mobile-first responsive interfaces across all five Tailwind breakpoints in **Neatly**.

---

## 1. Breakpoint Tier Matrix

Neatly MUST render flawlessly across nine specific viewport targets across five standardized Tailwind breakpoint tiers:

```text
Viewport Target Hierarchy
├── 320px  (Small Mobile Portrait)   -> sm: 640px
├── 375px  (Standard Mobile)         -> sm: 640px
├── 390px  (Modern iPhone Portrait)  -> sm: 640px
├── 430px  (Large Mobile Portrait)   -> sm: 640px
├── 768px  (Tablet & Mobile Land)    -> md: 768px
├── 1024px (Laptop & Desktop Nav)    -> lg: 1024px
├── 1280px (Standard Desktop Cap)    -> xl: 1280px
├── 1440px (Large Desktop Screen)    -> 2xl: 1536px
└── 1920px (Ultra-Wide Display)      -> 2xl: 1536px (Max container cap: 1280px centered)
```

---

## 2. Mobile-First Layout Principles

1. **Default Classes for Mobile:** Write default Tailwind utility classes for mobile viewports (`w-full flex-col text-left py-12 px-4`). Layer `md:`, `lg:`, and `xl:` utilities progressively.
2. **Zero Horizontal Scrollbar Leakage:** Main page wrappers MUST enforce `overflow-x-hidden`. No element may cause unwanted horizontal overflow on 320px screens.
3. **Minimum Touch Target Limits:** On viewports under 768px (`< md`), all clickable buttons, form inputs, and icon triggers MUST enforce a minimum touch area of **44x44 pixels** (`min-h-[44px] min-w-[44px]`).
4. **Fluid Typography & Spacing:** Use responsive text scaling (`text-3xl sm:text-4xl lg:text-5xl`) and adaptive section padding (`py-12 sm:py-16 md:py-24`).

---

## 3. Responsive Component Rules

### Hero Section
* Mobile: Single column vertical stack (Headline -> Copy -> Full-width CTA -> Image).
* Desktop (`lg:`): Side-by-side 2-column layout.

### Quote Form (`/quote`)
* Mobile: Single-column inputs stacked vertically.
* Desktop (`md:` / `lg:`): 2-column input rows for Property Size, Bedrooms, Bathrooms, and Preferred Date/Time.

### Admin Dashboard Tables
* Mobile: Tables wrap horizontally (`overflow-x-auto`) or convert into stacked card widgets for easy mobile inspection.

---

## 4. Multi-Viewport Verification Checklist

Before considering any page complete, verify rendering at:
- [ ] **320px:** No text clipping or horizontal scrollbar leakage.
- [ ] **390px:** Mobile touch targets clear and easily tappable.
- [ ] **768px:** 2-column grid transitions work seamlessly.
- [ ] **1024px:** Desktop navigation header displays cleanly.
- [ ] **1440px+:** Main content remains properly centered within container bounds (`max-w-7xl mx-auto`).
