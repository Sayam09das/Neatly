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
3. Why Neatly (production; workflow value propositions)
4. Trust indicators (production pending figures)
5. Featured work (production brand photography; CMS case studies later)
6. How it works (production)
7. Trust / proof (production)
8. Statistics (production)
9. Testimonials
10. Final CTA
11. Blog highlights
12. Newsletter (shares `ClosingBand` photograph with the footer)
13. Footer (`SiteFooter`, same photograph as Newsletter)

No extra SaaS bands (logos, pricing, team photos, 3D product shots).

## CTA hierarchy

| Rank | Label | Destination | Where it appears |
| :--- | :--- | :--- | :--- |
| Primary | Get a Quote | `/quote` | Navbar, Why Neatly |
| Primary | Request a free quote | `/quote` | Hero, final CTA |
| Secondary | Explore services | `/services` | Hero (guests and admins) |
| Contextual | How It Works | `/process` | Navbar, Why Neatly, footer Explore |
| Contextual | Reviews | `/testimonials` | Navbar, footer Explore |
| Account | Your account | `/dashboard` | Hero secondary and final CTA text link for authenticated customers |
| Contextual | View our work | unpublished | Featured work (omitted until `/portfolio` exists) |
| Contextual | Read the journal | `/blog` | Blog highlights |
| Contextual | Journal | `/blog` | Navbar, footer Explore |
| Capture | Subscribe | `POST /api/v1/customer/newsletter` | Newsletter |

Do not alternate “Get started” / “Learn more”. Home links only to routes that exist. Do not invent `/portfolio` hrefs before that page ships.

## Section briefs

### Navbar
- **Purpose:** Brand, primary navigation, quote action.
- **Content:** Replaceable wordmark + mark; Services, How It Works (`/process`), About Us, Reviews (`/testimonials`), Journal (`/blog`), Contact (`/contact`); optional published phone; “Log in”; “Get a Quote”. Portfolio stays out of the public nav until that route exists. Log in and Get a Quote stay in the utility/CTA slots, not in `landingNavLinks`. Hash links (`/#process`, `/#testimonials`) are not used for primary navigation.
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
- **Purpose:** Answer “Why should I choose Neatly?” after Services, using the real quote-to-completion workflow rather than unsupported statistics.
- **Content:** Eyebrow, editorial `h2` with an accent on the last line, supporting copy, and four numbered value propositions: clear quotes, services that fit, assigned professionals, and a simple path from request to completion. No fake ratings, guarantees, or headcount claims.
- **CTA:** Primary Get a Quote (`/quote`). Secondary How It Works (`/process`).
- **Hierarchy:** `h2`, then `h3` per feature. Icons are decorative (`aria-hidden`).
- **Responsive:** Single-column editorial stack on mobile (heading, features, CTAs). Two-column feature grid from `md`. Desktop split: heading and CTAs left, 2×2 feature grid right.
- **Media:** Typography-led. Existing Why photography remains available for About and auth surfaces; this section does not require an image.
- **Motion intent:** One GSAP ScrollTrigger story: heading → CTA → staggered features with a small icon scale/opacity reveal. Reversible on scroll up. CSS hover/focus-within for border surface, icon, and arrow. Reduced motion skips GSAP and hover transforms.
- **A11y:** Section `aria-labelledby="why-heading"`. Heading `aria-label` matches the visible sentence. Feature copy is always visible. Quote and How It Works links keep visible focus rings.

### Services
- **Purpose:** Homepage no longer includes a Choose a Service band. Service exploration is `/services`, reached from Hero Explore services, navbar Services, and footer.
- **Kept off `/`:** The five PRD category cards (residential, deep, move-in/out, commercial, recurring) and “OUR SERVICES / Choose a service” heading stay off the homepage so the catalog is not duplicated.

### Services index (`/services`)
- **Purpose:** Public directory of Admin-created catalog services. Not a second catalog.
- **Content:** Existing public navbar (Services active). Hero (Our services / Cleaning that fits your space.) with brand photography from `images/Services/`. The catalog band uses the Choose a Service presentation: eyebrow, editorial `h2`, supporting copy, and image-first cards. Grid of active services from `GET /api/v1/customer/services`. Empty, error, and loading states. The homepage Why Neatly section follows the catalog. A simpler How It Works timeline follows Why Neatly: same eyebrow, heading, intro, campaign still, and the seven real workflow steps as an ordered timeline. The homepage Final CTA card follows (`Ready when you are` / `A cleaner space starts here.`). Newsletter/footer band.
- **CTA:** Hero Explore Services (`#catalog`) and Request a Quote (`/quote`). Per-card View Service (`/services/[slug]`) and Request a Quote (`/services/[slug]/apply`). Why Neatly Get a Quote (`/quote`) and How It Works (`/process`). Step-level Explore Services (`/services`) and Request a Quote (`/quote`). Closing Get a Quote (`/quote`) and Explore Services (`/services`).
- **Hierarchy:** One `h1` in the hero, catalog `h2`, Why Neatly `h2` with feature `h3`s, process `h2` with step `h3`s, Final CTA `h2`, card titles `h3`.
- **Responsive:** Catalog is 1 column, 2 from `md`, 3 from `lg`. Process is header + still, then the timeline; two columns from `lg` (copy/image left, timeline right).
- **Media:** Hero uses existing Services photography as atmosphere, not as a fake service. Development catalog covers use dedicated stills at `images/Services/01_residential.jpeg` through `05_recurring.jpeg`. Cards use Admin-uploaded `coverImageUrl` or a muted placeholder. Process uses `images/how_it_works/03_result.jpeg`. No stock. No invented prices, durations, or categories.
- **Motion intent:** GSAP hero entrance and catalog stagger (`opacity` + 20px `translateY`). Process reuses the homepage process animation (header, still, staggered steps, progress line) without the journey panel or desktop detail card. Framer image scale `1.03` and CTA arrow shift on hover. Reduced motion skips GSAP and hover transforms.
- **A11y:** Semantic landmarks, labeled CTAs, meaningful image alt from `coverImageAlt`, the service name, or the process still alt, visible focus, `prefers-reduced-motion`. The process steps use an ordered list.

### Trust indicators
- **Purpose:** Credibility after Why Neatly, without invented scores.
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
- **Purpose:** Remove process ambiguity with the real customer workflow.
- **Content:** Eyebrow, editorial heading, supporting copy, one campaign still, and seven customer-facing steps as an ordered timeline (choose a service → request a quote → accept → book → cleaner assigned → completed → review). No journey panel, desktop detail card, or in-section CTA band. Internal database statuses are not exposed. Signed-in customers see “View your quotes” on the accept step.
- **CTA:** Step-level Explore Services (`/services`) and Request a Quote (`/quote`). Homepage Final CTA still follows later. `/process` uses the same simple section plus Final CTA.
- **Hierarchy:** `h2` on `/`, `h1` on `/process`. Ordered list with `h3` per step.
- **Responsive:** Header + still, then the timeline. Two columns from `lg` (copy/image left, timeline right). Single column on mobile. No horizontal scroll.
- **Media:** Existing campaign still `apps/web/public/images/how_it_works/03_result.jpeg`. Descriptive alt. No fake account data, prices, or cleaner names.
- **Motion intent:** GSAP ScrollTrigger story (header, still, staggered steps, progress line). Reduced motion skips motion and shows the full timeline. No pinning. No scroll hijack.
- **A11y:** `<ol>` so sequence is announced. Meaningful image alt. Decorative step icons are `aria-hidden`. Links keep visible focus rings.

### Process page (`/process`)
- **Purpose:** Dedicated destination for navbar How It Works. Does not replace the homepage section.
- **Content:** The same simple How It Works timeline as Home and `/services`, then the homepage Final CTA, then newsletter/footer. Navbar How It Works is the current page. Top band curve is omitted so the dark navbar continues into the section.
- **CTA:** Step-level Explore Services and Request a Quote. Closing Get a Quote (`/quote`) and Explore Services (`/services`). Signed-in customers still receive View your quotes on the accept step.
- **Hierarchy:** One `h1` (“Cleaning made simple.”). Process steps stay `h3`. Final CTA `h2`.
- **A11y:** Skip link, landmarks, one `h1`. Homepage `#process` ids remain for leftover in-page bookmarks.

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
- **Content:** Eyebrow, editorial `h2`, supporting copy. The homepage loads active testimonials from `GET /api/v1/customer/testimonials` (`isActive: true` only). Pending customer reviews stay off the public page. When none are published, reserved brand photographs and honest empty copy fill the space. Featured layout appears only when a real `isFeatured` review exists. Cards show rating, quote, name, optional service category, optional date, and initials—never stock portraits.
- **CTA:** Get a Quote (`/quote`) on the empty and error states. Final CTA still follows.
- **Hierarchy:** `h2`. Live reviews use `blockquote` + `cite`, not extra headings. Ratings include a screen-reader label such as “5 out of 5 stars”.
- **Responsive:** Header left / reviews right from `lg` (5/7). Single column on mobile. Two-column cards from `md`, three from `lg` when no featured review exists.
- **Media:** Reserved brand stills at `apps/web/public/images/testimonials/01_slot.jpeg`–`03_slot.jpeg` for the empty state only. Descriptive alt. Not fake customer portraits. Next/Image. No stock. No Hero frames. Published reviews use initials because the public DTO does not include avatars.
- **Motion intent:** GSAP section reveal on the heading and review surface. Motion fade-and-slide between the three reserved stills, with autoplay (~3.5s). Autoplay pauses on control hover/focus, not on the photograph. Horizontal swipe on the figure changes slides; Lenis stays the global scroller (`data-lenis-prevent` on the figure). Reduced motion swaps instantly and skips autoplay and hover lift. Published reviews use a static grid, not a second carousel.
- **A11y:** Section `aria-labelledby="testimonials-heading"`. Only the active reserved photograph keeps a meaningful alt; inactive frames are `aria-hidden`. Photograph previous/next/index have accessible names. The reserved media label is announced to screen readers. Fetch failures use a polite status region without technical error codes.
- **Error / loading:** Unavailable copy is “Customer reviews are temporarily unavailable.” The homepage and `/testimonials` fetch reviews in the page Server Component. A section skeleton is available for loading UI.

### Testimonials page (`/testimonials`)
- **Purpose:** Dedicated destination for navbar Reviews. Does not replace the homepage section.
- **Content:** The same public reviews as Home via `GET /api/v1/customer/testimonials` (`isActive: true` only, max six). Names, ratings, and quotes are never invented. Empty, error, and loading states reuse the homepage testimonials UI. Final CTA and newsletter/footer follow.
- **CTA:** Get a Quote (`/quote`) on empty and error states. Closing Get a Quote (`/quote`) and Explore Services (`/services`).
- **Hierarchy:** One `h1` (the testimonials heading). Final CTA `h2`.
- **A11y:** Skip link, landmarks, one `h1`. Loading uses `TestimonialsSkeleton`. Homepage `#testimonials` ids remain for leftover in-page bookmarks.

### Final CTA
- **Purpose:** Convert remaining visitors after Reviews.
- **Content:** Eyebrow, editorial `h2`, supporting copy. One decorative “N” mark. No fake statistics, discounts, or urgency.
- **CTA:** Primary Get a Quote (`/quote`). Secondary Explore Services (`/services`). Signed-in customers still receive the quiet account link.
- **Hierarchy:** `h2`, copy, primary button, secondary text link.
- **Responsive:** Centered editorial panel. Buttons stack on small screens; primary is full-width until `sm`.
- **Motion intent:** GSAP section reveal on eyebrow, heading, copy, and actions. CSS arrow shift on hover. Reduced motion skips GSAP and hover transforms.
- **A11y:** Heading + labeled links. Decorative “N” is `aria-hidden`. Visible focus rings. Minimum 44px touch targets.

### Blog highlights
- **Purpose:** Authority and crawlable internal links.
- **Content:** Editorial `h2` with a single accent on “journal”. Home loads published posts from `GET /api/v1/customer/blog` (`BlogStatus.PUBLISHED` only). One featured note plus three slots. Drafts and archived posts stay off the public page. Reserved stills fill empty slots. No invented articles.
- **CTA:** Read the journal (`/blog`).
- **Hierarchy:** `h2`; featured `h3`; live titles link to `/blog/[slug]`.
- **Responsive:** Featured + stack from `lg`. Thumbnails stay square; copy wraps rather than compressing.
- **Media:** Published `coverMedia` URLs when present. Otherwise reserved stills at `apps/web/public/images/journal/01_featured.jpeg` plus `02_slot`–`04_slot.jpeg`. Descriptive alt. No stock. No Hero frames.
- **Motion intent:** GSAP ScrollTrigger story (header → featured wipe → slots). Clip-path + scale image reveal; subtle featured parallax from `md`. Framer hover lift on slot rows and image scale on the featured still. GSAP draws the heading underline stroke when the path enters view. Lenis remains the global scroller (`getLenis()` / existing `SmoothScroll`). Reduced motion skips choreography. No pinning.
- **A11y:** Section `aria-labelledby="blog-heading"`. Meaningful alt. Decorative underline is `aria-hidden`. CTA is “Read the journal”, not a generic “read more”. Fetch failures use a polite status region.

### Newsletter
- **Purpose:** Optional email capture. Not a quote substitute. Subscriber emails never render on the public site.
- **Content:** Nested email field with Subscribe, consent copy, inline validation, server error, and success confirmation.
- **CTA:** Subscribe (`POST /api/v1/customer/newsletter` via the same-origin customer BFF).
- **Hierarchy:** `h2` with accent on “notes”, copy, labeled input.
- **Responsive:** Stacked field + button; nested row from `sm`.
- **Media:** One decorative still, `apps/web/public/images/newsletter/01_notes.jpeg`, on `ClosingBand` — the same photograph continues under the footer. Do not duplicate the JPEG. Overlay `bg-secondary/80` keeps type readable. `BandCurve` is top-only so the photo is not cut before the footer.
- **Motion intent:** GSAP ScrollTrigger on the form copy. Image scale settle and subtle parallax from `md` belong to `ClosingBand` so they cover newsletter + footer as one surface. Reduced motion skips choreography. No pinning. No second Lenis instance.
- **A11y:** `label htmlFor`, consent `aria-describedby`, polite success and error regions, submit disabled while posting.

### Site footer
- **Purpose:** Contact, explore, services, legal—the last utility surface after the newsletter.
- **Content:** Brand mark + promise, Explore from primary nav, Services from published landing categories, Support (Log in, Register, quote) until site settings publish real contact details. Quote text link. Social stays pending until real profile URLs exist in site settings. Privacy, terms, and cookies in the bottom bar. Public pages also show an Accept cookies banner until a choice is stored. No invented social URLs. Do not render placeholder email, phone, hours, or address as live contact. Authenticated customers see an Account column instead of Support.
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

Portfolio case studies, a public subscriber directory, or invented customer names. Development reviews stay labeled `[Development Placeholder]`. Live journal, reviews, and newsletter subscribe now load from the CMS APIs.
