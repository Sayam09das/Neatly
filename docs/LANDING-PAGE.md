# Neatly Landing Page Architecture

Scaffold for `/`. Remaining section motion, CMS data, and quote APIs belong to later steps. The production navbar and Hero are implemented. Copy in `apps/web/src/config/landing.ts` is temporary until site settings and CMS records exist.

Composition:

```text
src/app/page.tsx
    ↓
LandingPage
    ↓
Navbar / main sections / ClosingBand (newsletter + footer)
```

`LandingPage` stays a Server Component. Navbar and Hero open client boundaries only at interactive leaves (Sheet, scroll elevation, Hero motion, quote form).

## Conversion sequence

The product requirements require these landmarks, in order:

1. Navbar (`Navbar`)
2. Hero
3. Why Neatly (production; includes trust metric slots)
4. Services (production)
5. Trust indicators (production pending figures)
6. Featured work (production brand photography; CMS case studies later)
7. How it works (production)
8. Trust / proof (production)
9. Statistics (production)
10. Testimonials
11. Final CTA
12. Blog highlights
13. Newsletter (shares `ClosingBand` photograph with the footer)
14. Footer (`SiteFooter`, same photograph as Newsletter)

No extra SaaS bands (logos, pricing, team photos, 3D product shots).

## CTA hierarchy

| Rank | Label | Destination | Where it appears |
| :--- | :--- | :--- | :--- |
| Primary | Get a Quote | `/quote` | Navbar |
| Primary | Request a free quote | `/quote` | Hero, final CTA |
| Secondary | Explore services | `/services` | Hero (guests and admins), services |
| Account | Your account | `/dashboard` | Hero secondary and final CTA text link for authenticated customers |
| Contextual | View our work | unpublished | Featured work (omitted until `/portfolio` exists) |
| Contextual | Read the journal | unpublished | Blog highlights (omitted until `/blog` exists) |
| Capture | Subscribe | none yet | Newsletter (disabled) |

Do not alternate “Get started” / “Learn more”. Home links only to routes that exist. Do not invent `/portfolio`, `/blog`, or `/contact` hrefs before those pages ship.

## Section briefs

### Navbar
- **Purpose:** Brand, primary navigation, quote action.
- **Content:** Replaceable wordmark + mark, About / Services, optional published phone, “Get a Quote”. Portfolio, Blog, and Contact stay out of the public nav until those routes exist.
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
- **Motion intent:** Two GSAP ScrollTrigger stories: heading → staggered cards + image settle on the section; a second trigger on the metrics band (staggered items + accent `scaleX`). Reversible on scroll up. Subtle image parallax from `md`. Framer hover lift + image scale on cards, hover lift on metric tiles, tap scale on touch. Count-up is wired on metric figures and runs only when a published value exists. Reduced motion skips GSAP and hover transforms. No invented counts.
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
- **Content:** Eyebrow, editorial `h2`, supporting copy, four labeled pillars. Figure slots are `null` until site settings publish verified counts. Count-up runs only when a value exists.
- **CTA:** None. Scanning only.
- **Hierarchy:** `h2` then four `h3` items.
- **Responsive:** 1 column, 2×2 from `sm`.
- **Motion intent:** GSAP ScrollTrigger (header → staggered pillars, accent bars via `scaleX`). Framer hover lift. Isolated count-up when a figure is published. Lenis remains the global scroller. Reduced motion skips choreography and jumps to the final figure. No pinning. No invented counts.
- **A11y:** List of headings, not icon-only badges. Never imply a published count.

### Featured work
- **Purpose:** Visual proof of the kinds of spaces Neatly is built for.
- **Content:** Eyebrow, `h2`, intro, seven brand-photography slides (kitchen, office, floors, bathroom, carpet, windows, living room) plus the CMS empty notice. Not case studies.
- **CTA:** View our work.
- **Hierarchy:** `h2`, figcaptions, empty copy.
- **Responsive:** Centered Swiper track (about 1.2 → 2.2 → 2.7 slides). Side slides peek and clip at the viewport. Previous/Next plus `01 / 07`.
- **Media:** `images/work/01_kitchen.jpeg` through `07_spotless.jpeg` (896×1200). Descriptive alt. No invented case studies.
- **Motion intent:** GSAP ScrollTrigger on header, rule, empty copy, and CTA only. Swiper owns horizontal slide transitions (`centeredSlides`, loop, drag/swipe, keyboard, autoplay ~3.5s). Autoplay resumes after swipe and pauses on Previous/Next hover or focus, not on the photograph. Lenis stays the page scroller (`data-lenis-prevent`). Reduced motion sets Swiper speed to 0, skips autoplay, and skips inactive-slide scale. No pinning. No mousewheel hijack.
- **A11y:** Meaningful alt. Decorative rule is `aria-hidden`. Carousel region label plus previous/next.

### How it works
- **Purpose:** Remove process ambiguity.
- **Content:** Three PRD steps (request → quote → finished visit) with dedicated campaign photography. Not four invented steps.
- **CTA:** None (quote already offered above and below).
- **Hierarchy:** `h2`, ordered list, `h3` per step.
- **Responsive:** 1 column, 3 from `md`.
- **Media:** `apps/web/public/images/how_it_works/01_request.jpeg`, `02_quote.jpeg`, `03_result.jpeg` (1536×864, 16:9). Descriptive alt. No fake UI or prices in frame.
- **Motion intent:** GSAP ScrollTrigger story (header, 01→02→03, clip-path image reveal, progress line). Subtle image parallax from `md`. Framer hover/tap on cards. Reduced motion skips motion. No pinning.
- **A11y:** `<ol>` so sequence is announced. Meaningful image alt.

### Trust / proof
- **Purpose:** Answer why a visitor should trust Neatly after seeing the process—without invented scores.
- **Content:** Eyebrow, editorial `h2`, supporting copy, one campaign photograph, four PRD-backed principles (vetted people, explicit scope, completed checklist, considered materials). No ratings, counts, or certifications.
- **CTA:** None. Testimonials follow.
- **Hierarchy:** `h2`, ordered list, `h3` per principle.
- **Responsive:** Copy → image → principles on small screens. Image left / copy+list right from `lg` (~7/5).
- **Media:** `apps/web/public/images/trust/01_standard.jpeg`. Descriptive alt. Not a kitchen-wipe repeat of Services/Why frames.
- **Motion intent:** GSAP ScrollTrigger story (eyebrow → heading clip → intro → image wipe → 01–04). Subtle image parallax and active-item opacity from `lg`. Framer hover/tap on principles. Reduced motion skips motion. No pinning. No Anime.js.
- **A11y:** Section `aria-labelledby="proof-heading"`. Meaningful alt. Decorative rules `aria-hidden`.

### Statistics
- **Purpose:** Scale proof immediately after rational trust.
- **Content:** Editorial `h2`, supporting copy, three labeled counters (homes cleaned, satisfaction, insured coverage). Count-up runs when a slot value exists.
- **CTA:** None.
- **Hierarchy:** `h2`, then `h3` per slot.
- **Responsive:** 1 column, 3 from `sm`.
- **Motion intent:** GSAP ScrollTrigger (heading → intro → staggered slots, accent bars via `scaleX`). Framer hover lift. Isolated count-up on published figures. Reduced motion skips choreography and jumps to the final figure. No pinning.
- **A11y:** List of headings, not icon-only badges. Screen readers hear the figure, not a pending dash, once a value is published.

### Testimonials
- **Purpose:** Peer proof after rational trust and statistics—without invented names, stars, or quotes.
- **Content:** Eyebrow, editorial `h2`, supporting copy. Featured story layout (photograph + quote) is content-ready. Production currently renders the empty/content-ready quote because no featured CMS reviews exist. Clickable 01–03 indexes plus previous/next switch reserved brand photographs—not fabricated customers. Live previous/next for reviews appears only when two or more published reviews exist.
- **CTA:** None. Final CTA follows.
- **Hierarchy:** `h2`. Live reviews use `blockquote` + `cite`, not extra headings.
- **Responsive:** Copy, then image, then quote on small screens. Image left / quote right from `lg` (~7/5). Stack rather than compress on tablet.
- **Media:** Reserved brand stills at `apps/web/public/images/testimonials/01_slot.jpeg`–`03_slot.jpeg` until a published review includes a photograph. Descriptive alt. Not fake customer portraits. Next/Image. No stock. No Hero frames.
- **Motion intent:** GSAP section reveal on the heading and gallery. Motion fade-and-slide between the three reserved stills, with autoplay (~3.5s). Autoplay pauses on control hover/focus, not on the photograph (so looking at the image does not stop the slider). Horizontal swipe on the figure changes slides; Lenis stays the global scroller (`data-lenis-prevent` on the figure). Reduced motion swaps instantly and skips autoplay. Live review previous/next remains when two or more published reviews exist. No pinning. No Swiper—Motion owns this carousel per ADR-05.
- **A11y:** Section `aria-labelledby="testimonials-heading"`. Only the active reserved photograph keeps a meaningful alt; inactive frames are `aria-hidden`. Photograph previous/next/index have accessible names. The reserved media label is announced to screen readers.
- **A11y:** Section `aria-labelledby="testimonials-heading"`. Only the active reserved photograph keeps a meaningful alt; inactive frames are `aria-hidden`. Photograph previous/next/index have accessible names. The reserved media label is announced to screen readers.

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
- **Content:** Editorial `h2` with a single accent on “journal”, featured campaign still, three reserved thumbnail rows. Titles stay pending until the blog CMS publishes posts. No invented articles.
- **CTA:** Read the journal.
- **Hierarchy:** `h2`; featured `h3`; reserved slot copy until live titles exist.
- **Responsive:** Featured + stack from `lg`. Thumbnails stay square; copy wraps rather than compressing.
- **Media:** `apps/web/public/images/journal/01_featured.jpeg` plus `02_slot`–`04_slot.jpeg`. Descriptive alt. Not published covers. No stock. No Hero frames.
- **Motion intent:** GSAP ScrollTrigger story (header → featured wipe → slots). Clip-path + scale image reveal; subtle featured parallax from `md`. Framer hover lift on slot rows and image scale on the featured still. GSAP draws the heading underline stroke when the path enters view. Lenis remains the global scroller (`getLenis()` / existing `SmoothScroll`). Reduced motion skips choreography. No pinning.
- **A11y:** Section `aria-labelledby="blog-heading"`. Meaningful alt. Decorative underline is `aria-hidden`. CTA is “Read the journal”, not a generic “read more”.

### Newsletter
- **Purpose:** Optional email capture. Not a quote substitute.
- **Content:** Nested email field with Subscribe, consent copy, explicit unavailable message. No submit in this step.
- **CTA:** Subscribe (disabled).
- **Hierarchy:** `h2` with accent on “notes”, copy, labeled input.
- **Responsive:** Stacked field + button; nested row from `sm`.
- **Media:** One decorative still, `apps/web/public/images/newsletter/01_notes.jpeg`, on `ClosingBand` — the same photograph continues under the footer. Do not duplicate the JPEG. Overlay `bg-secondary/80` keeps type readable. `BandCurve` is top-only so the photo is not cut before the footer.
- **Motion intent:** GSAP ScrollTrigger on the form copy. Image scale settle and subtle parallax from `md` belong to `ClosingBand` so they cover newsletter + footer as one surface. Form stays disabled—no Motion hover that implies it submits. Reduced motion skips choreography. No pinning. No second Lenis instance.
- **A11y:** `label htmlFor`, consent and unavailable `aria-describedby`, no posting until the API exists.

### Site footer
- **Purpose:** Contact, explore, services, legal—the last utility surface after the newsletter.
- **Content:** Brand mark + promise, Explore from primary nav, Services from published landing categories, Support (Log in, Register, quote) until site settings publish real contact details. Quote text link. Social stays pending until real profile URLs exist in site settings. Privacy/terms in the bottom bar. No invented social URLs. Do not render placeholder email, phone, hours, or address as live contact. Authenticated customers see an Account column instead of Support.
- **CTA:** Text link to Request a free quote. Not a second banner.
- **Hierarchy:** `h2` brand (visually the logo lockup), `h3` Explore / Services / Support or Account. Legal heading is visually hidden for the bottom links.
- **Responsive:** Brand stack, then 1 → 2 → 3 utility columns (`sm`, `lg`). Bottom bar stacks, then splits from `sm`.
- **Media:** Transparent over `ClosingBand`. Same `01_notes.jpeg` as Email notes — not a second image and not a solid `bg-secondary` slab. Public service/quote frames and the account shell use the solid `bg-secondary` surface.
- **Motion intent:** GSAP ScrollTrigger story (brand → rule `scaleX` → staggered columns → legal bar). CSS hover color + slight translate on links. Reduced motion skips GSAP. Lenis remains the global scroller. No pinning. No Swiper. No invented social icons.
- **A11y:** `<footer>` landmark (inside `<main>` on the landing/about photograph band). Labeled navs. Render a `tel:` control only when `getPublishedPhone()` returns a real number. Replace placeholders before launch.

## Layout and spacing

Sections use `max-w-page`, `px-gutter`, and `py-section`. Do not invent per-section max-width or side padding. Header and footer use the same gutter and page cap.

Breakpoints: mobile-first `sm` `md` `lg` `xl` `2xl`. Sticky mobile quote chrome is a later navbar/hero task, not this scaffold.

## Image and video

| Slot | Role | Strategy |
| :--- | :--- | :--- |
| Hero media | hero / content | `next/image` with `priority`, explicit size, descriptive alt. No stock, no base64. |
| Featured work | product visualization | Lazy `next/image` stills in a Swiper gallery. CMS before/afters later. |
| Blog covers | content | Lazy `next/image`. Journal empty state uses dedicated stills at `images/journal/`. |
| Closing band (newsletter + footer) | decorative | One lazy `next/image` (`01_notes.jpeg`), `alt=""`, `aria-hidden` parent spanning both sections. |
| Trust/why icons | decorative | Inline SVG later, `aria-hidden`. |
| Video | — | Not in the MVP homepage. If added later: muted, no autoplay when reduced motion, poster image, mobile still fallback. |

## Performance

Server Components by default. Keep JS at the leaf: navbar Sheet/scroll/active route, Hero motion and quote form, section GSAP/Motion scenes, Featured Work Swiper gallery, testimonial carousel (only when two or more published reviews exist), newsletter form chrome. Lenis already wraps the tree from providers. Do not mark `LandingPage` as a client component. Do not construct a second `Lenis()` instance. Home may read the session cookie for navbar/footer/CTAs. Do not fetch dashboard, bookings, notifications, or admin metrics from `/`.

## SEO

One `h1`. Section `h2`s in document order. Home exports `landingMetadata` (title, description, Open Graph, canonical when `NEXT_PUBLIC_SITE_URL` is set). JSON-LD `LocalBusiness` / `CleaningService` includes name, description, and site URL. Telephone, email, address, and hours are added only from `getPublishedContact()`. Do not keyword-stuff temporary copy. Do not invent NAP fields.

## What this step does not include

Live CMS queries, quote/newsletter APIs, authentication, or invented social proof. Newsletter remains disabled until the subscribe endpoint exists.
