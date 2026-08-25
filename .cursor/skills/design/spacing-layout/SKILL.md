# Spacing, Layout & Grid Scale Skill — Neatly

This skill provides guidelines for container bounds, vertical rhythm, spacing scales, and grid alignment in **Neatly**.

---

## 1. Container Caps & Centering

* **Standard Page Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (Caps maximum width at 1280px with responsive horizontal margins).
* **Narrow Content Container (Blog / Terms / Form):** `max-w-3xl mx-auto px-4 sm:px-6` (Caps reading/form width at 768px).

---

## 2. Spacing Scale & Vertical Rhythm

```text
Vertical Rhythm Scale
├── Section Padding (Mobile)  : py-12 to py-16
├── Section Padding (Desktop) : py-20 to py-32
├── Component Stack Gap       : space-y-6 to space-y-8
├── Header-to-Content Gap     : mb-12 to mb-16
└── Inline Element Gap        : gap-3 to gap-4
```

---

## 3. Grid Systems

* **3-Column Feature/Service Grids:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8`
* **2-Column Asymmetric Splits:** `grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12` (Content: `lg:col-span-5`, Media: `lg:col-span-7`).
* **4-Column Metric/Stat Grids:** `grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6`

---

## 4. Layout Rules

* Never overcrowd elements. Generous whitespace is a fundamental indicator of Neatly's premium service brand.
* Ensure consistent padding across top-level section wrappers.
