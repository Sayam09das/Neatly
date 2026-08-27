# Neatly - Production Engineering & AI Coding Rulebook

---

## 1. CORE DEVELOPMENT PRINCIPLES

1. **Production First:** All code written for Neatly must be production-ready software—clean, maintainable, performant, secure, and fully typed. Never write draft, temporary, or prototype-quality code in the repository.
2. **Simplicity Over Complexity:** Implement the simplest technical solution that satisfies the product requirements in [`docs/PRD.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/PRD.md). Avoid premature abstractions or speculative features.
3. **No Unnecessary Abstractions:** Do not build abstract wrappers, factory patterns, or generic helper functions until there are at least two distinct, verified reuse cases.
4. **Strict TypeScript Typing:** Maintain 100% strict TypeScript compliance. The following patterns are strictly forbidden:
   * `any` type usage.
   * `unknown` types without explicit runtime Zod or type-guard narrowing.
   * Compiler suppression flags (`@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`) unless required by a third-party library bug, in which case an explanatory comment is mandatory.
5. **No Duplicated Business Logic:** Core business rules (quote validation, status workflows, email triggers, authorization checks) belong strictly in the Service layer (`/services/*`). Never duplicate business logic across UI components, API routes, or database calls.
6. **No Magic Values:** Hardcoded numbers, string status literals, or un-named constants are forbidden. Store configuration values and enums in centralized types or environment settings.
7. **Zero Fake Data in Production:** Never invent or hardcode fake testimonials, customer names, addresses, phone numbers, statistics, or business certifications. Development seed data must be clearly marked and isolated from production.

---

## 2. SOURCE OF TRUTH HIERARCHY

When making technical or architectural decisions, strictly adhere to the following hierarchy:

```text
PRD.md (WHAT Neatly does & business requirements)
   ↓
ARCHITECTURE.md (HOW Neatly is technically structured)
   ↓
DATABASE.md (DATA MODEL, entities, & relationships)
   ↓
AGENTS.md (ENGINEERING RULES & coding standards)
   ↓
Implementation (Code & Components)
```

* **Conflict Resolution Rule:** If an implementation request conflicts with the documentation hierarchy, STOP immediately. Highlight the conflict and seek resolution before making code changes. Never silently alter architecture or database structures to fix a local code issue.

---

## 3. CHANGE MANAGEMENT WORKFLOW

Before modifying or adding code to Neatly, execute the following 9-step workflow:

1. **Understand Requirement:** Re-read the specific requirements in [`docs/PRD.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/PRD.md).
2. **Consult Architecture & Database:** Check [`docs/ARCHITECTURE.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/ARCHITECTURE.md) and [`docs/DATABASE.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/DATABASE.md) to locate the affected module boundaries.
3. **Inspect Existing Code:** Search for pre-existing components, utilities, or services to avoid duplicate work.
4. **Scope Changes:** Identify the minimal precise set of files requiring modification.
5. **Execute Implementation:** Write minimal, correct, fully typed code matching Neatly standards.
6. **Verify Server/Client Boundaries:** Ensure React Server Components remain unpolluted by client state.
7. **Check Responsiveness:** Test UI layout across all five Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).
8. **Verify Accessibility & Motion:** Test keyboard focus, ARIA attributes, and `prefers-reduced-motion` compliance.
9. **Run Automated Checks:** Execute TypeScript compilation, linter checks, and relevant unit/E2E tests.

---

## 4. NEXT.JS RULES

1. **Server Components by Default:** Every page and component in `app/` MUST be a React Server Component (RSC) by default.
2. **Restricted Client Boundary (`"use client"`):** Add `"use client"` *only* to leaf components requiring:
   * Interactive state (`useState`, `useReducer`).
   * Browser event listeners (`onClick`, `onChange`, `onSubmit`).
   * Browser APIs (`window`, `localStorage`, DOM measurements).
   * Interactive animation hooks (`useGSAP`, `framer-motion`).
   * Form state hooks (`useForm`).
3. **No Blanket Client Parents:** Never add `"use client"` to a parent layout or container component simply because a child widget requires interactivity. Pass Server Components as `children` or import interactive leaf components into Server Components.

---

## 5. REACT COMPONENT RULES

1. **Single Responsibility:** A component must do exactly one thing. Split large components (> 150 lines) into dedicated feature sub-components.
2. **Explicit Typed Props:** Define explicit TypeScript interfaces for all component props. Avoid passing massive unconstrained data objects when a component only consumes 2-3 fields.
3. **Minimal State Scope:** Keep React state local to the component that requires it. Do not introduce global state stores (Zustand, Redux) for local UI toggles or form state.
4. **Effect Hygiene (`useEffect`):**
   * Never use `useEffect` to transform or calculate data that can be computed during render.
   * Never use `useEffect` for data fetching; use Next.js Server Components or server functions instead.
   * Every `useEffect` subscribing to event listeners or animation contexts MUST return a cleanup function.

---

## 6. TYPESCRIPT RULES

1. **Strict Mode Enabled:** Always write code under strict TypeScript flags (`noImplicitAny`, `strictNullChecks`).
2. **Explicit Public Signatures:** All public functions, service methods, API handlers, and component props must have explicit return type annotations.
3. **Type Reuse:** Import domain types directly from Prisma or generated types in `/types/`. Do not redefine duplicate type schemas manually.
4. **Discriminated Unions:** Use discriminated unions for modeling multi-state workflows (e.g., UI state machines, status payloads).
5. **No Type Silencing:** Fixing type errors by adding `@ts-ignore` or casting `as any` is strictly forbidden. Resolve underlying interface mismatches cleanly.

---

## 7. TAILWIND CSS RULES

1. **Utility-First Styling:** Use Tailwind CSS utility classes exclusively. Inline `style={...}` objects are forbidden except for dynamic calculated values (e.g., drag coordinates).
2. **Design Tokens:** Stick strictly to configured design system tokens for colors, font families, and container bounds. Arbitrary values (e.g., `h-[373px]`, `bg-[#fa3211]`) are forbidden unless explicitly required for media sizing.
3. **Clean Class Strings:** Use the `cn()` utility (`clsx` + `tailwind-merge`) when combining conditional classes. Avoid massive, unreadable 40-class inline strings by breaking complex component states cleanly.
4. **No Custom CSS Overrides:** Do not write custom CSS rules in global stylesheets when standard Tailwind utilities exist.

---

## 8. SHADCN/UI RULES

1. **Approved Component Primitives:** Use shadcn/ui primitives (`Button`, `Dialog`, `Sheet`, `Input`, `Select`, `Textarea`, `DropdownMenu`, `Tabs`, `Table`, `Toast`, `Alert`, `Form`) to ensure accessibility.
2. **Customized Brand Aesthetic:** Customize shadcn component variants in `components/ui/` to match Neatly's calm, clean, minimal aesthetic.
3. **No Uncustomized Generic Dashboards:** Never leave default shadcn styling intact if it makes the interface look like a generic administrative template.
4. **Selective Adoption:** Do not import or install shadcn components that are not actively required by the product requirements.

---

## 9. DESIGN SYSTEM & VISUAL IDENTITY RULES

Neatly's brand identity is **Clean, Minimal, High-Trust**.

### Visual Rules
* **Whitespace & Breathability:** Use generous padding and margins (`py-12`, `py-20`, `gap-8`) to prevent visual crowding.
* **Calm Typography:** Clean sans-serif hierarchy with crisp contrast ratios exceeding 4.5:1.
* **Strict Anti-Patterns (Forbidden):**
  * ❌ No neon or bright gradients.
  * ❌ No dark-mode purple grid aesthetics.
  * ❌ No heavy glassmorphism with low contrast text.
  * ❌ No excessive rounded cards (`rounded-3xl` on tiny elements).
  * ❌ No constant spinning background objects or floating 3D icons.
  * ❌ No decorative fluff without informational purpose.

---

## 10. RESPONSIVE DESIGN RULES

Neatly MUST render flawlessly across all five Tailwind breakpoints:

```text
sm: 640px  (Mobile Portrait)
md: 768px  (Tablet & Mobile Landscape)
lg: 1024px (Laptop & Desktop Navigation)
xl: 1280px (Standard Desktop Container Cap)
2xl: 1536px (Large Display Padding)
```

1. **Mobile-First Layouts:** Write default utility classes for mobile viewports, layering `md:`, `lg:`, and `xl:` utilities progressively.
2. **Zero Horizontal Overflow:** Ensure no component causes horizontal scrollbar leaks on 320px viewports (`overflow-x-hidden` on main wrapper).
3. **Touch Targets:** Buttons and input targets on viewports under 768px MUST maintain a minimum touch area of 44x44 pixels.
4. **Admin Usability on Mobile:** Admin tables must wrap horizontally or convert gracefully into stacked card views on tablet and mobile viewports.

---

## 11. ACCESSIBILITY RULES (WCAG 2.1 AA)

1. **Semantic HTML Elements:** Use `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<button>`, and `<a>` elements strictly according to their semantic purpose.
2. **Accessible Labels:** Every form input MUST be linked to a `<label htmlFor="...">` or carry an explicit `aria-label`.
3. **Keyboard Focus & Traps:** All interactive elements must show a high-contrast focus outline on `Tab` navigation (`focus-visible:ring-2`). Modal dialogs and drawers MUST trap focus while open.
4. **Screen-Reader Live Regions:** Form submission alerts and inline validation errors must use `aria-live="polite"` regions.
5. **Reduced Motion Support:** All CSS transitions and JS animations MUST respect `prefers-reduced-motion` settings.

---

## 12. FORM RULES

All public and administrative forms MUST use **React Hook Form** + **Zod**:

```text
User Input -> Client Zod Check -> Form Submit -> Server Zod Re-validation -> Service -> DB
```

1. **Mandatory 5 UI States:** Every form component MUST render distinct UI for:
   * `Idle`: Initial clean state.
   * `Loading / Submitting`: Inputs disabled, submit button displaying spinner.
   * `Validation Error`: Inline field error text.
   * `Server Error`: Clear top-level alert banner with retry action.
   * `Success`: Clear confirmation state / success screen.
2. **Prevent Double Submission:** Disable submit buttons immediately upon form trigger to prevent duplicate network requests.

---

## 13. API & ROUTE HANDLER RULES

1. **Thin Handlers:** Route Handlers (`app/api/*/route.ts`) must act strictly as HTTP controllers. Handlers extract request payloads, invoke Zod validation, call Service methods, and return JSON responses.
2. **Standardized JSON Payload:** All API endpoints MUST return responses formatted per [`docs/ARCHITECTURE.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/ARCHITECTURE.md):
   ```json
   {
     "success": true,
     "data": { ... },
     "error": null,
     "timestamp": "2026-08-25T20:16:18.000Z"
   }
   ```
3. **No Unsanitized Inputs:** Never process raw unvalidated `req.json()` payloads without passing them through Zod schema validation first.

---

## 14. DATABASE & PRISMA RULES

1. **Server-Side Only:** Prisma Client (`lib/db.ts`) MUST NEVER be imported into or called from Client Components.
2. **No Secret Exposure:** Database connection URLs MUST reside strictly in server environment variables (`DATABASE_URL`).
3. **Query Efficiency:** Avoid N+1 query patterns by utilizing Prisma `include` and `select` clauses.
4. **Explicit Field Selection:** Select only required columns in public queries to prevent accidental leakage of PII or internal metadata.
5. **Transaction Integrity:** Multi-table writes (e.g., updating a portfolio project and re-ordering images) MUST be executed within a `prisma.$transaction()`.
6. **No Manual Production Mutations:** Schema changes MUST be executed through Prisma migrations (`prisma migrate`). Direct production DB editing is strictly forbidden.

---

## 15. SERVICE LAYER RULES

1. **Location:** All core business logic resides in `/services/*` (e.g., `quote.service.ts`, `service.service.ts`, `blog.service.ts`).
2. **Single Source of Truth:** Business rules (e.g., quote status transitions, email notification dispatches, cache invalidations) MUST exist exclusively in Service methods.
3. **Decoupled Architecture:** Services accept sanitized TypeScript types, interact with Prisma ORM, invoke infrastructure adapters (Email, Storage), and return clean result objects.

---

## 16. AUTHENTICATION RULES

1. **Password Security:** Passwords MUST be hashed using `bcrypt` (cost factor: 12). Plaintext password storage is strictly forbidden.
2. **Session Security:** Admin session tokens MUST be stored in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
3. **Rate Limiting:** Protect sign-in endpoints against brute-force attacks (max 5 failed attempts per IP per 15 mins).
4. **No Hardcoded Admin Credentials:** Admin credentials MUST be seeded via secure environment variables or managed securely via the DB.

---

## 17. AUTHORIZATION RULES

1. **Server-Side Enforcement:** Every admin mutation endpoint (`/api/admin/*`) and protected Server Component route MUST verify active admin authorization server-side via session cookies.
2. **No Hidden-UI Security:** Hiding an element in the UI (e.g., masking a "Delete" button) is a UX feature, NOT a security boundary. Always validate permissions on the server.

---

## 18. SECURITY & DATA PROTECTION RULES

1. **Input Sanitization:** Sanitize and escape all user-generated content (notes, messages, blog content) to prevent SQL Injection and XSS.
2. **Security Headers:** Enforce mandatory HTTP security headers (`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).
3. **No Secret Leakage in Client Bundles:** Never prefix private API keys, connection strings, or auth secrets with `NEXT_PUBLIC_`.
4. **Safe Error Masking:** Production API errors returned to client browsers MUST yield generic user-friendly messages. Detailed stack traces must be written exclusively to server logs.

---

## 19. FILE UPLOAD RULES

1. **Validation Boundary:** All uploaded files (portfolio before/afters, blog covers) MUST validate MIME types (`image/jpeg`, `image/png`, `image/webp` only) and enforce size limits (max 5MB) on the server side.
2. **Storage Separation:** Binary image files MUST be stored in external cloud object storage (Cloudinary / S3 / UploadThing). Only asset metadata (`storageKey`, `url`, `altText`, dimensions) is saved in PostgreSQL (`MediaAsset`).
3. **Orphan Prevention:** Deleting a database portfolio or blog record must clean up associated image metadata safely without deleting shared media assets directly in use elsewhere.

---

## 20. EMAIL SYSTEM RULES

1. **Provider Abstraction:** Email operations MUST execute through `EmailService` using a provider-agnostic adapter (`EmailProvider`).
2. **Non-Blocking Execution:** Email dispatch failures MUST be caught and logged gracefully without aborting primary database record creation.
3. **Responsive HTML Templates:** Transactional emails (Quote received alerts, customer confirmations) MUST render clean, responsive, accessible HTML with plain-text fallback options.

---

## 21. ANIMATION STACK RULES

Neatly utilizes four specific animation technologies based on explicit responsibility boundaries:

```text
Lenis                  -> Global smooth scrolling normalization.
GSAP + ScrollTrigger   -> Complex scroll-driven reveals & hero timelines.
Motion (Framer)        -> UI state transitions (accordions, modal dialogs, drawers).
CSS Transitions        -> Simple hover states, color changes, focus rings.
```

* **Tool Selection Rule:** NEVER use GSAP for a simple hover effect. NEVER use CSS transitions for complex scroll-driven timeline reveals.
* **Scoped exception:** The landing Featured Work gallery may use Swiper.js for the centered horizontal track, including autoplay. Lenis stays vertical. Do not add another carousel library.

---

## 22. ANIMATION PERFORMANCE & CLEANUP RULES

1. **GPU Acceleration:** Animate CSS properties `transform` and `opacity` exclusively. Avoid animating layout properties (`height`, `width`, `margin`) to prevent layout thrashing.
2. **GSAP Context Cleanup:** Every GSAP animation created inside a Client Component MUST use `useGSAP()` or clean up ScrollTrigger instances on unmount:
   ```tsx
   useEffect(() => {
     const ctx = gsap.context(() => { ... });
     return () => ctx.revert(); // Mandatory cleanup
   }, []);
   ```
3. **Non-Blocking Rule:** Animations must NEVER block user click events, text readability, or form submission inputs.

---

## 23. ANIMATION ARCHITECTURE RULES

1. **Isolation:** Keep animation logic decoupled from business logic services.
2. **Graceful Fallbacks:** Ensure all page content, forms, and navigation remain 100% accessible and functional even if client-side animation scripts fail to execute or are disabled via `prefers-reduced-motion`.

---

## 24. IMAGE OPTIMIZATION RULES

1. **Next.js `<Image>` Component:** Always use `next/image` for image rendering. Raw HTML `<img>` tags are forbidden unless rendering SVG icons.
2. **Layout Shift Prevention:** Specify explicit `width` and `height` properties or `fill` with reserved parent container bounds to eliminate Cumulative Layout Shift (CLS).
3. **Lazy Loading:** Set `priority` strictly on above-the-fold Hero media. All below-the-fold imagery MUST load lazily (`loading="lazy"`).
4. **Mandatory Alt Text:** All non-decorative images MUST include descriptive, accessibility-tested `alt` attributes.

---

## 25. SEO & METADATA RULES

1. **Dynamic Metadata:** Export `generateMetadata()` functions on dynamic routes (`/services/[slug]`, `/blog/[slug]`) to render unique meta titles, descriptions, and OpenGraph tags.
2. **Structured Data:** Ingest JSON-LD schema components (`LocalBusiness`, `Service`, `BlogPosting`) on corresponding marketing pages.
3. **Semantic Hierarchy:** Enforce exactly one `<h1>` per page, followed sequentially by `<h2>` and `<h3>` headings.

---

## 26. CONTENT GOVERNANCE RULES

1. **Data-Driven CMS Content:** Services, portfolio projects, blog posts, and customer reviews MUST be fetched dynamically from the database/CMS.
2. **Zero Fabricated Content:** Never invent fake reviews, fake statistics, fake employee credentials, or fake company guarantees.
3. **Development Placeholders:** Use clearly marked placeholder text (e.g., `[Development Placeholder: Insert Real Business Phone]`) when actual business data is pending.

---

## 27. ERROR, LOADING, & EMPTY STATE UX RULES

Every async page, table, or form MUST implement four distinct visual states:

```text
Loading -> Render skeleton shimmer placeholder (no layout shift).
Empty   -> Render helpful empty state message with action button.
Success -> Render clear data/confirmation state.
Error   -> Render friendly error message with explicit retry trigger.
```

---

## 28. DATA FETCHING RULES

1. **Server Components First:** Fetch data directly in Server Components using Service calls.
2. **No Duplicate API Calls:** Avoid client-side `useEffect` data fetching loops when data can be rendered on the server.
3. **Direct Service Invocations:** Server Components must call Service functions directly rather than issuing `fetch()` requests back to their own local API routes.

---

## 29. CACHING & REVALIDATION RULES

1. **Public Marketing Pages:** Utilize Next.js Data Caching with tag-based revalidation (`revalidateTag('services')`, `revalidateTag('blog')`).
2. **Private Administrative Data:** Quotes, contact inbox items, and admin dashboard metrics MUST NEVER be cached (`cache: 'no-store'`).
3. **On-Demand Cache Invalidation:** Admin CMS mutations MUST trigger explicit cache tag revalidation to update public pages instantly.

---

## 30. COMPONENT FOLDER STRUCTURE RULES

Structure components strictly by feature domain in `components/`:

```text
components/
├── ui/         # Atomic shadcn/ui primitives (button, input, dialog)
├── public/     # Public Marketing components (Navbar, Footer, Hero)
├── admin/      # Admin Portal components (Sidebar, MetricCards, Tables)
├── forms/      # Reusable form components (QuoteForm, ContactForm)
├── blog/       # Blog domain components (PostCard, CategoryFilter)
└── portfolio/  # Portfolio domain components (BeforeAfterSlider)
```

* **Anti-Pattern Rule:** Avoid creating excessive tiny wrapper files (`GenericBox.tsx`, `TinyWrapper.tsx`) without real reuse justification.

---

## 31. ADMIN UI DESIGN RULES

1. **Clarity & Efficiency First:** Admin interfaces must prioritize data clarity, high contrast, fast loading, and task efficiency over visual decoration.
2. **Table Design:** Use clean, structured tables with clear column headers, status badges, pagination controls, and action triggers.
3. **Destructive Action Safety:** Deleting any item (service, post, portfolio project) MUST require an explicit client-side modal confirmation step.

---

## 32. RESPONSIVE ADMIN RULES

1. **Tablet & Mobile Accessibility:** Crucial admin views (viewing quote details, updating quote statuses, reading contact messages) MUST remain fully usable on tablet and mobile viewports.
2. **Horizontal Table Handling:** Tables on small viewports must enable horizontal touch scrolling (`overflow-x-auto`) or convert into stacked mobile card widgets.

---

## 33. PERFORMANCE TARGETS & RULES

1. **Core Web Vitals Enforcement:**
   * **LCP (Largest Contentful Paint):** < 1.8 seconds.
   * **INP (Interaction to Next Paint):** < 100 milliseconds.
   * **CLS (Cumulative Layout Shift):** < 0.05.
2. **Bundle Discipline:** Monitor client JavaScript bundle size. Avoid importing heavy utility packages when native JS or lightweight alternatives exist.

---

## 34. DEPENDENCY MANAGEMENT RULES

Before adding a new NPM dependency:
1. Verify Next.js or React does not already provide the capability natively.
2. Verify a small custom TypeScript utility function cannot solve the issue.
3. Verify the dependency supports strict TypeScript and tree-shaking.
4. Verify the package is actively maintained and free of security vulnerabilities.

---

## 35. ENVIRONMENT VARIABLE SECURITY RULES

1. **No Committed Secrets:** `.env`, `.env.local`, and production secret keys MUST NEVER be committed to Git repositories.
2. **Client Scope Restriction:** Prefix environment variables with `NEXT_PUBLIC_` *only* when the data is explicitly safe for public browser exposure.
3. **Server Secrets Isolation:** `DATABASE_URL`, `SESSION_SECRET`, `EMAIL_API_KEY`, and `STORAGE_API_KEY` MUST NEVER carry `NEXT_PUBLIC_` prefixes.

---

## 36. LOGGING & OBSERVABILITY RULES

1. **Structured Server Logs:** Format server error logs as structured JSON containing timestamps, route paths, error codes, and sanitized context.
2. **PII Masking:** Application logs MUST NEVER print passwords, session cookies, credit card details, or unanonymized customer addresses.

---

## 37. TESTING MANDATES

Before declaring any feature complete, verify test coverage:
* **Unit Tests:** Validate Zod schemas, utility functions, and Service business logic rules.
* **Integration Tests:** Validate API Route Handlers, database operations, and session middleware.
* **E2E Scenarios:** Validate critical user paths (Visitor Quote Submission, Admin Login & Status Update, Admin CMS Publishing).

---

## 38. GIT & COMMIT CONVENTIONS

Use standard Conventional Commit prefixes:

```text
feat: add interactive quote form calculation
fix: resolve mobile navigation backdrop blur bug
docs: update architecture specification
refactor: extract quote service methods
test: add e2e test for admin login flow
```

---

## 39. CODE REVIEW & COMPLETION CHECKLIST

Before declaring any feature task complete, verify:

- [ ] **TypeScript:** Compiles cleanly with zero errors or `any` types.
- [ ] **Linter:** Passes `eslint` checks with zero warnings.
- [ ] **RSC Boundary:** Server Components used by default; `"use client"` minimized.
- [ ] **Validation:** Zod schemas applied on both client form and server API route.
- [ ] **Auth & Security:** Protected routes verify session cookies; no secrets exposed.
- [ ] **Error Handling:** 5 UI states implemented; generic user error messages rendered.
- [ ] **Responsiveness:** Layout verified across `sm`, `md`, `lg`, `xl`, `2xl` viewports.
- [ ] **Accessibility:** Keyboard focus visual; screen-reader labels intact; reduced motion supported.
- [ ] **Animations:** GSAP/Lenis/Motion contexts cleaned up on unmount; non-blocking.
- [ ] **Performance:** Zero layout shift; Next.js `<Image>` utilized; cache tags revalidated.

---

## 40. AI CODING AGENT & CURSOR WORKFLOW RULES

When an AI coding agent processes tasks in the Neatly repository:

### Phase 1: Pre-Coding Requirements
1. Re-read [`docs/PRD.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/PRD.md), [`docs/ARCHITECTURE.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/ARCHITECTURE.md), [`docs/DATABASE.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/DATABASE.md), and `AGENTS.md`.
2. Inspect existing components, schemas, and service files to prevent duplicate implementations.
3. Verify that proposed changes do not violate existing architectural layer boundaries.

### Phase 2: Implementation Execution
1. Make targeted, minimal, precise modifications.
2. Follow established TypeScript, Tailwind, React Server Component, and Zod patterns strictly.
3. Do not perform unrelated refactoring or rewrite un-requested modules.

### Phase 3: Post-Coding Verification
1. Verify changed files compile cleanly without TypeScript or linter errors.
2. Verify responsive layout, accessibility, and error handling.
3. Report modified files and concise implementation notes clearly.

---

## 41. AI AGENT STOP CONDITIONS

The AI agent MUST STOP immediately and request user clarification if:
* The user request directly contradicts statements in [`docs/PRD.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/PRD.md) or [`docs/ARCHITECTURE.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/ARCHITECTURE.md).
* The task requires adding non-MVP features (e.g., customer mobile app, payments, workforce scheduling).
* The task requires modifying database migration files or destructive database operations.
* Third-party package installations are requested that contradict established technical choices.

---

## 42. NO OVERENGINEERING RULE

Do not introduce microservices, Redis queues, GraphQL layers, WebSockets, Elasticsearch, or complex state engines into the MVP. Stick strictly to:

```text
Next.js App Router + PostgreSQL + Prisma ORM + Tailwind CSS + Zod
```

---

## 43. NO PREMATURE OPTIMIZATION RULE

Focus execution strictly in order:

```text
1. Correctness (Meets PRD specs)
   ↓
2. Maintainability (Clean typing & clean architecture)
   ↓
3. Security & Accessibility (WCAG 2.1 AA & Data protection)
   ↓
4. Performance (Core Web Vitals targets)
```

---

## 44. FEATURE COMPLETION DEFINITION

A feature is NOT complete merely because it renders on screen. A feature is complete ONLY when:
1. Core functionality meets PRD acceptance criteria.
2. Client and server validation pass cleanly.
3. Error, loading, and empty states render properly.
4. Mobile, tablet, and desktop layouts operate seamlessly.
5. Keyboard accessibility and screen reader support pass verification.
6. Server/client boundaries adhere strictly to architecture guidelines.

---

## 45. FINAL ENGINEERING PRINCIPLES

1. **Build the explicit requirement, not assumptions.**
2. **Keep the architecture clean, simple, and server-first.**
3. **Validate every input boundary with Zod.**
4. **Never trust client-side security checks.**
5. **Protect customer personal data at all times.**
6. **Never fabricate business data or customer reviews.**
7. **Accessibility is mandatory, never optional.**
8. **Performance directly drives conversions.**
9. **Animations must remain calm, subtle, fast, and purposeful.**
10. **When uncertain, inspect the documentation and existing code before proceeding.**
