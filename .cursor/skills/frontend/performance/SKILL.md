# Performance & Core Web Vitals Skill — Neatly

This skill provides guidelines for optimizing page loading speed, hydration, asset delivery, and Core Web Vitals targets in **Neatly**.

---

## 1. Core Web Vitals Benchmark Targets

Neatly MUST meet or exceed the following Core Web Vitals benchmarks across mobile and desktop viewports:

* **LCP (Largest Contentful Paint):** < 1.8 seconds on standard 4G connections.
* **INP (Interaction to Next Paint):** < 100 milliseconds.
* **CLS (Cumulative Layout Shift):** < 0.05.

---

## 2. Technical Directives for Performance

### 2.1 Image Optimization
* Always use Next.js `<Image>` from `next/image`. Raw HTML `<img>` tags are forbidden.
* Always specify explicit `width` and `height` properties or use `fill` within a reserved parent container to eliminate Cumulative Layout Shift (CLS).
* Set `priority` strictly on above-the-fold Hero media. All below-the-fold media MUST load lazily (`loading="lazy"`).

### 2.2 Font Optimization
* Use self-hosted Google Fonts via `next/font/google` with `display: 'swap'` to prevent FOIT (Flash of Unstyled Text).

### 2.3 JavaScript Bundle Discipline
* Restrict Client Components (`"use client"`) to leaf nodes to prevent bundling heavy client libraries into parent components.
* Avoid importing massive utility packages (e.g., full Lodash or Moment.js) when native ES6 JavaScript functions or lightweight alternatives exist.

### 2.4 Server Rendering & Database Optimization
* Fetch data in Server Components directly via Service classes rather than making client-side `useEffect` fetch loops.
* Avoid N+1 queries by selecting explicit Prisma fields and utilizing optimized joins.
