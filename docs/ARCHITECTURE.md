# Neatly - Production Architecture Specification

---

## 1. ARCHITECTURE DOCUMENT HEADER

* **Project:** Neatly
* **Architecture Version:** 1.0
* **Status:** Architecture Definition
* **Source of Truth:** [`docs/PRD.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/PRD.md)
* **Document Purpose:** This document defines the technical architecture, application design, system boundaries, data flow, engineering standards, and infrastructure blueprints for Neatly.
* **Scope:** Full-stack system architecture covering public marketing experiences, lead capture mechanisms, CMS pipelines, admin workflows, security boundaries, and operational deployment.

> **Architectural Premise:** *The Product Requirements Document ([`docs/PRD.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/PRD.md)) defines WHAT Neatly must accomplish. This Architecture Specification defines HOW Neatly is technically structured, engineered, and operated to achieve those requirements.*

---

## 2. ARCHITECTURE PRINCIPLES

Neatly’s engineering architecture is guided by fifteen core technical principles:

1. **Simplicity Over Unnecessary Complexity:** Build the simplest architecture that meets all product requirements. Avoid premature microservices, over-engineered state management, or unused infrastructure.
2. **Production Readiness:** Every module, endpoint, and component must be engineered to production standards with validation, error handling, logging, and performance controls.
3. **Strong Typing Across Layers:** Enforce end-to-end TypeScript types from the database layer (Prisma), through the service layer, to the UI component props and API responses.
4. **Secure by Default:** Implement defense-in-depth across authentication, authorization, rate limiting, input sanitization, CSRF, and secret isolation.
5. **Server-First Execution:** Default to Next.js React Server Components (RSC) and server-side data fetching to minimize client JavaScript bundle size and optimize initial render performance.
6. **Clear Separation of Concerns:** Maintain clean boundaries between presentation components, business service logic, validation schemas, and database queries. UI components must never execute raw database operations.
7. **Reusable UI Primitives:** Build UI elements around modular, accessible atomic primitives (shadcn/ui + Tailwind CSS) rather than ad-hoc styled components.
8. **Validated Boundaries:** All data entering the system via public APIs, admin forms, URL parameters, or environment configurations must pass strict runtime validation (Zod).
9. **Accessible UI Infrastructure:** Ensure components strictly comply with WCAG 2.1 Level AA standards via semantic HTML, keyboard focus management, and screen-reader ARIA primitives.
10. **Performance-First Design:** Optimize for Core Web Vitals by default through image compression, font optimization, route-level caching, and minimal client-side hydration.
11. **Progressive Enhancement:** Ensure core marketing content and critical text information remain accessible even if client-side JavaScript or animation engines encounter execution delays.
12. **Maintainability & Modularity:** Group code logically by feature domain rather than artificial technical splitters, allowing independent maintenance of business modules.
13. **Observability:** Instrument clear application logging, runtime error capturing, and database performance monitoring.
14. **Minimal Client JavaScript:** Restrict `"use client"` directives strictly to interactive elements (forms, dialogs, sliders, mobile menus).
15. **Animation With Purpose:** Restrain animations (GSAP, Lenis, Motion) to functional transitions, scroll cues, and polish without compromising performance or blocking user interaction.

---

## 3. TECHNOLOGY STACK

The technology stack is selected to provide maximum performance, rapid developer velocity, type safety, and operational simplicity:

### 3.1 Frontend Framework & Core Libraries
* **Framework:** Next.js (App Router architecture)
* **UI Library:** React (Server Components + Client Components)
* **Language:** TypeScript (Strict mode enabled)
* **Styling:** Tailwind CSS (Utility-first CSS framework)
* **Component Primitives:** shadcn/ui (Accessible, unstyled UI primitives built on Radix UI)
* **Icons:** Lucide React (Clean, minimal stroke icon set)

### 3.2 Animation & Micro-Interactions
* **Smooth Scrolling:** Lenis (Lightweight smooth scroll normalization)
* **Scroll Animations:** GSAP + ScrollTrigger (High-performance timeline and scroll-driven reveals)
* **UI State Animations:** Motion (Framer Motion derivative for layout transitions, modals, and accordions)
* **CSS Transitions:** Native CSS transitions for simple hover and focus states.

### 3.3 Form Management & Validation
* **Form State:** React Hook Form (Uncontrolled form management for optimal re-render performance)
* **Schema Validation:** Zod (TypeScript-first schema validation at form and server boundaries)

### 3.4 Backend & Application Layer
* **Architecture:** Next.js Full-Stack App Router
* **Server Handlers:** Next.js Route Handlers (`route.ts`) for REST endpoints + Server Actions where appropriate for direct form mutations.
* **Business Logic Layer:** Dedicated TypeScript Service classes (`/services/*`) encapsulating core domain logic.

### 3.5 Database & ORM
* **Database Engine:** PostgreSQL (Production relational database)
* **Object-Relational Mapping (ORM):** Prisma ORM (Type-safe query builder, schema modeling, and automated database migrations)

### 3.6 Authentication & Session Security
* **Selected Approach:** Custom Secure Cookie-Based Session Authentication.
* **Rationale:** Neatly MVP requires authentication *exclusively* for internal business administrators (`/admin/*`). Implementing heavy third-party OAuth providers or complex identity frameworks introduces unnecessary external dependencies and maintenance overhead. A lightweight, robust custom session engine using `bcrypt` password hashing, crypto-random session tokens, and `HttpOnly`/`Secure`/`SameSite=Strict` cookies provides complete control, instant performance, and zero third-party lock-in.

### 3.7 Transactional Email Integration
* **Abstraction:** `EmailProvider` interface allowing seamless provider swapping.
* **Default Adapter:** Nodemailer over Brevo SMTP (`smtp-relay.brevo.com:587`, STARTTLS). Production requires `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`, and `SMTP_FROM_NAME`. Transactional mail does not call `api.brevo.com`. If SMTP is incomplete, send operations fail instead of reporting a console success.

### 3.8 File & Media Storage
* **Abstraction:** `StorageProvider` interface. Service thumbnails use Supabase Storage (`SUPABASE_SERVICES_THUMB_BUCKET`, default `Services_Thumb`) through the API-side `MediaService`. Only `MediaAsset` metadata is stored in PostgreSQL.

### 3.9 Deployment & Infrastructure
* **Next.js Host:** Vercel (or equivalent Node.js server container environment)
* **Managed Database:** Supabase / Neon / Render Managed PostgreSQL
* **Managed Storage:** Cloudinary / S3 / UploadThing
* **Domain & DNS:** Vercel DNS / Cloudflare with mandatory SSL/TLS encryption.

---

## 4. HIGH-LEVEL SYSTEM ARCHITECTURE

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT / BROWSER                                  │
└─────────────────────────────────────────┬────────────────────────────────────────┘
                                          │
                                          │  HTTPS Requests (HTML / JSON)
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS APP ROUTER (MODULAR MONOLITH)                     │
│                                                                                  │
│   ┌──────────────────────────────────┐        ┌──────────────────────────────┐   │
│   │     PUBLIC MARKETING WEBSITE     │        │       ADMIN DASHBOARD        │   │
│   │  (Server Components + Client UI) │        │   (Protected Admin Routes)   │   │
│   └─────────────────┬────────────────┘        └──────────────┬───────────────┘   │
│                     │                                        │                   │
│                     └───────────────────┬────────────────────┘                   │
│                                         │                                        │
│                                         ▼                                        │
│   ┌──────────────────────────────────────────────────────────────────────────┐   │
│   │                         ROUTE HANDLERS & ACTIONS                         │   │
│   └─────────────────────────────────────┬────────────────────────────────────┘   │
│                                         │                                        │
│                                         ▼                                        │
│   ┌──────────────────────────────────────────────────────────────────────────┐   │
│   │                         ZOD VALIDATION MIDDLEWARE                        │   │
│   └─────────────────────────────────────┬────────────────────────────────────┘   │
│                                         │                                        │
│                                         ▼                                        │
│   ┌──────────────────────────────────────────────────────────────────────────┐   │
│   │                         APPLICATION SERVICE LAYER                        │   │
│   │  (QuoteService, ContactService, ServiceService, BlogService, AuthService)│   │
│   └──────────────┬──────────────────────┬──────────────────────┬─────────────┘   │
│                  │                      │                      │                 │
└──────────────────┼──────────────────────┼──────────────────────┼─────────────────┘
                   │                      │                      │
                   ▼                      ▼                      ▼
        ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
        │  DATA ACCESS LAYER│    │  EMAIL PROVIDER  │   │ STORAGE PROVIDER │
        │   (Prisma ORM)   │    │ (Brevo SMTP)     │   │ (Cloudinary/S3)  │
        └──────────┬───────┘    └──────────────────┘   └──────────────────┘
                   │
                   ▼
        ┌──────────────────┐
        │    POSTGRESQL    │
        │     DATABASE     │
        └──────────────────┘
```

---

## 5. ARCHITECTURAL STYLE: MODULAR MONOLITH

Neatly is engineered as a **Modular Monolith**.

### 5.1 Why a Modular Monolith Fits Neatly
* **Single Deployment Unit:** The entire application (public site, admin dashboard, background service routines, API handlers) compiles and deploys as a single Next.js project.
* **Domain Isolation:** Code is structured strictly into isolated domain modules (`/features/quotes`, `/features/services`, `/features/blog`, `/features/auth`). Modules communicate through explicit TypeScript service interfaces rather than raw cross-module database imports.
* **Low Operational Overhead:** Eliminates network latency between separate frontend/backend deployments, complex API versioning, CORS configuration issues, and container orchestration overhead (Kubernetes / Docker Compose).
* **Future Scalability:** If a specific sub-system (e.g., notification engine or analytics worker) requires independent scaling in Phase 2 or 3, the clean domain module boundaries allow it to be extracted into a standalone service with minimal refactoring.

---

## 6. APPLICATION LAYERS & RESPONSIBILITIES

```text
Presentation Layer (UI Pages, Components, React Hook Form)
        ↓
Validation Layer (Zod Schemas & Boundary Checkers)
        ↓
Application / Service Layer (Business Logic & Workflow Rules)
        ↓
Data Access Layer (Prisma ORM Queries & Mutations)
        ↓
PostgreSQL Database
```

### 6.1 Presentation Layer
* **Responsibility:** Rendering user interfaces, managing component display state, handling user interactions, capturing form inputs.
* **Rules:** Must NEVER execute SQL, invoke Prisma queries directly, or write business logic rules. Must interact with backend systems exclusively through Server Component service calls or Route Handlers.

### 6.2 Validation Layer
* **Responsibility:** Verifying all incoming data schemas, type constraints, string lengths, MIME types, and payload boundaries before data reaches business logic.
* **Rules:** Must use Zod schemas. Invalid payloads are rejected immediately at the boundary with standardized HTTP 400 validation error payloads.

### 6.3 Application / Service Layer
* **Responsibility:** Orchestrating core business logic, status transitions, email triggers, cache invalidation, and data transformations.
* **Rules:** Houses all domain rules (e.g., verifying quote request date constraints, triggering email alerts upon lead creation, revalidating public cache tags after CMS updates).

### 6.4 Data Access Layer
* **Responsibility:** Interacting directly with PostgreSQL via Prisma ORM for CRUD operations, transactions, and index query optimization.
* **Rules:** Fully encapsulated within service methods. No raw ORM queries leakage into UI controllers.

---

## 7. FRONTEND ARCHITECTURE

Neatly's frontend relies on Next.js Server Components (RSC) by default to deliver maximum performance.

```text
Next.js Page (Server Component - Fetches Data directly via Service Layer)
  ├── Static Layout Elements (Server Component - Zero JS)
  ├── Content Sections (Server Component - HTML rendered at build/request time)
  └── Interactive Widgets (Client Component ["use client"] - Minimal Hydration)
        ├── Interactive Quote Form (React Hook Form + Zod)
        ├── Before/After Image Slider (Touch & Pointer events)
        └── Mobile Navigation Drawer (Stateful toggle)
```

### 7.1 Server Components vs. Client Components Guidelines
* **Use Server Components (`default`):**
  * Marketing copy, static text, layout grids, headers, footers.
  * Public blog article views, service index pages, testimonial displays.
  * Direct data fetching from database/service layer.
  * SEO metadata generation.
* **Use Client Components (`"use client"`):**
  * Interactive forms (Quote Form, Contact Form, Newsletter Input).
  * Stateful UI widgets (Before/After image slider, Mobile menu drawer, Modal dialogs).
  * Animations requiring client DOM hooks (GSAP ScrollTrigger, Lenis smooth scroll setup).
  * Admin dashboard interactive tables, action dropdowns, and rich-text editor interfaces.

---

## 8. PUBLIC WEBSITE ARCHITECTURE

The public website architecture prioritizes fast initial render, SEO indexing, and seamless conversion flows:

| Route Path | Render Strategy | Data Sources | Cache Strategy |
| :--- | :--- | :--- | :--- |
| `/` (Home) | ISR / Dynamic RSC | Services, Portfolio, Testimonials, Blog, Settings | Tag-based Revalidation (`revalidateTag('homepage')`) |
| `/about` | Static / RSC | Site Settings, Brand Values | Static Build Time |
| `/services` | ISR / Dynamic RSC | Active Services Catalog | Tag-based Revalidation (`revalidateTag('services')`) |
| `/services/[slug]` | ISR / Dynamic RSC | Service Detail Record + FAQs | Tag-based Revalidation (`revalidateTag('service-[slug]')`) |
| `/portfolio` | ISR / Dynamic RSC | Active Portfolio Items | Tag-based Revalidation (`revalidateTag('portfolio')`) |
| `/blog` | ISR / Dynamic RSC | Published Blog Posts | Tag-based Revalidation (`revalidateTag('blog')`) |
| `/blog/[slug]` | ISR / Dynamic RSC | Single Published Post | Tag-based Revalidation (`revalidateTag('post-[slug]')`) |
| `/contact` | Static / RSC | Site Settings | Static + Client Form Handler |
| `/process` | Static / RSC | Site Settings | Static Build Time |
| `/testimonials` | Dynamic RSC | Active Testimonials | `cache: 'no-store'` |
| `/quote` | Static / RSC | Services List (for dropdown) | Static + Interactive Client Form |
| `/privacy`, `/terms`, `/cookies`| Static | Legal Copy | Static Build Time |

---

## 9. ADMIN DASHBOARD ARCHITECTURE

The Admin application is completely isolated from public views under the `/admin` path:

```text
Admin Route Hierarchy (Protected via Middleware)
├── /admin/login            -> Unprotected Sign-in Form
├── /admin/forgot-password  -> Unprotected Reset Link Request
└── /admin/ (Protected Layout with Admin Sidebar & Topbar)
    ├── /admin              -> Redirects to /admin/dashboard
    ├── /admin/dashboard    -> Dashboard Overview Widgets & Metrics
    ├── /admin/quotes       -> Pipeline Table (Filter by status, view, update status, notes)
    ├── /admin/contacts     -> Message Inbox Table (View message, toggle read/archive)
    ├── /admin/customers    -> Customer list (create, edit, activate/deactivate)
    ├── /admin/cleaners     -> Cleaner invitation and account management
    ├── /admin/services     -> Services Manager (List, create, edit modal, delete)
    ├── /admin/portfolio    -> Portfolio Manager (List, upload images, before/after config)
    ├── /admin/testimonials -> Reviews Manager (List, approve, feature toggle, create)
    ├── /admin/blog         -> Article CMS (List, rich text editor page, publish toggle)
    ├── /admin/newsletter   -> Subscriber Table (List, search, export CSV)
    └── /admin/settings     -> Global Configuration Form (Phone, email, hours, address)
```

### 9.1 Admin Protection Boundary
* **Middleware Control (`middleware.ts`):** Intercepts all incoming requests matching `/admin/*` (excluding `/admin/login` and `/admin/forgot-password`). Validates session token from `HttpOnly` cookie. Redirects invalid or expired session requests directly to `/admin/login`.
* **Destructive Action Safeguards:** Deletion operations (e.g., deleting a service, blog post, or portfolio item) MUST require a client-side confirmation dialog and execute via authenticated POST/DELETE Route Handlers with CSRF verification.

### 9.2 Customer application architecture

The customer account area lives under `/dashboard` in `apps/web`. It reuses the existing session cookie (`neatly_session`), `AuthService`, and JSON envelope helpers. It does not introduce a second backend, JWT stack, Axios client, or `CUSTOMER` `UserRole`.

```text
Customer Route Hierarchy
├── Public
│   ├── /login
│   ├── /register
│   ├── /services
│   ├── /services/[slug]
│   ├── /blog
│   ├── /blog/[slug]
│   ├── /quote
│   ├── /process
│   ├── /testimonials
│   ├── /booking
│   └── /booking/confirmation/[bookingId]
└── /dashboard (Protected layout; cookie presence in middleware is UX-only)
    ├── /dashboard
    ├── /dashboard/bookings
    ├── /dashboard/bookings/[id]
    ├── /dashboard/profile
    ├── /dashboard/settings
    ├── /dashboard/notifications
    ├── /dashboard/reviews
    └── /dashboard/help
```

* **Navigation:** Public marketing pages reuse `Navbar` with a server-fetched session (name and email only) and `SiteFooter`. `/dashboard` uses a dedicated customer application chrome (`CustomerShell`: header, persistent sidebar from `lg`, mobile sheet). The account shell does not reuse the admin dashboard or `SiteFooter`. Frontend navigation is UX only; backend authorization remains authoritative.
* **Home:** `/` keeps the existing landing composition and animation architecture without a Choose a Service band. Service exploration is `/services`. CTAs use real routes (`/quote`, `/services`, `/about`, `/process`, `/testimonials`, `/blog`, `/dashboard` for customers). Unpublished portfolio indexes are not linked. Home loads public reviews from `GET /api/v1/customer/testimonials` (`ReviewService.listPublic()`, `isActive: true` only) and published journal highlights from `GET /api/v1/customer/blog` (`BlogStatus.PUBLISHED` only). It never invents names, ratings, quotes, or article titles. It does not fetch catalog, booking, notification, or admin data. JSON-LD `LocalBusiness` omits unpublished NAP fields. Navbar How It Works, Reviews, and Journal point at `/process`, `/testimonials`, and `/blog`; the homepage still renders those sections.
* **Process:** `/process` is a public Server Component. It reuses the homepage How It Works timeline (header, campaign still, seven steps) and Final CTA. It does not invent prices, durations, or cleaner names.
* **Public reviews:** `/testimonials` is a public Server Component. It loads the same active testimonials as Home (`GET /api/v1/customer/testimonials`, `isActive: true` only, max six) and never invents names, ratings, or quotes. Empty, error, and loading states reuse the homepage testimonials UI.
* **Public journal:** `/blog` lists published posts from `GET /api/v1/customer/blog`. `/blog/[slug]` loads `GET /api/v1/customer/blog/:slug`. Drafts, archived posts, and missing slugs stay off the public site (`notFound()`). Home shows at most four published notes (one featured plus three slots).
* **Services discovery:** `/services` is a public Server Component with the site navbar and footer. It reads `q` and `page` from the URL and loads active catalog items from `GET /api/v1/customer/services`. `CatalogService.listPublic()` always scopes to `isActive: true`; the UI is not the visibility boundary. The page is a marketing catalog: hero copy, a grid of Admin-created services, and a closing quote CTA. Cards use real slugs, cover images, names, short descriptions, and `isFeatured` when true. They link to `/services/[slug]`. Apply / Request a Quote links to `/services/[slug]/apply`. Search matches `name` and `shortDescription`. There is no category or price filter because those fields are not on `Service`. Authenticated customers also browse the same catalog at `/dashboard/services`.
* **Service details:** `/services/[slug]` is a public Server Component. `GET /api/v1/customer/services/:slug` returns a customer-safe detail DTO for active offerings only. Missing or inactive slugs use Next.js `notFound()`. The page does not invent price, duration, category, or reviews. Benefits, included tasks, excluded tasks, and FAQs render only when the catalog record provides them. The primary CTA is Request a Quote (`/services/[slug]/apply`).
* **Service apply:** `/services/[slug]/apply` requires a customer session. Guests are redirected to `/login?next=/dashboard/services/[slug]/apply` using the existing safe `next` allowlist. After login, the customer lands on `/dashboard/services/[slug]/apply`, which reuses `QuoteRequestForm` and the same catalog record. Inactive or unknown slugs use `notFound()`. The client cannot apply to an inactive service because the catalog API excludes it. `/quote` remains the public request form for marketing CTAs.
* **Quote request:** `/quote` is a public multi-step visitor form. `POST /api/v1/customer/quotes` persists a `QuoteRequest` with status `NEW`. The server ignores client identity fields, `status`, `quotedAmount`, and `adminNotes`. Optional `serviceId` must reference an active catalog item. Honeypot plus IP rate limiting (3 / 15 minutes) apply. Confirmation is request-received, not a booking. Authenticated reads are `GET /api/v1/customer/quotes` and `GET /api/v1/customer/quotes/:id`, scoped to quotes whose `email` matches the session user. Other customers' quotes return the same not-found response. There is no `QuoteRequest.customerId`; email is the ownership key. The client cannot set or change quote status or money fields. Admin processing is `GET /api/v1/admin/quotes`, `GET /api/v1/admin/quotes/:id`, and `PATCH /api/v1/admin/quotes/:id` (price, notes, valid status). Customer accept/decline are `POST /api/v1/customer/quotes/:id/accept` and `POST /api/v1/customer/quotes/:id/decline`. Accept is allowed only from `QUOTED` (idempotent if already `ACCEPTED`).
* **Booking flow:** `/booking` requires a session and an accepted quote (`quoteId`). `POST /api/v1/customer/bookings` requires `quoteRequestId` for an owned `ACCEPTED` quote, then creates a `PENDING` booking and converts the quote to `CONVERTED` in one transaction. Duplicate conversion is rejected. The client cannot set status, cleaner, customer id, or price. There is no availability-slot engine; `scheduledAt` is a preferred time stored as UTC, not a reserved slot.
* **Booking confirmation:** `/booking/confirmation/[bookingId]` fetches the existing booking. It never creates a booking. Other customers' bookings return the same not-found experience.
* **Authentication:** `requireCustomerPage()` and middleware require a session. Unauthenticated `/dashboard`, `/booking`, `/services/[slug]/apply`, and `/dashboard/services/[slug]/apply` requests redirect to `/login` with a safe `next` path. `/services` and `/services/[slug]` stay public. `/register` is customer self-register (`POST /api/v1/customer/register` via `POST /api/customer/auth/register`). Registration stores the email, creates an unverified `STAFF` user (`emailVerifiedAt` null), links a `Customer` row, and sends a hashed verification email. It does not create a session. `/verify-email` consumes `POST /api/admin/auth/verify-email`. `/login` is the customer sign-in page and rejects unverified accounts with `EMAIL_UNVERIFIED`. The browser never sends `role`, `customerId`, or `userId`. Ownership is session email / `Customer.userId`. Logout reuses `POST /api/admin/auth/logout`. `/admin/register` remains admin-only and still sends a verification email. There is no public cleaner registration.
* **Authorization:** The HTTP API remains authoritative for ownership. Prisma `UserRole` stays admin-only (`ADMIN`, `SUPER_ADMIN`, `CONTENT_MANAGER`, `STAFF`). Login may authenticate a verified, active `STAFF` user (customer self-register). Unverified customers cannot obtain a session or open `/dashboard`. Admin pages and `/api/v1/admin/*` require an operator role (`ADMIN`, `SUPER_ADMIN`, `CONTENT_MANAGER`) — `STAFF` is not an admin operator. Customer records are the `Customer` model, optionally linked with `Customer.userId`. Portal actor role `CUSTOMER` is used for customer booking ownership checks. Browser requests must not send `customerId` or `userId` as an authorization query parameter, and must not call `/api/v1/admin/*`.
* **Privacy:** `/dashboard` and booking confirmation are `force-dynamic` and `robots: noindex`. Customer query keys include the session user id. Logout clears customer client cache listeners.
* **Customer HTTP APIs:** Public customer self-register lives at `POST /api/v1/customer/register` (`{ name, email, password }` only). Public catalog listing lives at `GET /api/v1/customer/services`. Public catalog detail lives at `GET /api/v1/customer/services/:slug`. Public testimonials listing lives at `GET /api/v1/customer/testimonials` (active reviews only; customer-safe DTO). Public journal listing lives at `GET /api/v1/customer/blog` (published posts only; no author ids or article bodies on the list). Public journal detail lives at `GET /api/v1/customer/blog/:slug`. Public newsletter subscribe lives at `POST /api/v1/customer/newsletter` (`{ email }` only; IP rate limited; response is `{ subscribed: true }` and never returns subscriber emails). Quote create lives at `POST /api/v1/customer/quotes`. Authenticated quote list/detail live at `GET /api/v1/customer/quotes` and `GET /api/v1/customer/quotes/:id` (session email ownership). Customer accept/decline live at `POST /api/v1/customer/quotes/:id/accept` and `POST /api/v1/customer/quotes/:id/decline`. Authenticated customer overview lives at `GET /api/v1/customer/dashboard`. Authenticated help topics live at `GET /api/v1/customer/help` (published service FAQs only). Authenticated booking list/create/get live at `GET|POST /api/v1/customer/bookings` and `GET /api/v1/customer/bookings/:id`. Customer booking mutations live at `PATCH /api/v1/customer/bookings/:id` (notes, preferred `scheduledAt`, service address) and `POST /api/v1/customer/bookings/:id/cancel`. Profile lives at `GET|PATCH /api/v1/customer/me` (`name`, `phone`, `address` only). Account security lives at `GET /api/v1/customer/account`, `POST /api/v1/customer/account/password`, `POST /api/v1/customer/account/verify-email`, `POST /api/v1/customer/account/sessions/:id`, and `POST /api/v1/customer/account/logout-all`. Customer reviews live at `GET|POST /api/v1/customer/reviews`, `PATCH /api/v1/customer/reviews/:id`, and `POST /api/v1/customer/reviews/:id/delete`. Customer in-app notifications live at `GET /api/v1/customer/notifications`, `GET /api/v1/customer/notifications/unread-count`, `GET /api/v1/customer/notifications/:id`, `PATCH /api/v1/customer/notifications/:id/read`, and `POST /api/v1/customer/notifications/read-all`. Customer live delivery is one-way SSE (`GET /api/v1/customer/notifications/stream`) after the inbox row is persisted. Inbox rows use the same `Notification` model (`recipientId` = session user id). Customers cannot create system notifications or open another inbox. List and overview queries are scoped to the session customer; the client cannot supply `customerId`. Same-origin browser mutations proxy through `apps/web` `/api/v1/customer/*`.
* **Dashboard overview:** `/dashboard` is a private Server Component. It loads session identity plus `GET /api/v1/customer/dashboard` (`upcomingBooking`, customer-owned summary counts, recent bookings). There are no mock metrics or admin aggregates.
* **My bookings:** `/dashboard/bookings` lists the session customer's bookings with URL `q`, `status`, `window`, and `page` filters. Pagination and filters are applied server-side.
* **Booking details:** `/dashboard/bookings/[id]` loads one customer-owned booking. Unauthorized or unknown ids use the same not-found experience. Eligible bookings can be updated or cancelled; the API re-checks ownership, status, and the 24-hour schedule lead. There is no availability-slot engine.
* **Profile:** `/dashboard/profile` loads and updates the session `Customer` row. Email and status are read-only. Name changes also update `User.name` so the account chrome stays in sync. Avatar upload is not implemented; initials are the fallback.
* **Settings:** `/dashboard/settings` is account/security only. Password change verifies the current password server-side and revokes other sessions. Email is read-only. Session list never returns tokens. Sign out of all devices deletes every session. Account deletion is not supported.
* **Reviews:** `/dashboard/reviews` lists the session customer's booking-linked testimonials and completed bookings that are still eligible. Create requires a completed owned booking and one review per booking (`Testimonial.bookingId` unique). Customer-created reviews start unpublished (`isActive: false`). Customers may edit rating/content and hide their review. Moderation, featured flags, and public homepage visibility remain admin-controlled. The public homepage and `/testimonials` read `GET /api/v1/customer/testimonials`, which returns a customer-safe DTO for active rows only (no emails, phone numbers, customer ids, booking ids, or avatar media ids) and caps the payload at six reviews.
* **Help:** `/dashboard/help` loads published service FAQs from `GET /api/v1/customer/help` (session required). Search and topic filters run on that payload. There is no support-ticket model, conversation, or contact-submission API; the page does not invent tickets or fake success. Published business contact from site/landing settings is shown only when it is not a development placeholder. Account links go to existing bookings, profile, settings, reviews, and quote routes.
* **Notifications:** `/dashboard/notifications` loads the session inbox from `GET /api/v1/customer/notifications`. The badge unread count comes from `GET /api/v1/customer/notifications/unread-count`, not from a partial list. Mark-read and mark-all-read persist through the existing mutation endpoints. Persisted customer inbox rows use `Notification.recipientId` = session user id. Customer booking create/update/cancel, review create, and admin booking create/status/assign write a customer-safe inbox item after the mutation succeeds (failures are logged and do not roll back the mutation). Live delivery reuses the existing in-process SSE connection manager on a customer-named event (`event: customer`) at `GET /api/v1/customer/notifications/stream`. Identity is the session user; customers cannot subscribe to another inbox. Missed events recover through normal refetch. The database remains the source of truth. There is no customer WebSocket. Customers cannot POST system notifications. Other customers' notifications return not-found. `relatedHref` values outside `/dashboard` are omitted from customer responses.

### 9.3 Customer backend foundation

The customer backend is the existing HTTP API in `apps/server`. Do not add a second API process, Prisma schema, auth stack, or response envelope.

```text
apps/web (customer UI + same-origin /api/v1/customer BFF)
    ↓ session cookie, no Prisma
apps/server
    ↓ middleware (CORS, security headers, request ID, rate limit, auth, Zod)
    ↓ controllers → domain services → repositories
    ↓ single Prisma client (`lib/db.ts`)
PostgreSQL
```

* **Ownership:** `apps/server/prisma` is the only schema and migration source. `apps/web` never imports Prisma.
* **Startup:** `server.ts` validates production config (`DATABASE_URL`, `SESSION_SECRET`), listens, and shuts down on `SIGINT`/`SIGTERM` (SSE, HTTP, Prisma disconnect). Liveness is `GET /health`. Readiness is `GET /ready` (database ping without leaking connection details).
* **Identity:** `requireAuth` resolves the session user. Customer portal actors use `customerActorFromContext()` (`role: "CUSTOMER"`). Ownership is `Customer.userId` / session email, never `customerId` from the client.
* **Contracts:** JSON `{ success, data, error, timestamp }`, `Cache-Control: no-store`, `x-request-id`. Customer routes live under `/api/v1/customer/*`.

### 9.3 Cleaner application foundation

The cleaner workspace lives under `/cleaner` in `apps/web`. It reuses the existing session cookie (`neatly_session`), `AuthService`, and JSON envelope helpers. It does not introduce a second backend, JWT stack, or a `CLEANER` `UserRole`. Prisma `UserRole` stays admin-only. A cleaner is an authenticated user whose `Cleaner.userId` matches the session and whose `Cleaner.status` is `ACTIVE`.

```text
/cleaner (Protected except /cleaner/activate; cookie presence in middleware is UX-only)
├── /cleaner
├── /cleaner/jobs
├── /cleaner/jobs/:id
├── /cleaner/schedule
├── /cleaner/availability
└── /cleaner/activate (public invitation)
```

Earnings, reviews, notifications, profile, settings, and help remain reserved in `CLEANER_PATHS` and are not linked until those pages exist.

* **Invitation:** Cleaners do not self-register. An admin creates the `Cleaner` row and a linked `User` with Prisma role `STAFF`, both `INACTIVE` and unverified. The server issues a hashed `EmailVerificationToken` (7-day TTL, single-use) and sends an invitation email through `EmailService`. The client cannot set role. There is no `/cleaner/register` route. After the cleaner sets a password at `/cleaner/activate`, the token is consumed, the password is hashed, and both records become `ACTIVE`.
* **Authentication:** Unauthenticated `/cleaner` requests redirect to `/login` with a safe `next` path. `/cleaner/activate` is public. The same login form is reused. After login, a successful `GET /api/v1/cleaner/me` sends cleaners to `/cleaner`. Logout uses the existing session logout action.
* **Authorization:** `requireCleanerPage()` calls `GET /api/v1/cleaner/me`. Admin operators are denied and sent to `/admin`. Users without an active linked cleaner are denied and sent to `/dashboard`. The backend is authoritative; hiding UI is not a security boundary.
* **API:** Session-scoped cleaner routes are `GET /api/v1/cleaner/me`, `GET /api/v1/cleaner/dashboard`, `GET /api/v1/cleaner/jobs`, `GET /api/v1/cleaner/jobs/:id`, `POST /api/v1/cleaner/jobs/:id/start`, `POST /api/v1/cleaner/jobs/:id/complete`, `GET /api/v1/cleaner/schedule`, and `GET|PATCH /api/v1/cleaner/availability`. Public invitation routes are `GET|POST /api/v1/cleaner/activate`. Admin cleaner management is `GET|POST /api/v1/admin/cleaners`, `GET|PATCH /api/v1/admin/cleaners/:id`, `PATCH /api/v1/admin/cleaners/:id/status`, and `POST /api/v1/admin/cleaners/:id/resend-invitation`. Clients cannot pass `cleanerId` or `userId` for authorization. Job status labels reuse `BookingStatus` (`PENDING`, `CONFIRMED`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`). There is no `ACCEPTED` or `EN_ROUTE` status. Customer email and phone are not included on cleaner job views.
* **Job workflow:** The domain state machine in `booking-transitions.ts` is authoritative. A cleaner may start an `ASSIGNED` job (`ASSIGNED` → `IN_PROGRESS`) and complete an in-progress job (`IN_PROGRESS` → `COMPLETED`). There is no cleaner accept step. Cancelled and completed jobs have no workflow actions. Mutations require an active session cleaner, assignment ownership, and a valid transition. Another cleaner's job returns 404. Invalid or concurrent transitions return a conflict. The UI refreshes from the server after success or rejection and does not invent transition history. `updatedAt` may be shown as last updated.
* **Schedule:** `GET /api/v1/cleaner/schedule?date=YYYY-MM-DD` returns the session cleaner's jobs for that UTC day, a Monday-start week of job counts, and the next upcoming assignment. Duration and end time are omitted because `Booking` does not store them.
* **Availability:** `Cleaner.availability` is optional JSON `{ week: [{ day, available, start, end }] }` with one window per weekday. Missing data defaults to unavailable. Availability never cancels or edits bookings. If upcoming assigned jobs fall on unavailable weekdays, the API returns a warning list only.
* **Layout:** `CleanerShell` provides the skip link, sticky header, desktop sidebar, mobile navigation drawer, and main landmark. Navigation uses one config (`cleaner-nav.ts`) and only renders routes that exist. The notification control is an empty-state entry point until a cleaner notification API exists. No unread or job-count badges are fabricated.

---

## 10. DOMAIN MODULES SPECIFICATION

Neatly comprises eleven distinct domain modules:

```text
Domain Modules Architecture
├── 1. Auth Module        -> Admin authentication, session creation, password hashing, session validation.
├── 2. Admin Module       -> Dashboard metrics aggregation, activity feeds, internal user profile.
├── 3. Services Module    -> Catalog CRUD, slug generation, scope inclusions/exclusions, status toggles.
├── 4. Quotes Module      -> Interactive request validation, DB storage, status pipeline, email triggers.
├── 5. Contacts Module    -> Inquiry form validation, inbox status, admin alert triggers.
├── 6. Portfolio Module   -> Before/After image pair management, project categorization, display order.
├── 7. Testimonial Module -> Customer review moderation, rating management, homepage feature toggles.
├── 8. Blog Module        -> Rich text article composition, slug management, publication states, tags.
├── 9. Newsletter Module  -> Subscription registration, duplicate handling, subscriber list, CSV export.
├── 10. Settings Module   -> Global business phone, email, operating hours, social links, system configs.
└── 11. Infrastructure    -> Media storage service, Email dispatch service, Analytics logger.
```

---

## 11. API ARCHITECTURE

All API routes follow RESTful conventions under `/api/v1/*` or dedicated Next.js App Router API paths:

### 11.1 API Route Conventions
* **Response Format:** Standard JSON response object wrapper:
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null,
    "timestamp": "2026-08-25T20:12:43.000Z"
  }
  ```
* **Error Format:** Standardized error response payload:
  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "INVALID_INPUT",
      "message": "Validation failed.",
      "requestId": "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
      "details": [
        { "field": "email", "issue": "Invalid email address format" }
      ],
      "fields": {
        "email": "Invalid email address format"
      }
    },
    "timestamp": "2026-08-25T20:12:43.000Z"
  }
  ```
* **Request ID:** Every API response includes `x-request-id`. UUID-shaped client values are echoed; other values are replaced with a generated ID. Error objects include `requestId` for correlation.
* **Validation:** Backend Zod schemas are authoritative. Security-sensitive bodies use strict objects so unknown fields (for example `role`) are rejected. Validation failures keep `code: "INVALID_INPUT"` with `details: [{ field, issue }]` for frontend compatibility, plus a `fields` map. Prisma errors are mapped to application errors and never returned raw.
* **HTTP API process:** `apps/server` separates `app.ts` (middleware, routes, errors; testable without listen) from `server.ts` (port, listen, graceful shutdown). Application routes live under `/api/v1`. Process liveness is `GET /health`. Dependency readiness is `GET /ready`.
* **Domain services:** Core business rules live in `apps/server/src/services` (`users`, `customers`, `cleaners`, `catalog`, `quotes`, `bookings`, `reviews`, `notifications`, `admin`, `dashboard`, `settings`) and are independent of HTTP. They accept a typed `Actor` plus domain inputs and return DTOs (`*Record`, `ListResult`). They do not read request objects, cookies, or status codes. Prisma access goes through `apps/server/src/repositories`. Booking status changes go through `booking-transitions.ts`. Reviews persist as `Testimonial` rows. Catalog “service” means a cleaning offering (`Service` model), not an infrastructure class. Admin HTTP routes live under `/api/v1/admin` (see [`docs/ADMIN_API.md`](file:///Users/sayamdas/Documents/Programming/Mern%20Stack/My%20Website/Neatly/docs/ADMIN_API.md)). Email stays behind `EmailService` → `EmailProvider`. Notifications persist in PostgreSQL as the source of truth. Admin live delivery is one-way SSE (`GET /api/v1/admin/notifications/stream`) after the mutation commits. The in-process connection manager does not fan out across multiple API instances.

### 11.2 Public API Endpoints
* `POST /api/quotes` — Submit a new quote request (Rate-limited, honeypot protected).
* `POST /api/contact` — Submit a general contact message (Rate-limited, honeypot protected).
* `POST /api/newsletter` — Subscribe email to newsletter. Implemented as `POST /api/v1/customer/newsletter`.
* `GET  /api/v1/customer/services` — Fetch active public catalog services (`search`, `page`, `limit`). Inactive records are excluded by the domain, not the client.
* `GET  /api/v1/customer/services/:slug` — Fetch one active public catalog service. Missing or inactive slugs return the standard not-found envelope.
* `POST /api/v1/customer/register` — Create a customer account from `{ name, email, password }`. Extra `role`, `customerId`, and `userId` fields are rejected. The server creates an unverified `STAFF` user (`emailVerifiedAt` null), stores the email, links a `Customer` row, and sends a verification email. Same-origin BFF is `POST /api/customer/auth/register`. The BFF does not set a session cookie.
* `POST /api/v1/customer/quotes` — Submit a public quote request (`NEW`). Client `status`, `price`, and `adminNotes` are rejected. Honeypot plus IP rate limiting apply.
* `GET  /api/v1/customer/quotes` — List quote requests whose `email` matches the session user (`page`, `limit`, optional `status`).
* `GET  /api/v1/customer/quotes/:id` — Read one session-owned quote request. Other customers' ids return not-found.
* `GET|POST /api/v1/customer/bookings` — List or create session-owned bookings. Create ignores client status, price, customer id, and cleaner assignment.
* `GET|PATCH /api/v1/customer/bookings/:id` — Read or update notes / preferred time / address on an owned booking.
* `POST /api/v1/customer/bookings/:id/cancel` — Cancel an owned booking when the lifecycle allows it.
* `GET|PATCH /api/v1/customer/me` — Read or update the session customer profile (`name`, `phone`, `address`).
* `GET|POST /api/v1/customer/reviews` — List the session customer's reviews or create one for a completed owned booking.
* `GET /api/v1/customer/notifications` — List the session user's inbox (`page`, `limit`, optional `unreadOnly`).
* `GET /api/v1/customer/notifications/unread-count` — Count unread inbox rows for the session user.
* `GET /api/v1/customer/notifications/stream` — Authenticated customer SSE. Emits `ready` and `customer` events for the session user only. The database remains authoritative; reconnect refetches inbox and unread count.
* `GET /api/v1/customer/notifications/:id` — Read one owned inbox row.
* `PATCH /api/v1/customer/notifications/:id/read` — Mark one owned inbox row read.
* `POST /api/v1/customer/notifications/read-all` — Mark the session user's inbox read.
* `GET  /api/portfolio` — Fetch active public portfolio items.
* `GET /api/v1/customer/testimonials` — Public list of active testimonials (`isActive: true` only). Unauthenticated. Customer-safe fields only. Homepage and `/testimonials` display at most six.
* `GET  /api/blog` — Fetch published blog posts (supports pagination & category filters). Implemented as `GET /api/v1/customer/blog`. Detail is `GET /api/v1/customer/blog/:slug`.

### 11.3 Protected Admin API Endpoints (`/api/admin/*`)

Next.js Route Handlers remain the browser-facing BFF. Authentication decisions execute on the Neatly HTTP API. The BFF sets HttpOnly cookies and never returns session tokens to JavaScript.

* `POST /api/admin/auth/login` — Authenticate admin credentials and set session cookie.
* `POST /api/admin/auth/logout` — Invalidate session and clear session cookie.
* `POST /api/admin/auth/register` — Create an admin account and send a verification email.
* `POST /api/admin/auth/forgot-password` — Request a password reset email. Always returns a generic success payload.
* `POST /api/admin/auth/reset-password` — Consume a single-use reset token and set a new password hash.
* `POST /api/admin/auth/verify-email` — Consume a single-use email verification token.
* `POST /api/admin/auth/resend-verification` — Resend a verification email. Always returns a generic success payload.
* `GET  /api/admin/quotes` — List quotes with status filtering.
* `PATCH /api/admin/quotes/[id]` — Update quote status, quoted amount, or append internal notes.
* `GET  /api/admin/contacts` — List contact inbox submissions.
* `PATCH /api/admin/contacts/[id]` — Toggle read/archived status.
* `POST /api/admin/services` — Create service offering.
* `PUT  /api/admin/services/[id]` — Update service offering.
* `DELETE /api/admin/services/[id]` — Delete service offering.
* `POST /api/admin/portfolio` — Create portfolio before/after item.
* `POST /api/admin/blog` — Create blog post.
* `PUT  /api/admin/blog/[id]` — Update blog post.
* `GET  /api/admin/newsletter/export` — Stream subscriber list as CSV file.
* `PUT  /api/admin/settings` — Save updated global site settings.

---

## 12. SERVICE LAYER ARCHITECTURE

Business logic is completely isolated inside Service classes located in `/services/`:

```text
Request Handler (Route / Action)
       ↓  (Extracts request payload)
Zod Validation
       ↓  (Passes sanitized data)
Service Layer Execution (e.g., QuoteService.createQuoteRequest(data))
       ├── 1. Business Logic Rule Check
       ├── 2. Prisma Database Query Execution
       ├── 3. Email Notification Dispatch (via EmailService)
       └── 4. Cache Invalidation Call (revalidateTag)
       ↓
Response Return to Client
```

### Core Service Components
* `AuthService`: Handles password hashing (`bcrypt`), token generation (`crypto`), session creation, session lookup, and logout invalidation.
* `QuoteService`: Enforces quote validation constraints, persists quote records, triggers admin notification emails, and updates status workflows.
* `ContactService`: Manages general inquiries, unread flags, and admin alert emails.
* `ServiceService`: Manages cleaning service CRUD, slug uniqueness validation, and public cache invalidation.
* `PortfolioService`: Handles before/after photo pair association and category filtering.
* `BlogService`: Controls article lifecycle (Draft -> Published), slug auto-generation, and rich text sanitization.
* `EmailService`: Provider-agnostic transactional email dispatch wrapper.
* `MediaService`: Media upload handling, file size validation, MIME verification, and Cloudinary/S3 integration.

---

## 13. VALIDATION ARCHITECTURE

Neatly enforces strict Zod schema validation at every input boundary:

```text
                                INCOMING INPUT
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
   Client Form Input (UI)                          API Payload (Server)
              │                                               │
              ▼                                               ▼
   React Hook Form + Zod                           Zod Server Middleware
              │                                               │
   [Reject: Inline Error]                          [Reject: HTTP 400 JSON]
              │                                               │
              └───────────────────────┬───────────────────────┘
                                      ▼
                            Sanitized Core Input
                                      ▼
                            Service Business Layer
```

### Validation Rule Guidelines
* **Forms & APIs:** Shared Zod schemas (located in `/lib/validations/`) ensure client-side and server-side validation rules remain 100% synchronized.
* **Environment Variables:** Zod schema validation runs on application boot (`/env.mjs`) to verify required environment variables (`DATABASE_URL`, `SESSION_SECRET`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`) exist before server start.

---

## 14. ERROR HANDLING ARCHITECTURE

Neatly utilizes a unified error classification system:

```text
Application Exception Occurs
       │
       ├── Known Validation Error (ZodError)     -> HTTP 400 Bad Request (Return Field Errors)
       ├── Authentication Error (AuthError)      -> HTTP 401 Unauthorized (Redirect / Return JSON)
       ├── Permission Error (ForbiddenError)     -> HTTP 403 Forbidden
       ├── Resource Missing (NotFoundError)      -> HTTP 404 Not Found (Custom 404 Page)
       ├── Rate Limit Exceeded (RateLimitError)  -> HTTP 429 Too Many Requests
       └── Unexpected System Error (Database/Code)-> HTTP 500 Internal Error
                                                     │
                                                     ├── Masked generic response to user
                                                     └── Detailed error log to server monitoring
```

* **Security Policy:** Production server errors MUST NEVER leak database connection errors, SQL queries, stack traces, or internal server paths to the client.

---

## 15. AUTHENTICATION & AUTHORIZATION SPECIFICATION

```text
                            ADMIN LOGIN FLOW
                                    │
                         Submit Credentials (Email + Password)
                                    │
                         Next.js BFF origin / CSRF check
                                    │
                         POST /api/v1/auth/login on the Neatly HTTP API
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
              [Password Match,              [Password Mismatch,
               verified, active]             unverified, or inactive]
                     │                             │
       Persist hashed session in DB       Increment Rate Limit Counter
                     │                             │
       Return session token to BFF        Return HTTP 401 Error
                     │
       Set HttpOnly, Secure Cookie
       (token never returned to browser)
                     │
       Redirect to /admin Dashboard
```

### Technical Controls
* **Ownership:** Authentication is owned by the Neatly HTTP API (`apps/server`). Next.js does not import Prisma, hash passwords, or read `SESSION_SECRET`.
* **Password Hashing:** `bcrypt` with a minimum cost factor of 12. Hashes are never logged, returned, or placed in tokens.
* **Session Strategy:** Crypto-random 256-bit session tokens stored in an `HttpOnly` cookie on the Next.js origin. The raw token is hashed with `HMAC-SHA256(SESSION_SECRET)` in the API before it is written to the `sessions` table. There are no JWT access or refresh tokens and no `localStorage` credentials.
* **Session Cookie Configuration:**
  * `HttpOnly: true` (Prevents client-side JavaScript access via `document.cookie`).
  * `Secure: true` in production (Mandates HTTPS transport). `Secure` is disabled on local HTTP development.
  * `SameSite: Strict` (First CSRF control: cross-site browsers will not attach the cookie).
  * `Path: /`
  * `Max-Age: 604800` (7-day session validity).
* **CSRF:** Cookie-authenticated auth mutations also require a matching `Origin`, `Referer`, or `Host` against `NEXT_PUBLIC_SITE_URL`.
* **Password Reset:** Hashed, single-use tokens expire after 60 minutes. A successful reset rehashes the password and deletes all sessions for that admin.
* **Email Verification:** Hashed, single-use tokens expire after 24 hours. Customer links use `/verify-email?token=`; admin links use `/admin/verify-email?token=`. Login requires `emailVerifiedAt` to be set. Unverified customer credentials return `EMAIL_UNVERIFIED` and do not create a session. Unverified admin credentials still return `INVALID_CREDENTIALS`. Resend and forgot-password always return a generic notice.
* **Account Enumeration:** Forgot-password and resend-verification always return: "If an account exists for this email, instructions have been sent."
* **Rate Limiting:** Maximum 5 login, forgot-password, reset-password, and resend-verification attempts per IP per 15 minutes (in-process limiter on the API; Redis is out of MVP scope).
* **Authorization Boundary:** The server session cookie is the source of truth. `getSession()` / `getCurrentUser()` resolve the admin through the API (request-deduped, dynamic, never cached). `requireAuth()` throws for API handlers. `requireAdminPage()` redirects unauthenticated visitors to `/admin/login`. `requireRole()` / `requirePermission()` enforce RBAC. There is no client `AuthProvider` and no JWT refresh flow.
* **Route Protection:** Middleware only checks cookie presence on `/admin/*` (except login / register / forgot-password / reset-password / verify-email). The `app/admin/(app)` layout validates the session through the backend API and redirects if it is missing or expired. The `app/admin/(session)` layout sends an already-authenticated admin to `/admin/dashboard`. `/admin` redirects to `/admin/dashboard`. Shared `/login` sends admin operators to `/admin/dashboard` and customers to `/dashboard`. Public marketing routes are never gated.
* **Authenticated API Client:** Same-origin `adminRequest()` sends the session cookie (`credentials: "same-origin"`, `cache: "no-store"`). Browser Admin GETs, POSTs, and PATCHes use `/api/v1/admin/*`; the Next.js BFF checks same-origin CSRF, forwards the session as `x-session-token` to the HTTP API, and never returns that token to JavaScript. Typed Admin clients live in `apps/web/src/lib/admin/`. Mutations send only allowlisted fields. HTTP 401 is unauthorized / session invalid and reuses the existing Admin login redirect. HTTP 403 is authenticated-but-forbidden and must not log the user out. There is no retry or token-refresh loop. Admin responses are `Cache-Control: no-store` and are never publicly cached.

### Auth API Contract

Browser-facing Next.js routes return the standard `{ success, data, error, timestamp }` envelope and `Cache-Control: no-store`. The BFF calls the HTTP API and never includes `sessionToken` in browser responses.

| Route | Auth required | Request body | Success `data` | Error codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST /api/admin/auth/login` | No | `{ email, password }` | `{ user, expiresAt }` | `INVALID_INPUT`, `INVALID_CREDENTIALS`, `EMAIL_UNVERIFIED`, `RATE_LIMITED`, `FORBIDDEN` |
| `POST /api/admin/auth/logout` | No | none | `{ signedOut: true }` | `FORBIDDEN` |
| `POST /api/admin/auth/register` | No | `{ name, email, password }` | `{ user }` | `INVALID_INPUT`, `FORBIDDEN` |
| `POST /api/customer/auth/register` | No | `{ name, email, password }` | `{ user }` | `INVALID_INPUT`, `FORBIDDEN`, `RATE_LIMITED` |
| `POST /api/admin/auth/forgot-password` | No | `{ email }` | `{ message }` | `INVALID_INPUT`, `RATE_LIMITED`, `FORBIDDEN` |
| `POST /api/admin/auth/reset-password` | No | `{ token, password }` | `{ user: { id, email } }` | `INVALID_INPUT`, `TOKEN_INVALID`, `TOKEN_EXPIRED`, `RATE_LIMITED`, `FORBIDDEN` |
| `POST /api/admin/auth/verify-email` | No | `{ token }` | `{ user: { id, email } }` | `INVALID_INPUT`, `TOKEN_INVALID`, `TOKEN_EXPIRED`, `FORBIDDEN` |
| `POST /api/admin/auth/resend-verification` | No | `{ email }` | `{ message }` | `INVALID_INPUT`, `RATE_LIMITED`, `FORBIDDEN` |

Backend-owned application routes live under `/api/v1`. Auth: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/session`, `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`, `POST /api/v1/auth/verify-email`, `POST /api/v1/auth/resend-verification`. Login returns `sessionToken` only to the Next.js BFF. Process liveness is `GET /health`. Dependency readiness is `GET /ready`.

`user` never includes `passwordHash` or tokens. `FORBIDDEN` is returned when the CSRF origin check fails.

---

## 16. DATABASE ARCHITECTURE CONCEPTUAL SPECIFICATION

The PostgreSQL database (managed via Prisma ORM) is structured around eight core domain entities:

```text
Entities Relationship Concept
┌──────────────┐          ┌─────────────────┐          ┌────────────────┐
│  AdminUser   │          │  QuoteRequest   │          │ ContactMessage │
│ (Auth/Admin) │          │  (Lead Engine)  │          │(General Inbox) │
└──────────────┘          └─────────────────┘          └────────────────┘

┌──────────────┐          ┌─────────────────┐          ┌────────────────┐
│   Service    │          │  PortfolioItem  │          │  Testimonial   │
│(Catalog CMS) │          │(Before/After CMS│          │ (Reviews CMS)  │
└──────────────┘          └─────────────────┘          └────────────────┘

┌──────────────┐          ┌─────────────────┐          ┌────────────────┐
│   BlogPost   │          │   Subscriber    │          │  SiteSettings  │
│  (Blog CMS)  │          │ (Newsletter DB) │          │ (Global Config)│
└──────────────┘          └─────────────────┘          └────────────────┘
```

*Detailed relational schema, data types, indexes, and constraints will be formally defined in `DATABASE.md`.*

---

## 17. CMS & CONTENT REVALIDATION ARCHITECTURE

To ensure high performance for marketing visitors alongside instant updates when administrators edit content, Neatly combines Next.js Data Caching with Tag-Based On-Demand Revalidation:

```text
Admin CMS Action (e.g., Edit Service / Publish Blog Post)
       │
       ▼
Update Persisted Record in PostgreSQL via Prisma
       │
       ▼
Trigger On-Demand Revalidation (`revalidateTag('services')`)
       │
       ▼
Next.js Cache Invalidated for 'services' Tag
       │
       ▼
Next Visitor Request Serves Newly Rendered Dynamic Content
```

---

## 18. IMAGE & MEDIA MANAGEMENT ARCHITECTURE

```text
Admin Media Upload (Image File)
       │
       ▼
Server-Side MIME & Size Validation (JPEG, PNG, WebP only; Max 5MB)
       │
       ▼
Upload to Cloud Storage Provider (Cloudinary / S3 / UploadThing)
       │
       ▼
Receive Storage URL + Public ID
       │
       ▼
Save URL + Mandatory Alt Text in Database Record
       │
       ▼
Public Web Delivery via Next.js <Image> (WebP/AVIF auto-format + Srcset)
```

---

## 19. EMAIL ARCHITECTURE SPECIFICATION

Neatly utilizes a provider-agnostic `EmailService` pattern:

```text
// Conceptual Interface Wrapper
interface EmailProvider {
  sendEmail(payload: {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
  }): Promise<{ success: boolean; messageId?: string }>;
}
```

### Workflows
1. **Quote Received:**
   * Customer Email: "We've received your quote request for [Service Name]."
   * Admin Email: "New Quote Lead: [Customer Name] - [Property Size]."
2. **Contact Inquiry:**
   * Customer Email: "Thank you for contacting Neatly."
   * Admin Email: "New Inquiry: [Subject] from [Customer Email]."

---

## 20. FORM LIFECYCLE ARCHITECTURE

All public and admin forms strictly follow a standardized 8-stage lifecycle:

```text
1. IDLE                -> Render form with default values.
   ↓
2. USER INPUT          -> User types into inputs; React Hook Form tracks values.
   ↓
3. CLIENT VALIDATION   -> Zod schema validates inline on blur or submit.
   ↓
4. SUBMIT (DISABLED)   -> Submit button enters disabled loading state with spinner.
   ↓
5. SERVER VALIDATION   -> API Route re-validates payload via Zod.
   ↓
6. BUSINESS LOGIC      -> Service processes request (DB insert + Email dispatch).
   ↓
7. SUCCESS RESPONSE    -> Form transitions to visual Success Banner / Clear state.
   ↓
8. ERROR FALLBACK      -> If server fails, display clear inline error message + Retry button.
```

---

## 21. ANIMATION ARCHITECTURE SPECIFICATION

Neatly enforces a clear separation of responsibility across four animation tools:

```text
Lenis                  -> Smooth Scrolling (Normalizes scroll momentum globally).
GSAP + ScrollTrigger   -> Page Reveals & Scroll Timelines (Staggered section fades).
Motion (Framer)        -> UI Micro-Interactions (Accordion dropdowns, modal windows).
CSS Transitions        -> Native Hover & Focus States (Button color changes, link underlines).
```

### Execution Controls
* **Global Reduced Motion:** If `prefers-reduced-motion: reduce` is detected via CSS media query, GSAP triggers and Motion layout transitions are disabled automatically.
* **Non-Blocking Rule:** Animations must NEVER delay form input responsiveness or pointer click events.

---

## 22. RESPONSIVE BREAKPOINT SPECIFICATION

Neatly implements mobile-first responsive design across five standardized Tailwind CSS breakpoints:

```text
Viewport Breakpoints
├── Mobile Portrait  (sm)  : 640px  (100% width single column layouts, sticky mobile CTA)
├── Tablet           (md)  : 768px  (2-column card grids, drawer navigation menu)
├── Laptop           (lg)  : 1024px (3-column service grids, full desktop horizontal header)
├── Desktop          (xl)  : 1280px (Max container width cap: 1280px centered)
└── Large Desktop    (2xl) : 1536px (Expanded margins, high-density dashboard tables)
```

---

## 23. SEO ARCHITECTURE SPECIFICATION

SEO is built directly into page generation:
* **Dynamic Metadata Generator (`generateMetadata`):** Generates page title, meta description, and OpenGraph images dynamically based on route parameters.
* **XML Sitemap (`app/sitemap.ts`):** Automatically fetches active Service slugs and published Blog post slugs to generate an updated `sitemap.xml`.
* **Structured Data (`JSON-LD` Component):** Injects schema markup:
  * `LocalBusiness` / `CleaningService` schema on Home. NAP fields (`telephone`, `email`, `address`, `openingHours`) are included only when published site settings exist. Contact pages follow the same rule when that route ships.
  * `Service` schema on Service Detail pages.
  * `BlogPosting` schema on Blog Detail pages.

---

## 24. ACCESSIBILITY ARCHITECTURE (WCAG 2.1 AA)

* **Keyboard Traps & Focus Management:** Modal dialogs (admin popups, mobile navigation drawers) trap keyboard focus while open and restore focus upon closing.
* **ARIA Regions:** Dynamic status changes utilize `aria-live="polite"` regions.
* **Screen-Reader Labels:** All icon-only buttons (close icons, mobile menu toggles) enforce explicit `aria-label` attributes.

---

## 25. SECURITY ARCHITECTURE SPECIFICATION

```text
Client Browser
      │
      ├── 1. HTTPS transport mandatory (SSL/TLS)
      ├── 2. Security Headers (CSP, X-Frame-Options: DENY, X-Content-Type-Options)
      ├── 3. HttpOnly, Secure, SameSite=Strict Session Cookies
      ├── 4. Honeypot + Rate Limiting (Spam & Brute-force protection)
      ├── 5. Zod Input Sanitization (SQLi & XSS prevention)
      ├── 6. Isolated Environment Secrets (Zero NEXT_PUBLIC_ leakage)
      └── 7. Parameterized Queries via Prisma ORM
```

---

## 26. PERFORMANCE ARCHITECTURE

* **Server Components First:** 80%+ of marketing pages render entirely on the server with zero client bundle overhead.
* **Image Optimization (`next/image`):** Automatically serves `.webp`/`.avif` formats with responsive `srcset` and lazy loading.
* **Font Optimization (`next/font`):** Zero layout shift (CLS) via self-hosted Google Fonts with `font-display: swap`.

---

## 27. CACHING & DATA FRESHNESS STRATEGY

| Data Type | Cache Level | Invalidation Strategy |
| :--- | :--- | :--- |
| **Marketing Pages** | ISR / Data Cache | On-demand via `revalidateTag()` on CMS update |
| **Blog & Portfolio**| ISR / Data Cache | On-demand via `revalidateTag()` on CMS update |
| **Quote Requests** | NO CACHE (Dynamic) | Always fresh server-side fetch (`cache: 'no-store'`) |
| **Contact Messages**| NO CACHE (Dynamic) | Always fresh server-side fetch (`cache: 'no-store'`) |
| **Admin Dashboard** | NO CACHE (Dynamic) | Always fresh server-side fetch (`cache: 'no-store'`) |

---

## 28. OBSERVABILITY & MONITORING

* **Structured Logging:** Centralized JSON logging on server errors capturing timestamp, route, error code, and sanitized request metadata.
* **Error Tracking:** Integration ready for error monitoring (e.g., Sentry) to log unhandled runtime exceptions.
* **Data Privacy:** Passwords, session tokens, and customer personal phone/address data are masked out of system application logs.

---

## 29. TESTING ARCHITECTURE

```text
Testing Pyramid
├── 1. Unit Tests (Jest / Vitest)        -> Zod schemas, service layer logic, rate limiters.
├── 2. Integration Tests (Supertest/API) -> API endpoints, Prisma DB queries, Auth flow.
├── 3. E2E Tests (Playwright)             -> Visitor quote flow, Admin login & CMS publishing.
└── 4. Manual QA Matrix                  -> Multi-browser cross-device visual and accessibility checks.
```

---

## 30. DEPLOYMENT & CI/CD PIPELINE

```text
GitHub pull request / merge group / push to main
       │
       ▼
CI (parallel): Lint, Typecheck + prisma validate, Unit tests, Production builds
       │
       ▼
Docker image builds (neatly-web:<sha>, neatly-api:<sha>, not pushed)
       │
       ▼
Required check: CI
       │
       ▼  (manual workflow_dispatch + GitHub production environment)
Production verification of the same SHA
       │
       ▼
Host rollout (not configured in this repository)
       │
       ▼
Controlled API release: `pnpm db:migrate:deploy` on the API host only
```

CI never connects to production PostgreSQL. `prisma validate` checks the schema file. `prisma migrate deploy` stays a controlled API-host step. See [`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## 31. ENVIRONMENT MANAGEMENT

| Variable Name | Environment Scope | Description | Exposed to Client? |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | API Server Only | PostgreSQL connection string | ❌ NO |
| `SESSION_SECRET` | API Server Only | Secret string for session and token hashing | ❌ NO |
| `SITE_URL` | API Server Only | Public origin used in auth emails | ❌ NO |
| `SMTP_HOST` | API Server Only | Brevo SMTP host (`smtp-relay.brevo.com`) | ❌ NO |
| `SMTP_PORT` | API Server Only | SMTP port (`587` STARTTLS, or `465`) | ❌ NO |
| `SMTP_USER` | API Server Only | Brevo SMTP username | ❌ NO |
| `SMTP_PASSWORD` | API Server Only | Brevo SMTP key. Never log this value | ❌ NO |
| `SMTP_FROM_EMAIL` | API Server Only | Verified Brevo sender address | ❌ NO |
| `SMTP_FROM_NAME` | API Server Only | Sender display name | ❌ NO |
| `NEATLY_API_URL` | Next.js Server Only | Origin of the Neatly HTTP API | ❌ NO |
| `CORS_ORIGIN` | API Server Only | Explicit browser origin for credentialed CORS | ❌ NO |
| `SUPABASE_URL` | API Server Only | Supabase project URL for storage uploads | ❌ NO |
| `SUPABASE_SECRET_KEY` | API Server Only | Supabase service-role key for storage uploads | ❌ NO |
| `SUPABASE_SERVICES_THUMB_BUCKET` | API Server Only | Public bucket for service thumbnails (`Services_Thumb`) | ❌ NO |
| `STORAGE_API_KEY` | API Server Only | Reserved storage credential | ❌ NO |
| `NEXT_PUBLIC_SITE_URL`| Client + Next.js Server | Public canonical URL (e.g., `https://neatly.com`) | ✅ YES |

---

## 32. PROJECT STRUCTURE SPECIFICATION

```text
neatly/
├── app/                         # Next.js App Router Pages & API Routes
│   ├── (public)/                # Public Marketing Route Group (Shared Public Layout)
│   │   ├── page.tsx             # Homepage
│   │   ├── about/page.tsx       # About Page
│   │   ├── services/            # Services Index & [slug] Pages
│   │   ├── portfolio/page.tsx   # Portfolio Page
│   │   ├── blog/                # Blog Index & [slug] Pages
│   │   ├── contact/page.tsx     # Contact Page
│   │   ├── quote/page.tsx       # Interactive Quote Request Page
│   │   ├── privacy/page.tsx     # Privacy Policy
│   │   ├── terms/page.tsx       # Terms of Service
│   │   └── cookies/page.tsx     # Cookie Policy
│   ├── admin/                   # Protected Admin Route Group (Shared Admin Layout)
│   │   ├── login/page.tsx       # Admin Login Form
│   │   ├── page.tsx             # Redirects to /admin/dashboard
│   │   ├── dashboard/page.tsx   # Admin Dashboard Overview
│   │   ├── quotes/page.tsx      # Quote Pipeline Management
│   │   ├── contacts/page.tsx    # Message Inbox Management
│   │   ├── services/page.tsx    # Services CMS
│   │   ├── portfolio/page.tsx   # Portfolio CMS
│   │   ├── testimonials/page.tsx# Testimonials CMS
│   │   ├── blog/page.tsx        # Blog CMS
│   │   ├── newsletter/page.tsx  # Newsletter Subscribers Manager
│   │   └── settings/page.tsx    # Global Business Settings
│   ├── api/                     # REST API Endpoints
│   │   ├── quotes/route.ts      # Public Quote Endpoint
│   │   ├── contact/route.ts     # Public Contact Endpoint
│   │   ├── newsletter/route.ts  # Public Newsletter Endpoint
│   │   └── admin/               # Protected Admin API Routes
│   ├── layout.tsx               # Root Application Layout
│   └── sitemap.ts               # Automated XML Sitemap Generator
├── components/                  # Shared UI Components
│   ├── ui/                      # Atomic shadcn/ui primitives (button, input, card, dialog)
│   ├── public/                  # Public Marketing Components (Navbar, Footer, Hero)
│   └── admin/                   # Admin UI Components (Sidebar, MetricCards, Tables)
├── services/                    # Core Application Business Logic Services
│   ├── auth.service.ts          # Authentication Service
│   ├── quote.service.ts         # Quote Lead Service
│   ├── contact.service.ts       # Contact Inquiry Service
│   ├── service.service.ts       # Services Catalog Service
│   ├── portfolio.service.ts     # Portfolio Showcase Service
│   ├── blog.service.ts          # Blog Article CMS Service
│   ├── email.service.ts         # Transactional Email Dispatcher
│   └── media.service.ts         # File Upload Storage Service
├── lib/                         # Shared Utilities & Validations
│   ├── validations/             # Shared Zod Schemas (quote.schema.ts, blog.schema.ts)
│   ├── db.ts                    # Prisma Client Singleton
│   └── utils.ts                 # Utility Helper Functions
├── prisma/                      # Database Schema & Migrations
│   ├── schema.prisma            # Prisma Relational Model Definition
│   └── seed.ts                  # Development Seed Script
├── public/                      # Static Assets (Logos, Placeholders)
└── docs/                        # Project Documentation
    ├── PRD.md                   # Product Requirements Document
    └── ARCHITECTURE.md          # System Architecture Specification (This Document)
```

---

## 33. END-TO-END DATA FLOW EXAMPLES

### 33.1 Example 1: Visitor Quote Request Submission

```text
Visitor (Browser)
    │  Fills interactive quote form on /quote
    ▼
React Hook Form + Zod Client Validation
    │  Client validation passes
    ▼
HTTP POST /api/quotes Payload
    │
    ▼
Route Handler (`app/api/quotes/route.ts`)
    │  Executes Zod Server Validation & Spam Rate-Limit Check
    ▼
QuoteService.createQuoteRequest(sanitizedData)
    │
    ├── 1. Prisma Query: Insert Quote record into PostgreSQL (Status: NEW)
    ├── 2. EmailService.sendAdminQuoteAlert(quoteDetails)
    └── 3. EmailService.sendCustomerQuoteConfirmation(customerEmail)
    │
    ▼
Return HTTP 201 Created JSON Response
    │
    ▼
UI Displays Clear Success Confirmation View
```

### 33.2 Example 2: Admin Service Catalog Edit

```text
Admin User (Browser)
    │  Edits Service details in /admin/services modal & submits
    ▼
HTTP PUT /api/admin/services/[id] (With HttpOnly Session Cookie)
    │
    ▼
Middleware Validation (Verifies Admin Authenticated Session)
    │
    ▼
ServiceService.updateService(serviceId, updatedData)
    │
    ├── 1. Prisma Query: Update Service record in PostgreSQL
    └── 2. Revalidation Call: revalidateTag('services')
    │
    ▼
Return HTTP 200 OK JSON Response
    │
    ▼
Next.js Cache Invalidated -> Public /services displays updated service details instantly
```

---

## 34. ARCHITECTURE DECISION RECORDS (ADRs)

### ADR-01: Adoption of Next.js Full-Stack App Router over Separate Frontend/Backend
* **Decision:** Implement a unified Next.js Full-Stack architecture rather than splitting into separate React SPA and Express API repositories.
* **Reason:** Eliminates duplicate type definitions, simplifies deployment to a single hosting target, removes CORS issues, and provides native Server Components for superior SEO and performance.
* **Alternatives Considered:** React SPA + Express REST API.
* **Why Rejected:** Higher operational complexity, dual deployment management, and slower initial page load times for marketing visitors.

### ADR-02: PostgreSQL with Prisma ORM
* **Decision:** Use PostgreSQL as the primary database with Prisma ORM as the query builder.
* **Reason:** Ensures strong relational integrity across leads, services, and content. Prisma provides compile-time type safety and automated migration workflows.
* **Alternatives Considered:** MongoDB / Mongoose.
* **Why Rejected:** MongoDB lacks rigid relational constraints, risking data inconsistency across CMS entities and quote statuses.

### ADR-03: Modular Monolith Architecture
* **Decision:** Structure code as a Modular Monolith within a single repository.
* **Reason:** Matches Neatly MVP requirements perfectly while avoiding the massive operational overhead of microservices.
* **Alternatives Considered:** Microservices Architecture.
* **Why Rejected:** Vastly over-engineered for a single-business website, causing network latency and unnecessary infrastructure costs.

### ADR-04: Custom Cookie-Based Session Auth for Admin
* **Decision:** Build a lightweight, custom session authentication mechanism using `bcrypt` and `HttpOnly` cookies.
* **Reason:** Neatly MVP requires authentication strictly for single-admin operations. Third-party auth providers (Auth0, Clerk, NextAuth) add unnecessary external service lock-in, vendor fees, and complexity.
* **Alternatives Considered:** NextAuth.js / Clerk.
* **Why Rejected:** Unnecessary complexity and external dependencies for a single admin role.

### ADR-05: GSAP + Lenis + Motion Animation Stack
* **Decision:** Combine Lenis (smooth scroll), GSAP ScrollTrigger (scroll reveals), and Motion (UI state transitions).
* **Reason:** Provides a world-class, fluid animation experience matching the high-trust, calm brand positioning.
* **Alternatives Considered:** Pure CSS animations only.
* **Why Rejected:** CSS alone cannot handle complex scroll-linked timelines or smooth scroll normalization effectively.
* **Scoped exception:** The landing Featured Work gallery uses Swiper.js for centered drag/swipe slides with autoplay. Lenis remains the page scroller (`data-lenis-prevent` on the carousel). GSAP does not drive Swiper. Do not add a second carousel library.

---

## 35. FUTURE SYSTEM SCALABILITY

While engineered specifically for the MVP, Neatly's architecture can evolve gracefully:
* **Phase 2 (Growth):** Add background job queues (Redis + BullMQ) for asynchronous email retries and schedule automated reminders.
* **Phase 3 (Platform Expansion):** Introduce a Customer Dashboard and Cleaner Mobile Portal by extending the domain modules without rewriting core database schemas.

---

## 36. ARCHITECTURAL CONSTRAINTS

1. **Strict Scope Control:** No workforce management, payroll, live GPS tracking, or payment gateways in MVP.
2. **Zero Direct DB Access from Components:** UI components MUST NOT call Prisma directly.
3. **No Unvalidated Inputs:** Every API route and form submit MUST pass Zod schema checks.
4. **No Secrets Leakage:** No server secret environment variables prefixed with `NEXT_PUBLIC_`.
5. **No Visual Compromises on Accessibility:** Animations must yield to `prefers-reduced-motion`.

---

## 37. DEFINITION OF DONE — ARCHITECTURE

The technical architecture is complete and validated when:
- [x] All PRD features have a clear technical implementation pattern.
- [x] Modular Monolith layer boundaries and file structures are defined.
- [x] Public marketing and protected admin architectures are specified.
- [x] Zod validation, error handling, and security boundaries are established.
- [x] Custom session authentication engine is designed.
- [x] Technology choices are fully documented via Architecture Decision Records (ADRs).
- [x] Zero extraneous microservices or unnecessary infrastructure items are introduced.
