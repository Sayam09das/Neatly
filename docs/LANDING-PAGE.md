# Neatly Landing Page Architecture

Scaffold for `/`. Hero media, CMS data, and remaining section motion belong to later steps. The production navbar is implemented. Copy in `apps/web/src/config/landing.ts` is temporary until site settings and CMS records exist.

Composition:

```text
src/app/page.tsx
    ↓
LandingPage
    ↓
Navbar / main sections / footer
```

`LandingPage` stays a Server Component. The navbar opens a client boundary only for scroll elevation, active route, and the mobile Sheet.

## Conversion sequence

The product requirements require these 13 landmarks, in order:

1. Navbar (`Navbar`)
2. Hero
3. Trust indicators
4. Why Neatly
5. Services summary
6. Featured work
7. How it works
8. Statistics
9. Testimonials
10. Final CTA
11. Blog highlights
12. Newsletter
13. Footer (`SiteFooter`)

No extra SaaS bands (logos, pricing, team photos, 3D product shots).

## CTA hierarchy

| Rank | Label | Destination | Where it appears |
| :--- | :--- | :--- | :--- |
| Primary | Get a Quote | `/quote` | Navbar |
| Primary | Request a free quote | `/quote` | Hero, final CTA |
| Secondary | Explore services | `/services` | Hero, services summary |
| Contextual | View our work | `/portfolio` | Featured work |
| Contextual | Read the journal | `/blog` | Blog highlights |
| Capture | Subscribe | none yet | Newsletter (disabled) |

Do not alternate “Get started” / “Learn more”. Routes that are not built yet still use the PRD hrefs so later pages can land in the right place.

## Section briefs

### Navbar
- **Purpose:** Brand, primary navigation, quote action.
- **Content:** Replaceable wordmark + mark, About / Services / Portfolio / Blog / Contact, optional published phone, “Get a Quote”.
- **CTA:** Navbar quote (`navbarCta`) to `/quote`.
- **Hierarchy:** Logo left, links center, actions right on `lg`. Logo + menu control below `lg`.
- **Responsive:** Sticky header. Desktop row from `lg`. Mobile Sheet with links, phone slot, and full-width CTA.
- **Motion intent:** CSS hover/focus. Subtle background/border after 20px scroll. Sheet uses the existing primitive. Reduced motion via `motion-safe` and duration tokens.
- **A11y:** `<header>`, `nav aria-label="Primary"`, skip link to `#main-content`, `aria-current` on active routes, “Open menu” / “Close menu”.
- **Phone:** Render a `tel:` control only when `getPublishedPhone()` returns a real number. Do not invent digits.

### Hero
- **Purpose:** Answer what Neatly is, what it does, why it is trustworthy, and what to do next.
- **Content:** Eyebrow, one `h1`, supporting copy, primary + secondary CTAs, qualitative trust signals, media slot.
- **CTA:** Primary quote; secondary services.
- **Hierarchy:** `h1` is the only page title. CTAs sit above the media slot.
- **Responsive:** Single column. Later `lg` split (copy left, media right) without changing content order.
- **Motion intent:** Later GSAP scroll-driven entrance (copy fade/translate, media scale). Reduced motion: static content. Future client. Tool: GSAP + Lenis scroll. Not implemented.
- **A11y:** `section aria-labelledby="hero-heading"`. Media needs real `alt` when assets exist. No autoplay video in MVP.

### Trust indicators
- **Purpose:** Immediate credibility after the hero.
- **Content:** Four slots (insured, reviews, guarantee, screening) without invented scores.
- **CTA:** None. Scanning only.
- **Hierarchy:** `h2` then four `h3` items.
- **Responsive:** 1 → 2 → 4 columns (`md`, `lg`).
- **Motion intent:** Subtle entrance. Server. Tool: CSS or Framer later.
- **A11y:** List of headings, not icon-only badges.

### Why Neatly
- **Purpose:** Differentiate before service cards.
- **Content:** Four pillars from the PRD (vetting, materials, guarantee, scope).
- **CTA:** None.
- **Hierarchy:** `h2`, intro, `h3` pillars.
- **Responsive:** 1 column, 2 from `md`.
- **Motion intent:** Subtle entrance. Server. Tool: CSS or Framer later.
- **A11y:** Readable text; icons later are decorative.

### Services summary
- **Purpose:** Route visitors into the service they need.
- **Content:** Temporary category labels only. Live cards come from the services CMS.
- **CTA:** “View services” per card; section-level Explore services.
- **Hierarchy:** `h2`, intro, `h3` cards.
- **Responsive:** 1 column, 2 from `md`.
- **Motion intent:** Subtle entrance. Server until filtering exists.
- **A11y:** Cards are list items with text links, not clickable whole-card divs.

### Featured work
- **Purpose:** Visual proof.
- **Content:** Empty CMS slot. Before/after images later via `next/image`.
- **CTA:** View our work.
- **Hierarchy:** `h2`, empty copy, media slot.
- **Responsive:** Full-width slot; later side-by-side from `md`, slider interaction from `lg`.
- **Motion intent:** Later GSAP scroll-driven / pinned before-after on large screens; stacked stills on small screens. Future client. Tool: GSAP. Reduced motion: static pair.
- **A11y:** Slider must remain keyboard-operable; images need descriptive alt.

### How it works
- **Purpose:** Remove process ambiguity.
- **Content:** Three steps from the PRD (quote → confirm → clean).
- **CTA:** None (quote already offered above and below).
- **Hierarchy:** `h2`, ordered list, `h3` per step.
- **Responsive:** 1 column, 3 from `md`.
- **Motion intent:** Subtle entrance. Server. Tool: CSS or Framer later.
- **A11y:** `<ol>` so sequence is announced.

### Statistics
- **Purpose:** Scale proof — only with verified figures.
- **Content:** Labels only. Values stay empty until site settings provide them.
- **CTA:** None.
- **Hierarchy:** `h2`, empty notice, labeled slots.
- **Responsive:** 1 column, 3 from `sm`.
- **Motion intent:** Optional later count-up (Anime.js or GSAP). Disabled when reduced motion or when values are missing. Server until then.
- **A11y:** Never imply a number that is not in the data.

### Testimonials
- **Purpose:** Peer proof.
- **Content:** Empty until featured CMS reviews exist. No invented names, stars, or quotes.
- **CTA:** None.
- **Hierarchy:** `h2`, empty notice. Later `article` per review with `h3` attribution.
- **Responsive:** Stacked; carousel only if more than three published reviews (future client).
- **Motion intent:** Entrance; carousel uses Motion. Tool: Framer Motion if a carousel is required.
- **A11y:** Reviews as articles, not unlabeled slides.

### Final CTA
- **Purpose:** Convert remaining visitors.
- **Content:** Quote headline and short copy. No second competing primary action.
- **CTA:** Request a free quote only.
- **Hierarchy:** `h2`, copy, primary button.
- **Responsive:** Full-width button on small screens (`Button` already stretches via flex parent if needed).
- **Motion intent:** CSS hover/active on the button. Server. Tool: CSS.
- **A11y:** Heading + one button. No modal.

### Blog highlights
- **Purpose:** Authority and crawlable internal links.
- **Content:** Empty until published posts exist. Later three latest articles.
- **CTA:** Read the journal.
- **Hierarchy:** `h2`; later `h3` titles.
- **Responsive:** 1 column, 3 from `md`.
- **Motion intent:** Subtle entrance. Server.
- **A11y:** Meaningful titles, not “read more”. Covers need alt.

### Newsletter
- **Purpose:** Optional email capture. Not a quote substitute.
- **Content:** Disabled email field and consent copy. No submit in this step.
- **CTA:** Subscribe (disabled).
- **Hierarchy:** `h2`, copy, labeled input.
- **Responsive:** Stacked field + button; row from `sm`.
- **Motion intent:** CSS focus. Future client for React Hook Form + Zod. Tool: CSS now.
- **A11y:** `label htmlFor`, consent `aria-describedby`, no posting until the API exists.

### Site footer
- **Purpose:** Contact, explore, legal.
- **Content:** Development placeholders for address, phone, email, hours. Nav + privacy/terms.
- **CTA:** None (links only).
- **Hierarchy:** `h2` brand, `h3` Explore / Legal.
- **Responsive:** 1 column, 3 from `md`.
- **Motion intent:** None.
- **A11y:** `<footer>`, labeled navs. Replace placeholders before launch.

## Layout and spacing

Sections use `max-w-page`, `px-gutter`, and `py-section`. Do not invent per-section max-width or side padding. Header and footer use the same gutter and page cap.

Breakpoints: mobile-first `sm` `md` `lg` `xl` `2xl`. Sticky mobile quote chrome is a later navbar/hero task, not this scaffold.

## Image and video

| Slot | Role | Strategy |
| :--- | :--- | :--- |
| Hero media | hero / content | `next/image` with `priority`, explicit size, descriptive alt. No stock, no base64. |
| Featured work | product visualization | Lazy `next/image` before/after pair. |
| Blog covers | content | Lazy `next/image`. |
| Trust/why icons | decorative | Inline SVG later, `aria-hidden`. |
| Video | — | Not in the MVP homepage. If added later: muted, no autoplay when reduced motion, poster image, mobile still fallback. |

## Performance

Server Components by default. Keep JS at the leaf: navbar Sheet/scroll/active route, future hero GSAP, work slider, testimonial carousel, newsletter form. Lenis already wraps the tree from providers. Do not mark `LandingPage` as a client component. No database or API calls on `/` in this step.

## SEO

One `h1`. Section `h2`s in document order. Layout metadata from Step 10 remains the homepage title/description. JSON-LD `LocalBusiness` waits for real NAP data. Do not keyword-stuff temporary copy.

## What this step does not include

Designed hero photography, GSAP timelines, before/after slider, live CMS queries, quote/newsletter APIs, authentication, or invented social proof.
