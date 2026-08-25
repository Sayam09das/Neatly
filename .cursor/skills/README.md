# Neatly Pro UI/UX + Animation Skills Library

This directory contains the Cursor Expert Skills library for **Neatly**—a production-grade, premium cleaning service marketing website and business management platform.

The skills library provides decision frameworks, architectural standards, visual rules, and technical directives for engineering Neatly's user interface, user experience, animation stack, component design system, and frontend architecture.

---

## Brand Identity & Aesthetic Baseline

Every skill in this library enforces Neatly's core brand positioning:

> **Neatly = Clean, Minimal, High-Trust, Premium, Modern, Professional, Calm.**

### Visual Language Rules
* **Generous Whitespace:** Utilize spacious layout rhythms (`py-16`, `py-24`, `gap-8`, `gap-12`) to communicate calm authority and precision.
* **Calm Typography:** High-contrast, clean sans-serif typography with strict hierarchy.
* **Restrained Motion:** Purposeful micro-interactions and scroll reveals that enhance storytelling without cluttering UX.
* **High-Trust Proof:** Prominent verified reviews, real before/after proof of work, clear guarantees, transparent scope inclusions.

### Strict Anti-Patterns (Forbidden)
* ❌ No neon or bright gradients.
* ❌ No dark-mode purple grid templates or floating 3D icons.
* ❌ No heavy glassmorphism with low contrast text.
* ❌ No excessive rounded cards (`rounded-3xl` on tiny elements).
* ❌ No constant spinning background objects or infinite loops.
* ❌ No generic SaaS aesthetics or AI-generated landing page cliches.

---

## Skill Directory Structure

```text
.cursor/skills/
├── README.md                          # Master sitemap and decision tree
├── ui-ux-pro/
│   └── SKILL.md                       # Senior UI/UX & Creative Direction guidance
├── animation/
│   ├── gsap/
│   │   └── SKILL.md                   # GSAP, ScrollTrigger, timelines, context cleanup
│   ├── anime-js/
│   │   └── SKILL.md                   # Lightweight SVG & specialized micro-animations
│   ├── framer-motion/
│   │   └── SKILL.md                   # Component state transitions, modals, drawers
│   ├── lenis/
│   │   └── SKILL.md                   # Smooth scroll normalization & GSAP integration
│   └── scroll-driven/
│       └── SKILL.md                   # Scroll storytelling, pinned reveals, scrubbed scenes
├── ui/
│   ├── shadcn/
│   │   └── SKILL.md                   # Radix UI primitives customization & accessibility
│   ├── 21st-dev/
│   │   └── SKILL.md                   # Modern component adaptation & quality rules
│   ├── responsive-design/
│   │   └── SKILL.md                   # Mobile-first design across 5 viewport breakpoints
│   └── accessibility/
│       └── SKILL.md                   # WCAG 2.1 AA, keyboard focus, ARIA, reduced motion
├── frontend/
│   ├── nextjs/
│   │   └── SKILL.md                   # Server Components by default, App Router rules
│   ├── typescript/
│   │   └── SKILL.md                   # Strict typing, discriminated unions, zero 'any'
│   ├── tailwind/
│   │   └── SKILL.md                   # Design tokens, utility-first styling, cn() helper
│   └── performance/
│       └── SKILL.md                   # Core Web Vitals (LCP, INP, CLS), asset optimization
├── design/
│   ├── typography/
│   │   └── SKILL.md                   # Editorial type scale, line heights, contrast
│   ├── color-system/
│   │   └── SKILL.md                   # Semantic design tokens, high contrast neutrals
│   ├── spacing-layout/
│   │   └── SKILL.md                   # Container caps, vertical rhythm, grid systems
│   ├── visual-hierarchy/
│   │   └── SKILL.md                   # Focal points, primary/secondary CTAs, visual flow
│   └── interaction-design/
│       └── SKILL.md                   # Hover, focus, active, loading, error feedback
├── web/
│   ├── premium-web-design/
│   │   └── SKILL.md                   # Master skill for high-trust premium web experiences
│   ├── landing-page/
│   │   └── SKILL.md                   # Conversion-oriented section ordering & flow
│   ├── navigation/
│   │   └── SKILL.md                   # Sticky headers, mobile drawers, active states
│   └── hero/
│       └── SKILL.md                   # Cinematic conversion hero, 5-second clarity rules
└── quality/
    ├── ui-quality/
    │   └── SKILL.md                   # Self-inspection checklist for visual finish
    ├── motion-quality/
    │   └── SKILL.md                   # Motion tool selection hierarchy & GPU performance
    └── design-review/
        └── SKILL.md                   # Final pre-completion design QA checklist
```

---

## Decision Trees for Agents

### 1. General UI Development Workflow

```text
User Request for UI / UX Component
               │
               ▼
   Read ui-ux-pro/SKILL.md
               │
               ▼
   Apply Design Tokens (color-system, typography, spacing-layout)
               │
               ▼
   Apply Responsive Guidelines (responsive-design: 320px to 1536px)
               │
               ▼
   Implement Component Primitives (shadcn, 21st-dev adaptation)
               │
               ▼
   Select Animation Tool (See Animation Decision Tree)
               │
               ▼
   Apply Accessibility Standards (accessibility: WCAG 2.1 AA)
               │
               ▼
   Audit Performance (performance: Core Web Vitals)
               │
               ▼
   Execute Final QA Pass (quality/design-review & quality/ui-quality)
```

---

### 2. Animation Library Selection Decision Tree

> **Rule:** NEVER use multiple animation libraries to animate the same property of the same element. Always pick the smallest, most specialized tool for the job.

```text
               What is the animation requirement?
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
Simple Hover / Focus     Component State      Scroll-Driven Timeline
 Color / Underline      Modal / Drawer / Tab   Hero Reveal / Pin Scene
       │                       │                       │
       ▼                       ▼                       ▼
Native CSS Transitions   Motion (Framer)      GSAP + ScrollTrigger
 (`transition-all`)      (`motion.div`)       (`useGSAP` + ScrollTrigger)
                                                       │
                                                       ▼
                                            Global Smooth Scrolling
                                                      │
                                                      ▼
                                                Lenis Scroll
                                             (`lenis.on('scroll')`)
```

* **Anime.js:** Reserved *only* for specialized SVG path morphing, complex icon stroke animations, or standalone canvas micro-interactions.

---

## Compliance & Governance

Every skill in this directory enforces the architectural boundaries defined in:
* [`docs/PRD.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/PRD.md)
* [`docs/ARCHITECTURE.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/ARCHITECTURE.md)
* [`docs/DATABASE.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/DATABASE.md)
* [`AGENTS.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/AGENTS.md)
