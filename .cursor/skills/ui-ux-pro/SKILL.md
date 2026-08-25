# UI / UX Pro Master Skill — Neatly

This skill provides expert-level instructions for designing and composing high-converting, premium, clean, and high-trust user interfaces for **Neatly**.

---

## Mindset & Perspective

When designing UI/UX for Neatly, adopt the combined perspective of:
* **Senior Product Designer:** Focusing on user goals, conversion architecture, clear affordances, and flawless usability.
* **Senior UI Designer:** Focusing on high-contrast typography, balanced whitespace, layout rhythm, and refined aesthetic detail.
* **Senior UX Designer:** Eliminating cognitive friction, optimizing quote submission paths, and ensuring zero-confusion interaction flows.
* **Creative Director:** Protecting Neatly's calm, clean, minimal brand identity against cheap visuals, generic SaaS cliches, or cluttered layouts.

---

## 1. Premium UI Composition & Layout Rhythm

* **Generous Whitespace:** Never overcrowd elements. Neatly relies on spacious padding (`py-16 md:py-24 lg:py-32`) to signal calm authority, precision, and organization.
* **Container Bounds:** Standardize max container width to `max-w-7xl` (1280px) centered with responsive padding (`px-4 sm:px-6 lg:px-8`).
* **Vertical Rhythm:** Maintain consistent vertical spacing between sections:
  * Section padding: `py-16` (mobile) → `py-24` (desktop).
  * Heading-to-subheading gap: `mb-3` to `mb-4`.
  * Header-to-content gap: `mb-12` to `mb-16`.
  * Grid gaps: `gap-6` (cards) → `gap-8` or `gap-12` (feature blocks).
* **Asymmetric Balance:** Use subtle asymmetric layouts (e.g., 5-column content + 7-column media split) to break monotonous grid patterns without sacrificing alignment.

---

## 2. Information Hierarchy & Contrast

* **The 3-Second Scanning Rule:** A visitor must understand the page purpose within 3 seconds of scrolling.
* **Typographic Contrast:**
  * Page Title / Hero: Bold, crisp display font (`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight`).
  * Section Titles: Clean heading scale (`text-2xl sm:text-3xl lg:text-4xl font-semibold`).
  * Body Text: Muted high-legibility slate/neutral copy (`text-base sm:text-lg text-muted-foreground leading-relaxed`).
* **Focal Points:** Exactly ONE primary call-to-action (CTA) should dominate any given viewport screen. Secondary actions must use ghost or outline button variants.

---

## 3. Trust-Building UX Patterns

Because cleaning requires entering a client's physical home or office, trust is Neatly's highest converting currency:
* **Immediate Credibility Indicators:** Position trust badges (Licensed & Insured, 100% Reclean Guarantee, Vetted Cleaners) directly near CTAs and inside the Hero.
* **Proof of Quality:** Showcase interactive Before/After image comparison sliders rather than static stock photos.
* **Transparent Inclusions:** Detail explicit checklists of what is included in each cleaning package to eliminate scope anxiety.
* **Authentic Reviews:** Display real customer testimonials with star ratings, locations, and verified customer context. Never fabricate reviews.

---

## 4. Affordances & Interactive Micro-Interactions

* **Clear Affordances:** Interactive elements (buttons, links, inputs, cards) must visually signal their interactivity through subtle hover elevations, color shifts, or focus outlines.
* **Instant Feedback:** Every action must provide instant feedback:
  * Button clicks: Active scale shift (`active:scale-[0.98]`).
  * Hover states: Smooth 150ms-200ms background or shadow transitions.
  * Form inputs: Crisp focus ring (`focus-visible:ring-2 focus-visible:ring-primary`).
  * Form submits: Disabled loading state with an inline spinner.

---

## 5. Anti-Patterns: How to Avoid "Generic AI UI"

* ❌ **DO NOT** use dark-mode purple/blue grid backgrounds with floating 3D icons.
* ❌ **DO NOT** use heavy glassmorphism overlays with low-contrast text.
* ❌ **DO NOT** use excessive neon gradients or rainbow border glows.
* ❌ **DO NOT** use giant rounded corners (`rounded-3xl` or `rounded-full` on large cards). Stick to refined bounds (`rounded-xl` or `rounded-2xl`).
* ❌ **DO NOT** clutter pages with floating chat widgets, fake countdown timers, or intrusive exit popups.
