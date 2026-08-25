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
* **Default Adapter:** Resend (or SendGrid / Brevo via environment configuration).

### 3.8 File & Media Storage
* **Abstraction:** `StorageProvider` interface supporting local disk storage (development) and cloud object storage (Cloudinary / AWS S3 / UploadThing for production).

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
        │   (Prisma ORM)   │    │ (Resend/SendGrid)│   │ (Cloudinary/S3)  │
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
| `/quote` | Static / RSC | Services List (for dropdown) | Static + Interactive Client Form |
| `/privacy`, `/terms`| Static | Legal Copy | Static Build Time |

---

## 9. ADMIN DASHBOARD ARCHITECTURE

The Admin application is completely isolated from public views under the `/admin` path:

```text
Admin Route Hierarchy (Protected via Middleware)
├── /admin/login            -> Unprotected Sign-in Form
├── /admin/forgot-password  -> Unprotected Reset Link Request
└── /admin/ (Protected Layout with Admin Sidebar & Topbar)
    ├── /admin              -> Dashboard Overview Widgets & Metrics
    ├── /admin/quotes       -> Pipeline Table (Filter by status, view, update status, notes)
    ├── /admin/contacts     -> Message Inbox Table (View message, toggle read/archive)
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
      "details": [
        { "field": "email", "issue": "Invalid email address format" }
      ]
    },
    "timestamp": "2026-08-25T20:12:43.000Z"
  }
  ```

### 11.2 Public API Endpoints
* `POST /api/quotes` — Submit a new quote request (Rate-limited, honeypot protected).
* `POST /api/contact` — Submit a general contact message (Rate-limited, honeypot protected).
* `POST /api/newsletter` — Subscribe email to newsletter.
* `GET  /api/services` — Fetch active public services.
* `GET  /api/portfolio` — Fetch active public portfolio items.
* `GET  /api/testimonials` — Fetch active featured testimonials.
* `GET  /api/blog` — Fetch published blog posts (supports pagination & category filters).

### 11.3 Protected Admin API Endpoints (`/api/admin/*`)
* `POST /api/admin/auth/login` — Authenticate admin credentials and set session cookie.
* `POST /api/admin/auth/logout` — Invalidate session and clear session cookie.
* `GET  /api/admin/quotes` — List quotes with status filtering.
* `PATCH /api/admin/quotes/[id]` — Update quote status or append internal notes.
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
* **Environment Variables:** Zod schema validation runs on application boot (`/env.mjs`) to verify required environment variables (`DATABASE_URL`, `SESSION_SECRET`, `EMAIL_API_KEY`) exist before server start.

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
                         Zod Server-Side Validation
                                    │
                         AuthService.validateCredentials()
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
              [Password Match]            [Password Mismatch]
                     │                             │
       Generate Crypto Session Token      Increment Rate Limit Counter
                     │                             │
       Persist Session Record in DB       Return HTTP 401 Error
                     │
       Set HttpOnly, Secure Cookie
                     │
       Redirect to /admin Dashboard
```

### Technical Controls
* **Password Hashing:** `bcrypt` with a minimum cost factor of 12.
* **Session Cookie Configuration:**
  * `HttpOnly: true` (Prevents client-side JavaScript access via `document.cookie`).
  * `Secure: true` (Mandates HTTPS transport in production).
  * `SameSite: Strict` (Protects against CSRF attacks).
  * `Path: /`
  * `Max-Age: 604800` (7-day session validity).

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
  * `LocalBusiness` schema on Home & Contact pages.
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
GitHub Repo (main branch)
       │  (Git Push / PR Merge)
       ▼
CI Pipeline Execution (Lint, Typecheck, Unit Tests)
       │
       ▼  (Build Check Passes)
Automated Database Migration Check (`prisma migrate deploy`)
       │
       ▼
Production Build & Deployment (Vercel / Managed Next.js Host)
       │
       ▼
Live Production Site + Automated Smoke Test Verification
```

---

## 31. ENVIRONMENT MANAGEMENT

| Variable Name | Environment Scope | Description | Exposed to Client? |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Server Only | PostgreSQL connection string | ❌ NO |
| `SESSION_SECRET` | Server Only | Secret string for session token hashing | ❌ NO |
| `EMAIL_API_KEY` | Server Only | API key for Resend/SendGrid provider | ❌ NO |
| `STORAGE_API_KEY` | Server Only | API key for Cloudinary/S3 storage | ❌ NO |
| `NEXT_PUBLIC_SITE_URL`| Client + Server | Public canonical URL (e.g., `https://neatly.com`) | ✅ YES |

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
│   │   └── terms/page.tsx       # Terms of Service
│   ├── admin/                   # Protected Admin Route Group (Shared Admin Layout)
│   │   ├── login/page.tsx       # Admin Login Form
│   │   ├── page.tsx             # Admin Dashboard Overview
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
