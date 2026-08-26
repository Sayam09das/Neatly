# Neatly Landing Page Architecture

Scaffold for `/`. Remaining section motion, CMS data, and quote APIs belong to later steps. The production navbar and Hero are implemented. Copy in `apps/web/src/config/landing.ts` is temporary until site settings and CMS records exist.

Composition:

```text
src/app/page.tsx
    ↓
LandingPage
    ↓
Navbar / main sections / footer
```

`LandingPage` stays a Server Component. Navbar and Hero open client boundaries only at interactive leaves (Sheet, scroll elevation, Hero motion, quote form).

## Conversion sequence

The product requirements require these 13 landmarks, in order:

1. Navbar (`Navbar`)
2. Hero
3. Why Neatly (production; includes trust metric slots)
4. Services (production)
5. Trust indicators (production pending figures)
6. Featured work (production brand photography; CMS case studies later)
7. How it works (production)
8. Statistics (production pending figures)
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
| Secondary | Explore services | `/services` | Hero, services |
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
- **Content:** Eyebrow, one `h1` with a single accent phrase, supporting copy, primary quote CTA, qualitative trust signals, preview quote card, cinematic background slot.
- **CTA:** Primary quote to `/quote`. Secondary services as a text link, not a second button.
- **Form:** UI-only preview (name, email, service, message). Validates with Zod. Does not write to the database or show a fake success. Points visitors to `/quote`.
- **Hierarchy:** Copy left, quote card right from `lg`. Stacked on smaller screens. Navbar overlays the top of the Hero on `/`.
- **Media:** Four cinematic frames at `apps/web/public/images/hero/01_img.jpeg` … `04_img.jpeg` (~2752×1536). Frame 01 is the LCP image. Later frames load eagerly to avoid crossfade flashes. Decorative `alt=""`.
- **Motion intent:** GSAP ScrollTrigger pin + scrubbed scale/crossfade timeline. Framer Motion only for the copy/form entrance. Reduced motion shows Frame 01 only, with no pin.
- **A11y:** `section aria-labelledby="hero-heading"`. Form labels, `aria-invalid`, live unavailable message. Background photography is `aria-hidden`.

### Why Neatly
- **Purpose:** Differentiate immediately after the Hero: quality, professionals, and a clear satisfaction standard.
- **Content:** Eyebrow, editorial `h2` with a single accent on “Neatly”, supporting copy, three photographic benefit cards (vetting, satisfaction standard, transparent scope), four metric slots without invented numbers. Decorative line-art is `aria-hidden`.
- **CTA:** None. Scanning only.
- **Hierarchy:** `h2`, then `h3` per card. Metrics use labeled values, not extra headings.
- **Responsive:** Cards stack, then 2 columns from `md`, 3 from `lg`. Metrics 2×2, then 4 from `lg`.
- **Media:** Dedicated Why photography at `apps/web/public/images/why_use/why_use_01.jpeg` … `03.jpeg`. No stock. No Hero frames.
- **Motion intent:** One GSAP ScrollTrigger timeline (heading → staggered cards + image settle → metrics). Reversible on scroll up. Subtle image parallax from `md`. Framer hover lift + image scale, tap scale on touch. Reduced motion skips GSAP and hover transforms. No count-up until real figures exist.
- **A11y:** Section `aria-labelledby="why-heading"`. Meaningful image alt. Decorative SVG hidden.

### Services
- **Purpose:** Show the main PRD service categories immediately after Why Neatly.
- **Content:** Eyebrow, editorial `h2` with a single accent, supporting copy, one featured photographic card (residential), two secondary cards (deep, commercial). Move-in/recurring remain on `/services`.
- **CTA:** Per-card “View {title}” icon link to `/services`. Section-level Explore services.
- **Hierarchy:** `h2`, then `h3` per card.
- **Responsive:** Featured full width, then 2-column secondary from `md`. Stacked on mobile.
- **Media:** Dedicated Services photography at `apps/web/public/images/Services/` (`01_residential`, `02_deep`, `04_commercial`). Descriptive alt. No stock. No Why or Hero frames.
- **Motion intent:** GSAP ScrollTrigger (heading → rule → featured → secondary). Clip-path + scale image reveal; subtle parallax from `md`. Framer hover lift, image scale, arrow shift; tap scale on touch. Reduced motion skips GSAP and hover transforms. Decorative rule is GSAP `scaleX`, not Anime.js.
- **A11y:** Section `aria-labelledby="services-heading"`. Icon links have accessible names. Curve is `aria-hidden`.

### Trust indicators
- **Purpose:** Credibility immediately after Services, without invented scores.
- **Content:** Eyebrow, editorial `h2`, supporting copy, four labeled pillars with pending figures (`—`).
- **CTA:** None. Scanning only.
- **Hierarchy:** `h2` then four `h3` items.
- **Responsive:** 1 → 2 → 4 columns (`sm`, `lg`).
- **Motion intent:** GSAP fade/rise on enter. Reversible. Reduced motion skips GSAP.
- **A11y:** List of headings, not icon-only badges. Never imply a published count.

### Featured work
- **Purpose:** Visual proof of the kinds of spaces Neatly is built for.
- **Content:** Eyebrow, `h2`, intro, four brand-photography tiles (residential, deep, commercial, living spaces) plus the CMS empty notice. Not case studies.
- **CTA:** View our work.
- **Hierarchy:** `h2`, figcaptions, empty copy.
- **Responsive:** 1 → 2 → 4 columns (`md`, `lg`) with a slight staggered offset from `lg`.
- **Motion intent:** GSAP section reveal. Framer image scale on hover. Reduced motion skips both.
- **A11y:** Meaningful alt. Decorative marquee below is `aria-hidden`.

### How it works
- **Purpose:** Remove process ambiguity.
- **Content:** Three PRD steps (quote → confirm → clean) on a dark photographic band. Not four invented steps.
- **CTA:** None (quote already offered above and below).
- **Hierarchy:** `h2`, ordered list, `h3` per step.
- **Responsive:** 1 column, 3 from `md`.
- **Motion intent:** GSAP header, rule, steps, and image settle. Reduced motion skips GSAP.
- **A11y:** `<ol>` so sequence is announced. Background photo is `aria-hidden`.

### Statistics
- **Purpose:** Scale proof — only with verified figures.
- **Content:** Labels and pending values. Count-up stays off until site settings provide numbers.
- **CTA:** None.
- **Hierarchy:** `h2`, empty notice, labeled slots.
- **Responsive:** 1 column, 3 from `sm`.
- **Motion intent:** GSAP reveal. No count-up while values are pending.
- **A11y:** Never imply a number that is not in the data.

### Testimonials
- **Purpose:** Peer proof.
- **Content:** Atmospheric photography plus empty quote copy until featured CMS reviews exist. No invented names, stars, or quotes.
- **CTA:** None.
- **Hierarchy:** `h2`, empty notice. Later `article` per review.
- **Responsive:** Stacked; split from `lg`.
- **Motion intent:** GSAP reveal. Carousel waits for published reviews.
- **A11y:** Decorative quote mark is `aria-hidden`.

### Final CTA
- **Purpose:** Convert remaining visitors.
- **Content:** Quote headline and short copy. No second competing primary action.
- **CTA:** Request a free quote only.
- **Hierarchy:** `h2`, copy, primary button.
- **Responsive:** Centered. Full-width button on small screens if the flex parent stretches it.
- **Motion intent:** CSS hover/active on the button. Server. Tool: CSS.
- **A11y:** Heading + one button. No modal.

### Blog highlights
- **Purpose:** Authority and crawlable internal links.
- **Content:** Featured reserved card plus three titled slots until published posts exist.
- **CTA:** Read the journal.
- **Hierarchy:** `h2`; featured `h3`; later live titles.
- **Responsive:** Featured + stack from `lg`.
- **Motion intent:** None yet. Server.
- **A11y:** Meaningful titles, not “read more”.

### Newsletter
- **Purpose:** Optional email capture. Not a quote substitute.
- **Content:** Dark photographic band, disabled email field, consent copy, explicit unavailable message. No submit in this step.
- **CTA:** Subscribe (disabled).
- **Hierarchy:** `h2`, copy, labeled input.
- **Responsive:** Stacked field + button; row from `sm`.
- **Motion intent:** CSS focus. Future client for React Hook Form + Zod.
- **A11y:** `label htmlFor`, consent and unavailable `aria-describedby`, no posting until the API exists.

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

Server Components by default. Keep JS at the leaf: navbar Sheet/scroll/active route, Hero motion and quote form, future work slider, testimonial carousel, newsletter form. Lenis already wraps the tree from providers. Do not mark `LandingPage` as a client component. No database or API calls on `/` in this step.

## SEO

One `h1`. Section `h2`s in document order. Layout metadata from Step 10 remains the homepage title/description. JSON-LD `LocalBusiness` waits for real NAP data. Do not keyword-stuff temporary copy.

## What this step does not include

Approved photography, GSAP section timelines, before/after slider, live CMS queries, quote/newsletter APIs, authentication, or invented social proof.
