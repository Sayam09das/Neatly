# Editorial Typography Skill — Neatly

This skill provides guidelines for type scales, font pairings, line heights, letter spacing, and editorial text hierarchy for **Neatly**.

---

## 1. Typography Personality

Neatly's typography is **clean, editorial, legible, and high-contrast**. It communicates professionalism, precision, and calm confidence.

---

## 2. Type Scale & Hierarchy

| Scale Element | Desktop Utility Classes | Mobile Utility Classes | Usage Guidelines |
| :--- | :--- | :--- | :--- |
| **Hero Display Title**| `text-5xl lg:text-6xl font-bold tracking-tight` | `text-4xl font-bold tracking-tight` | Single H1 per page; Hero headline |
| **Section H2 Heading**| `text-3xl lg:text-4xl font-semibold tracking-tight`| `text-2xl font-semibold` | Section headers |
| **Subsection H3** | `text-xl lg:text-2xl font-medium` | `text-lg font-medium` | Card titles, service titles |
| **Body Lead** | `text-lg lg:text-xl text-muted-foreground leading-relaxed`| `text-base text-muted-foreground` | Subheadings & lead paragraphs |
| **Body Standard** | `text-base text-muted-foreground leading-normal` | `text-sm text-muted-foreground` | General paragraph copy |
| **Caption / Label** | `text-xs sm:text-sm font-medium tracking-wide uppercase` | `text-xs font-medium uppercase` | Micro-badges, category tags |

---

## 3. Readability & Line Length Rules

* **Optimal Line Length:** Limit body copy text blocks to a maximum line length of 65-75 characters (`max-w-prose` or `max-w-2xl`).
* **Line Heights:** Use `leading-relaxed` (1.625) for body copy to prevent visual crowding. Use `leading-tight` (1.15-1.2) for large display headings.
* **Letter Spacing:** Apply tight letter spacing (`tracking-tight`) to large display titles for a refined, modern editorial feel.
