# Neatly - Production Product Requirements Document (PRD)

---

## 1. DOCUMENT HEADER

* **Product:** Neatly
* **Tagline:** Clean, minimal, high-trust
* **Version:** 1.0
* **Status:** Product Definition
* **Document Purpose:** This Product Requirements Document (PRD) defines the foundational product specification, visual and architectural requirements, user experience standards, administrative capabilities, and functional boundary definitions for Neatly. It serves as the authoritative blueprint for product managers, software engineers, UI/UX designers, and quality assurance engineers.
* **Last Updated:** August 25, 2026
* **Scope:** Full-stack marketing platform and management portal (MVP and multi-phase product roadmap).

---

## 2. PRODUCT OVERVIEW

### 2.1 Product Definition
**Neatly** is a premium, production-grade marketing website and management platform designed specifically for professional residential and commercial cleaning services. Neatly functions as a high-converting digital front door that establishes immediate trust, clearly presents specialized cleaning solutions, provides transparent scope expectations, and captures qualified lead requests through a seamless interactive quote system.

Neatly is engineered as a real production business system, not a portfolio concept or generic template demo. It combines a client-facing high-performance web experience with an internal management backend that allows business owners to process incoming leads and manage operational content without software engineering intervention.

### 2.2 Business Problem Solved
The professional cleaning industry frequently suffers from low customer trust due to fragmented branding, opaque pricing, ambiguous scope inclusions, and poorly designed contact methods. Potential customers struggle to distinguish legitimate, insured, high-standard cleaning professionals from unverified independent operators. On the operational side, cleaning business owners lack modern digital workflows, often relying on unorganized emails, SMS messages, or rigid phone calls to capture and track custom quote requests.

Neatly solves these problems by providing:
1. A calm, clean, minimal digital presence that projects authority, reliability, and premium service quality.
2. Clear service breakdowns detailing exactly what is included in each cleaning package to eliminate scope friction.
3. An intuitive, multi-step quote request pipeline that captures necessary property details upfront.
4. A centralized administrative management platform to track incoming leads, update service offerings, publish proof-of-work, handle customer testimonials, and edit blog posts.

### 2.3 Why Trust and Premium Experience Matter
Cleaning services require physical access to a client’s most personal spaces—their homes and offices. Consequently, **trust is the primary converting factor** in a customer's decision-making process. 
* **Visual Hierarchy & Minimalism:** A cluttered or visually aggressive UI signals operational chaos. Conversely, a clean, spacious, and deliberate interface sub-consciously communicates precision, meticulous attention to detail, and organizational care.
* **Conversion Architecture:** Visitors are converted into active leads by guiding them through credibility indicators (verified reviews, before/after proof of work, clear service standards) directly into low-friction quote request entry points.

---

## 3. PRODUCT VISION

### 3.1 Vision Statement
> *Neatly aims to become the gold-standard digital front door and management system for high-trust professional cleaning services—where customers seamlessly discover, evaluate, and request customized cleaning solutions through a modern, calm, and effortless experience.*

### 3.2 Core Vision Principles
1. **Calm Authority:** Clean UI design that reduces cognitive load and allows the quality of work and service clarity to lead the user journey.
2. **Transparent Scope:** Total clarity regarding what is included in every service package, avoiding hidden surprises or vague promises.
3. **Frictionless Lead Flow:** Streamlined quote requests that ask for essential details without frustrating the prospect with unnecessary barriers.
4. **Empowered Business Control:** Complete administrative autonomy over marketing copy, services, customer testimonials, blog articles, and lead workflows.

---

## 4. BRAND POSITIONING

### 4.1 Brand Personality Traits
Neatly’s visual tone and communicative design adhere strictly to ten attributes:
* **Clean:** Uncluttered layouts, generous whitespace, sharp typography.
* **Minimal:** Purposeful design elements; no decorative fluff or unnecessary UI embellishments.
* **Calm:** Soothing palette, balanced contrast, non-intrusive motion.
* **Premium:** Refined typography, crisp high-resolution media, high-end finishing details.
* **Reliable:** Clear guarantees, predictable layout structures, dependable form interactions.
* **Trustworthy:** Prominent reviews, real before/after proof, clear business identities.
* **Professional:** Courteous tone of voice, structured information architecture.
* **Human:** Warm, approachable copy that emphasizes human care and professional hygiene.
* **Modern:** Contemporary design systems, smooth layout transitions, mobile-first design.
* **Approachable:** Simple navigation, transparent service tiers, zero jargon.

### 4.2 Aesthetics to Explicitly Avoid
To protect brand equity, the application MUST NOT utilize:
* Cheap, generic clip-art or low-resolution stock photography.
* Loud, neon, or overly aggressive gradients.
* Visual clutter or excessive density of information.
* Jittery, distracting, or constant looping background animations.
* Generic SaaS UI templates (e.g., dark-mode purple grid themes, floating 3D icons).
* Overly playful or cartoonish UI illustrations.
* Dark, heavy, or intimidating color schemes.
* Heavy glassmorphism with unreadable text contrast.

### 4.3 Core Brand Promise
Neatly promises top-tier, reliable cleaning execution backed by professional staff, transparent communication, uncompromising quality standards, and absolute respect for customer property.

---

## 5. TARGET USERS

### 5.1 Residential Customers (Primary MVP Audience)
Homeowners, apartment renters, and busy professionals seeking trustworthy home maintenance:
* **Recurring Home Cleaning:** Bi-weekly, weekly, or monthly ongoing domestic maintenance.
* **Deep Cleaning:** Intensive top-to-bottom detail cleaning for seasonal refreshes.
* **Move-In / Move-Out Cleaning:** Thorough sanitization and detail cleaning for real estate transitions.
* **One-Time Specialty Cleaning:** Event prep, post-renovation cleanup, or custom single visits.

### 5.2 Commercial Customers (Secondary MVP Audience)
Local business managers and office administrators requiring reliable operational cleaning:
* **Office Cleaning:** Small to medium corporate office spaces requiring after-hours sanitization.
* **Commercial Maintenance:** Retail storefronts, boutique studios, and professional suites.
* **Recurring Commercial Contracts:** Scheduled daily or multi-day weekly maintenance agreements.

### 5.3 Property-Related Customers (Future Expansion Scope)
Specialized property operators with distinct logistical requirements:
* **Short-Term Rental / Airbnb Operators:** Quick turnarounds, linens reset, guest-ready inspections.
* **Property Managers & Landlords:** Multi-unit turnovers, common area sanitization.
* **Real Estate Agents:** Open-house presentation prep and staging cleanups.

---

## 6. USER PROBLEMS & SOLUTION MAPPING

| User Problem | Root Cause | Neatly Solution |
| :--- | :--- | :--- |
| **"I don't know what type of cleaning I need."** | Ambiguous service definitions across competitor sites. | Dedicated Service Pages with explicit checklists detailing exactly what is included per package. |
| **"Can I trust these people inside my home?"** | Fear of theft, property damage, or unvetted personnel. | Prominent trust indicators: verified customer reviews, before/after project showcases, insurance/guarantee notices. |
| **"Getting a price quote takes too long."** | Requiring phone calls or filling out 20-field forms. | Interactive step-by-step Quote Request form asking only for essential property and service criteria. |
| **"I got charged extra for basic tasks."** | Hidden fees and unstated scope limits. | Transparent service breakdowns detailing standard inclusions vs. specialized add-on options. |
| **"Businesses struggle to manage incoming web leads."** | Scattered contact form submissions in email spam folders. | Centralized Admin Management Dashboard tracking quote requests with distinct pipeline statuses. |
| **"Updating site content requires a developer."** | Static hardcoded websites. | Admin CMS modules to manage services, portfolio items, testimonials, and blog posts dynamically. |

---

## 7. PRODUCT GOALS

### 7.1 Business Goals
* **Maximize Lead Generation:** Achieve a high conversion rate of unique visitors submitting qualified quote requests.
* **Establish Brand Premium:** Position the service to command top-market pricing through high-trust presentation.
* **Centralize Operations:** Eliminate lost leads by centralizing contact and quote submissions into an internal dashboard.
* **Reduce Sales Friction:** Pre-educate prospects on scope and service value before initial outreach.

### 7.2 User Goals
* **Fast Understanding:** Determine service offerings, quality standards, and coverage areas within 10 seconds of landing.
* **Effortless Contact:** Complete a quote request in under 90 seconds on mobile or desktop devices.
* **Peace of Mind:** Verify company credibility through authentic customer feedback and visible work quality.

### 7.3 Product & Performance Goals
* **Lightning Performance:** Achieve Core Web Vitals targets (LCP < 1.8s, INP < 100ms, CLS < 0.05).
* **Flawless Mobile Experience:** 100% responsive design optimized for touch navigation and small viewports.
* **Zero Administrative Friction:** Allow administrators to update CMS content or update lead statuses in under 3 clicks.

---

## 8. NON-GOALS (MVP BOUNDARIES)

To keep the MVP tightly focused on lead generation, conversion, and business content management, the following features are **explicitly excluded** from the MVP release:
* ❌ Full employee workforce management or cleaner rostering.
* ❌ Employee payroll, tip distribution, or wage calculations.
* ❌ Complex external CRM integrations (e.g., Salesforce, HubSpot).
* ❌ Native iOS or Android customer mobile applications.
* ❌ Real-time cleaner GPS tracking or live ETA maps.
* ❌ Complex route optimization or dispatcher map tools.
* ❌ Multi-vendor or multi-company marketplace capabilities.
* ❌ AI-powered conversational chatbots or automated assistants.
* ❌ In-app credit card processing/checkout during initial quote request (pricing remains quote-based; payments happen post-quote offline or in Phase 3).

---

## 9. MVP SCOPE MATRIX

### 9.1 Public Marketing Website
* **Home Page:** High-converting landing page with Hero, Trust Indicators, Why Neatly, Services Overview, Featured Work, Process Steps, Stats, Testimonials, CTA, Blog Highlights, Newsletter, and Footer.
* **About Page:** Brand story, company mission, quality guarantees, team/service standards, safety protocols.
* **Services Index Page:** Grid view of all active cleaning services with high-level descriptions.
* **Service Detail Pages (`/services/[slug]`):** Dedicated pages for individual services with scope checklists, FAQs, and quote CTAs.
* **Portfolio Page (`/portfolio`):** Visual showcase of real cleaning projects with category filtering and before/after comparisons.
* **Blog Index & Detail Pages (`/blog`, `/blog/[slug]`):** Content marketing hub for cleaning guides, home maintenance tips, and company updates.
* **Contact Page (`/contact`):** Direct communication page featuring business contact info, operating hours, service map, and general contact form.
* **Quote Request Page (`/quote`):** Dedicated interactive quote request flow.
* **Legal Pages (`/privacy`, `/terms`):** Plain-language compliance pages for privacy policy and terms of service.

### 9.2 Lead & Customer Management System
* **Quote Request Handling:** Form validation, rate limiting, anti-spam mechanisms, database storage, email notifications.
* **Contact Message Handling:** Submission processing, validation, database logging, admin email alerts.
* **Newsletter Subscription System:** Email verification, duplicate prevention, unsubscribe compliance.

### 9.3 Administrative System (CMS & Dashboard)
* **Admin Authentication:** Secure login, logout, password reset flow, session protection.
* **Dashboard Overview:** Metric cards (New Quotes, Pending Contacts, Active Services, Published Posts) and recent activity stream.
* **Quote Request Management:** List, filter by status, view detailed breakdown, update request status, add internal notes.
* **Contact Message Management:** List, view message details, mark as read/archived.
* **Service CMS:** Create, edit, publish/unpublish, reorder, delete service packages.
* **Portfolio CMS:** Create, edit, publish/unpublish, attach before/after images, delete portfolio items.
* **Testimonials CMS:** Create, edit, feature, publish/unpublish customer reviews.
* **Blog CMS:** Draft, edit, publish/unpublish, category assign, delete articles with rich text editing capability.
* **Newsletter Subscriber Management:** View active subscribers, export subscriber list.
* **Site Settings:** Edit global business phone, email, address, operating hours, social links, and notification settings.

---

## 10. WEBSITE INFORMATION ARCHITECTURE

```text
Neatly Public Portal
├── / (Home)
├── /about (Company Story, Guarantees & Values)
├── /services (Services Directory)
│   └── /services/[slug] (Individual Service Scope & Quote CTA)
├── /portfolio (Work Showcase & Before/Afters)
├── /blog (Articles & Maintenance Insights)
│   └── /blog/[slug] (Article Detail Page)
├── /contact (Contact Info & General Inquiry Form)
├── /quote (Interactive Custom Quote Request)
├── /privacy (Privacy Policy)
└── /terms (Terms of Service)

Neatly Administrative Portal (Protected Routes)
├── /admin/login (Admin Sign-In)
├── /admin/forgot-password (Password Recovery)
├── /admin (Dashboard Overview & Key Business Metrics)
├── /admin/quotes (Quote Requests Management Pipeline)
├── /admin/contacts (General Inquiries Inbox)
├── /admin/services (Service Catalog CMS)
├── /admin/portfolio (Portfolio Showcase CMS)
├── /admin/testimonials (Customer Reviews CMS)
├── /admin/blog (Article & News CMS)
├── /admin/newsletter (Newsletter Subscriber List)
└── /admin/settings (Global Business Configuration)
```

---

## 11. HOMEPAGE REQUIREMENTS

The homepage is Neatly’s primary conversion tool. It must contain the following ordered sections:

### 11.1 Section Breakdown

| Section | Purpose | Primary Content | User Action | Conversion Goal | CMS Managed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Navbar** | Navigation & Branding | Logo, links, contact phone, primary CTA button. | Click link or CTA. | Navigate to target page or Quote flow. | Partial (Settings) |
| **2. Hero** | Value Prop & Hook | Headline, value prop copy, primary CTA, secondary link, trust badges, imagery. | Click "Get a Free Quote". | Enter Quote flow immediately. | Yes (Settings) |
| **3. Trust Indicators** | Immediate Credibility | Insured badge, verified reviews score, satisfaction guarantee icon, background check promise. | Scan trust badges. | Build psychological safety. | Yes (Settings) |
| **4. Why Neatly** | Differentiating Value | 3-4 feature pillars (Rigorous vetting, eco-friendly products, 100% satisfaction guarantee, transparent pricing). | Read core differentiators. | Establish competitive edge. | Yes (Settings) |
| **5. Services Summary** | Service Exploration | Grid of key service cards with descriptions and direct detail links. | Click "View Service". | Direct user to relevant service scope. | Yes (Services Module) |
| **6. Featured Work** | Proof of Quality | Before/After image slider or side-by-side comparison gallery of actual cleaning results. | Interact with before/after slider. | Validate work quality visually. | Yes (Portfolio Module) |
| **7. How It Works** | Process Clarity | 3-step simple process (1. Request Quote -> 2. Confirm Schedule -> 3. Enjoy Clean Space). | Review process steps. | Eliminate process ambiguity. | Yes (Settings) |
| **8. Statistics** | Social Proof | Counter statistics (e.g., 500+ Homes Cleaned, 99.4% Satisfaction Rate, 100% Insured Staff). | Read stats. | Reinforce operational scale. | Yes (Settings) |
| **9. Testimonials** | Authentic Advocacy | Carousel or grid of customer reviews with star ratings and verified badges. | Read customer reviews. | Leverage peer social proof. | Yes (Testimonials Module) |
| **10. Primary CTA Banner** | Final Conversion Push | Compelling conversion headline, short copy, prominent "Request Your Quote" button. | Click Quote CTA. | Convert remaining hesitant visitors. | Yes (Settings) |
| **11. Blog Highlights** | Authority & SEO | Grid of 3 latest blog posts with cover images, dates, and titles. | Click blog article. | Improve SEO dwell time & authority. | Yes (Blog Module) |
| **12. Newsletter** | Lead Capture | Minimal email capture input box with consent copy and subscribe button. | Enter email & submit. | Capture top-of-funnel leads. | No (System Form) |
| **13. Footer** | Navigation & Legal | Business address, phone, email, operating hours, nav links, social links, legal links, copyright. | Click footer links. | Provide secondary navigation & compliance. | Yes (Settings) |

---

## 12. NAVBAR REQUIREMENTS

* **Logo:** Brand name "Neatly" in clean typography with a subtle minimal iconography element. Clicking logo returns to `/`.
* **Desktop Navigation Links:** `About`, `Services`, `Portfolio`, `Blog`, `Contact`.
* **Primary Action CTA:** "Get a Quote" button highlighted in primary accent styling.
* **Behavior:** Sticky navigation bar fixed to the top of the screen on scroll. Transitions smoothly from transparent/light background to elevated solid state upon scrolling down past 20px.
* **Mobile Navigation:** Responsive hamburger menu icon triggering a clean slide-over drawer or full-screen overlay menu. Must contain all navigation links, business contact phone number, and a full-width "Get a Quote" CTA button.
* **Accessibility:** Full keyboard accessibility (Tab focus), correct ARIA attributes (`aria-expanded`, `aria-label`), visible focus states.

---

## 13. HERO SECTION REQUIREMENTS

The Hero section MUST immediately answer four critical customer questions within 5 seconds of viewing:
1. **What is Neatly?** A premium, trustworthy professional cleaning service.
2. **What service does it provide?** Residential and commercial cleaning customized to the property's needs.
3. **Why trust Neatly?** Insured team, satisfaction guaranteed, vetted professionals.
4. **What should the customer do next?** Request a customized price quote.

### Hero Layout & Elements
* **Headline:** Bold, clear headline focusing on peace of mind and pristine cleanliness (e.g., *"Pristine Spaces. Effortless Living."*).
* **Supporting Message:** 2-3 lines explaining the high standards, eco-friendly practices, and reliability of Neatly.
* **Primary Action:** Prominent button labeled *"Request a Free Quote"* leading directly to `/quote`.
* **Secondary Action:** Ghost/Outline button labeled *"Explore Services"* pointing to `/services`.
* **Trust Badges:** Compact visual badges directly beneath CTAs (e.g., *"⭐ 4.9/5 Rating from 250+ Clients"*, *"Shield Icon: Licensed & Insured"*).
* **Imagery:** High-definition, bright, warm photography or visual showcasing a immaculate, modern living room or clean professional office space.

---

## 14. SERVICES SYSTEM REQUIREMENTS

Services are dynamic business offerings managed via the internal Admin CMS.

### 14.1 Supported Default Categories
* **Residential Cleaning:** Regular maintenance cleaning for apartments and single-family homes.
* **Deep Cleaning:** Comprehensive deep sanitization including baseboards, interior appliances, and detail scrubbing.
* **Move-In / Move-Out Cleaning:** Transition cleaning to ensure properties meet tenancy or sale standards.
* **Commercial Cleaning:** Custom office space, retail, and workplace maintenance.
* **Recurring Cleaning:** Scheduled recurring services (Weekly, Bi-Weekly, Monthly) with recurring benefits.

### 14.2 Service Data Structure Attributes
Each service entity managed in the system MUST support:
* `name`: Service title (e.g., "Deep Home Sanitization").
* `slug`: Unique URL-friendly string (e.g., `deep-home-sanitization`).
* `shortDescription`: Concise 1-2 sentence summary for index cards.
* `fullDescription`: Comprehensive multi-paragraph explanation of the service.
* `benefits`: List of core benefits (e.g., "Removes allergen buildup", "Saves 6 hours weekly").
* `includedTasks`: Categorized checklist of explicit tasks included in standard delivery.
* `excludedTasks`: Clear list of non-included or specialized add-on tasks.
* `image`: High-res hero image URL and alt text.
* `faqs`: List of service-specific Question & Answer pairs.
* `seoTitle` & `seoDescription`: Meta information for search engine optimization.
* `isActive`: Boolean status to display or hide the service on the public website.
* `displayOrder`: Integer for controlling card order on the Services page.

---

## 15. SERVICE DETAIL PAGES (`/services/[slug]`)

Each active service MUST dynamically generate a detailed page with the following structure:
1. **Service Hero:** Title, short description, primary "Request Quote for [Service Name]" CTA button, cover photo.
2. **Key Benefits Grid:** Visual cards illustrating core advantages of choosing this service package.
3. **Detailed Inclusion Checklist:** Interactive or categorized list of everything included (e.g., Kitchen Scope, Bathroom Scope, Living Room Scope).
4. **Scope Boundaries:** Clear statement on what requires an add-on request (e.g., exterior window washing, carpet steaming).
5. **Process Timeline:** Step-by-step overview of how the service is performed from arrival to final walk-through.
6. **Service FAQs:** Accordion displaying answers to common service-specific questions.
7. **Related Services:** Cards linking to complementary cleaning packages.
8. **Bottom Quote CTA:** Embedded mini-quote trigger or prominent button leading to `/quote?service=[slug]`.

*Note: Public exact pricing is NOT displayed on service pages by default unless configured by the admin, as cleaning costs depend on square footage and property condition.*

---

## 16. QUOTE REQUEST SYSTEM

The Quote Request System is Neatly's primary lead-capture engine.

```text
Visitor enters /quote
  │
  ├── 1. Selects Service Type (Residential, Deep, Move-In/Out, Commercial)
  ├── 2. Specifies Property Criteria (Sq Ft, Bedrooms, Bathrooms, Frequency)
  ├── 3. Adds Optional Add-ons & Special Instructions
  ├── 4. Inputs Contact & Location Info (Name, Email, Phone, Address/Zip)
  └── 5. Submits Request
        │
        ├── Client-Side & Server-Side Validation
        ├── Spam Protection & Rate Limiting Check
        ├── Database Persistence (Status: NEW)
        ├── Email Alert sent to Admin
        └── Confirmation Email sent to Customer
```

### 16.1 Required Form Fields

| Field Name | Type | Options / Constraints | Required |
| :--- | :--- | :--- | :--- |
| `serviceType` | Dropdown / Cards | Residential, Deep Clean, Move-In/Out, Commercial, Custom | Yes |
| `propertyType` | Radio / Buttons | House, Apartment, Condo, Office, Commercial Space | Yes |
| `approximateSize` | Select Range | Under 1,000 sq ft, 1,000-2,000 sq ft, 2,000-3,500 sq ft, 3,500+ sq ft | Yes |
| `bedrooms` | Counter / Select | 0 (Studio), 1, 2, 3, 4, 5+ | Yes (if Residential) |
| `bathrooms` | Counter / Select | 1, 1.5, 2, 2.5, 3, 3.5+ | Yes (if Residential) |
| `frequency` | Radio / Buttons | One-time, Weekly, Bi-Weekly, Monthly | Yes |
| `preferredDate` | Date Picker | Future date selection (min: +24 hours) | Yes |
| `preferredTime` | Select | Morning (8am-12pm), Afternoon (12pm-4pm), Evening (4pm-8pm) | Yes |
| `fullName` | Text Input | Min 2 characters | Yes |
| `email` | Email Input | Valid email address format | Yes |
| `phone` | Phone Input | Valid phone number format | Yes |
| `serviceAddress` | Text Input | Street address or City/Zip Code | Yes |
| `additionalNotes` | Textarea | Max 1,000 characters | No |

### 16.2 Technical & Security Requirements
* **Client-Side Validation:** Instant inline error messages for missing fields or malformed emails.
* **Server-Side Validation:** Strict re-validation of all fields on API payload receipt.
* **Spam Prevention:** Honeypot hidden input field + Rate limiting (maximum 3 requests per IP per 15 minutes).
* **Persistence:** Immediate recording into the system database.
* **Notifications:** Synchronous trigger of admin alert email + customer confirmation receipt.

### 16.3 Quote Lifecycle Statuses
Every quote request in the database MUST adhere strictly to one of seven standardized statuses:
1. `NEW`: Request submitted by visitor; pending initial admin review.
2. `REVIEWING`: Admin is reviewing property scope and preparing an estimate.
3. `CONTACTED`: Admin has reached out to customer via phone or email for clarification.
4. `QUOTED`: Formal price estimate has been delivered to customer.
5. `CONVERTED`: Customer accepted quote and scheduled service (Lead won).
6. `DECLINED`: Customer rejected quote or canceled request.
7. `CLOSED`: Archive status for completed or stale leads.

---

## 17. CONTACT SYSTEM

The General Contact System handles non-quote inquiries.

### 17.1 Form Fields
* `fullName`: Full name (Required).
* `email`: Email address (Required).
* `phone`: Contact phone number (Optional).
* `subject`: Subject dropdown or short text (Required).
* `message`: Detailed message body (Required, min 10 chars, max 2,000 chars).

### 17.2 Requirements
* Anti-spam honeypot + rate limiting (max 5 contact submissions per IP per 15 mins).
* Database persistence with `unread` / `read` / `archived` states.
* Immediate email notification to the site administrator.
* Clean visual success banner on the UI upon completion without requiring page reload.

---

## 18. PORTFOLIO / WORK SHOWCASE

To provide visual proof of cleaning standards, Neatly includes a dedicated Portfolio system.

### 18.1 Portfolio Item Attributes
* `title`: Project title (e.g., "Downtown Loft Deep Clean").
* `category`: Categorization (Residential, Deep Clean, Commercial, Move-Out).
* `description`: Short paragraph detailing the challenge and cleaning outcome.
* `beforeImage`: High-resolution URL of pre-cleaning state.
* `afterImage`: High-resolution URL of post-cleaning state.
* `location`: General city or neighborhood (e.g., "North Suburbs").
* `isFeatured`: Boolean flag to display on homepage showcase slider.
* `displayOrder`: Integer order.

### 18.2 UI Interaction
* Interactive Before/After slider allowing visitors to drag a divider horizontally across images to compare visual results.
* Filterable portfolio grid on `/portfolio` by category.

---

## 19. TESTIMONIALS SYSTEM

Authentic customer reviews build essential social proof.

### 19.1 Testimonial Data Attributes
* `customerName`: Full or first-name + last initial (e.g., "Sarah M.").
* `customerRole`: Location or context (e.g., "Homeowner in Westside").
* `rating`: Integer star rating (1 to 5 stars, default: 5).
* `testimonial`: Detailed written review text.
* `avatarImage`: Optional customer headshot URL.
* `serviceRendered`: Link to associated Service category.
* `isFeatured`: Boolean flag for homepage highlight.
* `isActive`: Boolean flag for public visibility.

### 19.2 Governance
* All public testimonials must be added or explicitly approved by the admin.
* **Strict Constraint:** Fabricated or deceptive fake reviews are forbidden.

---

## 20. BLOG & CONTENT SYSTEM

The Blog drives content marketing, domain authority, and organic search traffic.

### 20.1 Blog Post Attributes
* `title`: Article title (e.g., "10 Essential Deep Cleaning Tips for Spring").
* `slug`: Unique SEO-friendly URL slug.
* `excerpt`: Concise summary for list views.
* `content`: Rich text or Markdown body content.
* `coverImage`: Featured header image URL and alt text.
* `authorName`: Author name (default: "Neatly Editorial Team").
* `category`: Article category (e.g., "Home Care", "Commercial", "Cleaning Tips").
* `tags`: Array of string keywords.
* `publishedAt`: Timestamp of publication.
* `status`: Article state (`DRAFT`, `PUBLISHED`, `ARCHIVED`).
* `seoTitle` & `seoDescription`: Custom meta values.

### 20.2 Admin Capabilities
* Rich Text Editor for composing articles with headings, bullet points, quotes, and inline images.
* Complete CRUD operations (Create, Read, Update, Delete).

---

## 21. NEWSLETTER SUBSCRIPTION SYSTEM

Minimal top-of-funnel email capture mechanism.
* **Form Location:** Homepage footer banner & Blog index page sidebar.
* **Fields:** Single `email` input box.
* **Validation:** RFC 5322 email syntax validation.
* **Duplicate Protection:** Graceful notice if email is already subscribed without revealing database errors.
* **Admin Visibility:** View subscriber list and export to CSV in Admin panel.

---

## 22. ADMIN DASHBOARD

The Admin Portal is a protected, responsive management dashboard for business operations.

```text
Admin Dashboard Layout
├── Sidebar Navigation (Quotes, Messages, Services, Portfolio, Testimonials, Blog, Subscribers, Settings)
├── Top Bar (Search, Quick Stats, Admin Profile, Logout Button)
└── Main Content View (Dynamic Module Screens)
```

### 22.1 Core Metrics Overview Widgets
* **New Quote Requests:** Count of quotes with status `NEW` (with indicator for past 24 hours).
* **Pending Inquiries:** Count of unread contact messages.
* **Active Services:** Total count of live published services.
* **Published Articles:** Total count of live blog posts.
* **Recent Activity Feed:** Real-time chronological list of incoming quotes and contact submissions.

### 22.2 Admin Sub-Modules

```text
/admin/quotes        -> Pipeline view of all quote submissions with status updates.
/admin/contacts      -> Message inbox with read/archive toggle.
/admin/services      -> CRUD manager for service offerings.
/admin/portfolio     -> Manager for before/after portfolio items.
/admin/testimonials  -> Manager for customer reviews.
/admin/blog          -> Rich text article editor & publisher.
/admin/newsletter    -> Subscriber list table with CSV export.
/admin/settings      -> Global business phone, email, address, working hours, social links.
```

---

## 23. ADMIN ROLES & AUTHORIZATION

* **MVP Scope:** Single secure `ADMIN` role with full system authorization across dashboard metrics, lead processing, content management, and system settings.
* **Future Extension Scope (Phase 2/3):**
  * `SUPER_ADMIN`: Full access + admin user creation.
  * `CONTENT_MANAGER`: Access limited to Blog, Portfolio, and Testimonials CMS.
  * `STAFF`: Access limited to viewing assigned Quote Requests.

---

## 24. AUTHENTICATION & SECURITY REQUIREMENTS

* **Authentication Method:** Secure email/password session or JWT cookie-based authentication.
* **Password Hashing:** Passwords MUST be hashed using industry-standard algorithms (e.g., bcrypt / Argon2). Plaintext password storage is strictly prohibited.
* **Session Protection:** Session tokens stored in `HttpOnly`, `Secure`, `SameSite=Strict` cookies to prevent XSS and CSRF attacks.
* **Password Reset Flow:** Secure token-based password reset via email link with a 60-minute expiration window.
* **Protected Routes:** All routes under `/admin/*` (except `/admin/login` and `/admin/forgot-password`) must strictly enforce authentication checks on the server side. Unauthorized access attempts must redirect to `/admin/login`.
* **Rate Limiting:** Maximum 5 failed login attempts per IP per 15 minutes before temporary lockout.

---

## 25. CMS & CONTENT MANAGEMENT REQUIREMENTS

| Content Category | Storage Type | Management Method | Update Frequency |
| :--- | :--- | :--- | :--- |
| **Services Catalog** | Dynamic Database | Admin CMS (`/admin/services`) | Monthly / As offerings expand |
| **Portfolio Showcase** | Dynamic Database | Admin CMS (`/admin/portfolio`) | Weekly / Post-project completions |
| **Customer Testimonials**| Dynamic Database | Admin CMS (`/admin/testimonials`) | Weekly / Upon client reviews |
| **Blog Articles** | Dynamic Database | Admin CMS (`/admin/blog`) | Weekly / Content marketing schedule |
| **Site Contact & Hours** | Dynamic Database | Admin CMS (`/admin/settings`) | Occasional / As business changes |
| **Brand Story & Values** | Static Code / CMS | Hardcoded or CMS Setting | Rare / Annual brand reviews |
| **Privacy Policy & Terms**| Static / CMS Page | Hardcoded or CMS Setting | Rare / Compliance updates |

---

## 26. SEO REQUIREMENTS

Search Engine Optimization MUST be integrated directly into the page architecture:
* **Page Titles:** Unique, descriptive titles for every page following the format: `[Page Title] | Neatly Professional Cleaning`.
* **Meta Descriptions:** Custom meta descriptions (150-160 characters) for every public route.
* **Canonical URLs:** Self-referential canonical tags on all pages to prevent duplicate content penalties.
* **Open Graph & Social Cards:** Og:title, og:description, og:image, and og:url tags configured for seamless link previews on social platforms.
* **Sitemap & Robots:** Automatically generated XML sitemap (`/sitemap.xml`) and `robots.txt` configuration.
* **Semantic HTML:** Strict adherence to semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<h1>`-`<h6>`).
* **Structured Data (JSON-LD):** LocalBusiness schema markup on homepage and contact pages detailing business type, location, opening hours, phone number, and service area. Service schema markup on service pages.
* **Image Alt Text:** All images must require meaningful accessibility and keyword-relevant `alt` text.

---

## 27. ACCESSIBILITY (WCAG 2.1 AA COMPLIANCE)

Neatly MUST comply with WCAG 2.1 Level AA accessibility standards:
* **Keyboard Navigation:** Every interactive element (buttons, links, form fields, modal triggers) must be fully navigable via the `Tab` key with visible visual focus indicators (`outline`).
* **Form Labeling:** All inputs must have explicitly linked `<label>` elements or valid `aria-label` attributes.
* **Color Contrast:** Text-to-background contrast ratio must meet or exceed 4.5:1 for normal text and 3:1 for large text.
* **Screen Reader Support:** Dynamic content updates (form errors, success banners) must use ARIA live regions (`aria-live="polite"`).
* **Reduced Motion:** All layout animations and scroll transitions must respect the user's OS preference (`@media (prefers-reduced-motion: reduce)`).
* **Heading Hierarchy:** Strict sequential order of headings (`<h1>` followed by `<h2>`, `<h3>`) with exactly one `<h1>` per page.

---

## 28. PERFORMANCE REQUIREMENTS

* **Core Web Vitals Targets:**
  * **Largest Contentful Paint (LCP):** < 1.8 seconds on standard 4G mobile connections.
  * **Interaction to Next Paint (INP):** < 100 milliseconds.
  * **Cumulative Layout Shift (CLS):** < 0.05.
* **Image Optimization:** Automated image resizing, lazy loading for below-the-fold assets, and delivery in modern formats (`WebP` / `AVIF`).
* **Font Optimization:** Standardized system font stack or self-hosted modern variable web fonts with `font-display: swap`.
* **Bundle Minimization:** Zero heavy non-essential JavaScript libraries.
* **Server-Side Rendering:** Server-render marketing pages to ensure instant initial HTML delivery and optimal crawling.

---

## 29. RESPONSIVE DESIGN BREAKPOINTS

Neatly must render flawlessly across five standardized viewport tiers:

```text
Breakpoint Tiers
├── Mobile Portrait    : 320px  - 479px   (Single column layout, sticky bottom mobile CTA)
├── Mobile Landscape   : 480px  - 767px   (Expanded padding, 2-column grid adjustments)
├── Tablet             : 768px  - 1023px  (2-column grids, drawer mobile menu)
├── Laptop             : 1024px - 1439px  (Full horizontal navigation, 3-column service grids)
└── Large Desktop      : 1440px+          (Max container width cap: 1280px centered)
```

### Critical Component Responsive Rules
* **Hero Section:** Stacks vertically on mobile viewports; switches to side-by-side split layout on laptop viewports.
* **Quote Form:** Converts multi-column input rows into single-column inputs on viewports under 768px.
* **Admin Dashboard:** Collapses sidebar into a top hamburger menu on tablet and mobile viewports.

---

## 30. ANIMATION & INTERACTION PRINCIPLES

Animations must feel **subtle, calm, fast, and purposeful**.

### 30.1 Approved Animation Frameworks
* GSAP / ScrollTrigger (for high-end scroll transitions and reveal triggers).
* Lenis (for soft smooth scroll behavior).
* Framer Motion / Native CSS Transitions (for state changes, micro-interactions, and accordion opens).

### 30.2 Execution Rules
* **Duration:** Micro-interactions (hover states, button clicks) must take between 150ms - 250ms. Page section reveals must take 400ms - 600ms maximum.
* **Easing:** Use clean cubic-bezier easing curves (e.g., `cubic-bezier(0.16, 1, 0.3, 1)`). Avoid elastic or bouncy easing curves.
* **No Blocking:** Animations must NEVER block form input, text readability, or navigation clicks.
* **Disabling:** All animations must automatically turn off when `prefers-reduced-motion` is active.

---

## 31. TRUST & CREDIBILITY ARCHITECTURE

Because Neatly is a service business requiring physical home access, trust signals are embedded into every page level:

```text
Trust Building Elements
├── 1. Insurance & Licensing Badge ("100% Bonded, Insured & Background-Checked")
├── 2. Satisfaction Guarantee Banner ("100% Reclean Guarantee within 24 Hours")
├── 3. Real Work Proof (Interactive Before/After Slider of actual jobs)
├── 4. Authentic Customer Reviews (Verified client testimonials with ratings)
├── 5. Clear Scope Checklists (Eliminating hidden fee anxiety)
└── 6. Real Business Information (Visible address, local phone number, operating hours)
```

---

## 32. SECURITY REQUIREMENTS

* **Input Sanitization:** All incoming user input (quote notes, contact messages, search queries) must be sanitized and escaped on the server side to prevent SQL Injection and Cross-Site Scripting (XSS).
* **Environment Secrets:** Secrets (database connection strings, API keys, session secrets) must be stored strictly in environment variables (`.env`) and NEVER exposed in client-side bundles or public git repositories.
* **CSRF & Security Headers:** Enforce strict CORS policies, content security policies (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.
* **File Upload Safety:** Portfolio and blog image uploads in Admin must validate MIME types (JPEG, PNG, WebP only), enforce maximum file size limits (max 5MB), sanitize filenames, and store files securely.
* **Error Handling:** Production errors must return generic user-facing messages (e.g., *"An unexpected error occurred. Please try again later."*) while logging detailed stack traces into secure server logs.

---

## 33. TRANSACTIONAL EMAIL SYSTEM

Neatly automatically triggers transactional emails via a configurable email service provider (e.g., Resend, SendGrid, Postmark).

### 33.1 Trigger Workflows

```text
Event: Quote Request Submitted
  ├── 1. Customer Email: Send "Quote Request Received" confirmation with submitted summary details.
  └── 2. Admin Email: Send "New Quote Lead Received" alert with direct link to /admin/quotes.

Event: Contact Form Submitted
  ├── 1. Customer Email: Send "Message Received" polite acknowledgment.
  └── 2. Admin Email: Send "New Contact Inquiry" notification with message contents.

Event: Admin Responds / Updates Status
  └── (Optional Phase 2) Customer Email: Send quote update or schedule confirmation link.
```

---

## 34. FILE & ASSET MANAGEMENT

* **Supported Formats:** `.webp`, `.png`, `.jpg`, `.svg`.
* **Size Restrictions:** Maximum 5MB per image upload in Admin CMS.
* **Optimization:** Automatic image compression and generation of responsive srcset sizes upon upload.
* **Alt Text Requirement:** Mandatory `alt` text entry field in CMS whenever an image is uploaded for blog or portfolio usage.

---

## 35. ANALYTICS & EVENT TRACKING

Neatly includes privacy-first event tracking for conversion monitoring:
* `quote_request_started`: Triggered when a visitor clicks into the quote flow.
* `quote_request_submitted`: Triggered when a quote request successfully submits.
* `contact_submitted`: Triggered when a general contact form submits.
* `phone_cta_clicked`: Triggered when a visitor clicks the phone link.
* `service_viewed`: Triggered when a service detail page is viewed.
* `blog_article_read`: Triggered when a user spends > 30s reading a blog post.

*Tracking must adhere strictly to privacy guidelines (GDPR/CCPA compliant) without storing unanonymized personal IP data.*

---

## 36. ERROR & STATE HANDLING UX MATRIX

Every async operation across both public and admin interfaces MUST support four distinct UI states:

| UI State | Public Experience | Admin Experience |
| :--- | :--- | :--- |
| **1. Loading** | Subtle inline spinner or non-shifting skeleton shimmer placeholder. | Minimal table skeleton loader. |
| **2. Success** | Smooth transition to clear success message banner / confirmation view. | Toast notification (e.g., "Service updated successfully"). |
| **3. Error** | Friendly inline message (e.g., "Unable to submit quote. Please check connection.") with retry button. | Detailed error banner with retry option. |
| **4. Empty** | Helpful fallback UI (e.g., "No blog posts found in this category yet."). | Empty state card with "Create New" action button. |

---

## 37. CONTENT SEPARATION GOVERNANCE

To preserve architectural clarity, content across Neatly is governed under three strict classifications:

1. **Static System Copy:** Hardcoded structural labels, navigation terms, legal terms (`/privacy`, `/terms`), and system error messages.
2. **CMS Dynamic Content:** Database-driven content editable via `/admin` (Services, Portfolio items, Blog posts, Testimonials, Newsletter subscribers).
3. **Business Profile Parameters:** Business phone number, physical address, working hours, service area list, insurance values, and social links (Managed in `/admin/settings`).

*Development Guidelines:* Developers must NEVER invent fake business facts or placeholder phone numbers in production code. Production configuration must ingest real parameters from system settings.

---

## 38. LEGAL & PRIVACY REQUIREMENTS

* **Privacy Policy (`/privacy`):** Plain-language policy detailing data collection (quote forms, cookies, analytics), storage duration, third-party disclosure rules, and customer data deletion request instructions.
* **Terms of Service (`/terms`):** Terms governing website usage, quote estimation disclaimers, cancellation policies, and liability limits.
* **Consent Checkboxes:** Explicit consent checkboxes on Quote and Contact forms ("I agree to allow Neatly to contact me regarding my quote request").
* **Newsletter Unsubscribe:** Clear single-click unsubscribe link included in all transactional and newsletter marketing footers.

---

## 39. PRODUCTION & DEPLOYMENT REQUIREMENTS

* **Environment Isolation:** Strict separation of `Development`, `Staging`, and `Production` environments.
* **HTTPS Enforcement:** Mandatory SSL/TLS encryption across all public and admin routes.
* **Database Migrations:** Automated database schema migration checks during deployment pipelines.
* **CI/CD Pipeline:** Automated build verification, linting, and test execution prior to code merging.
* **Logging & Monitoring:** Centralized error logging and uptime monitoring to capture runtime server exceptions.
* **Database Backups:** Automated daily backups of database records with a 30-day retention window.

---

## 40. TESTING REQUIREMENTS

### 40.1 Unit Testing
* Validation logic for quote request inputs, email formatting, and rate limiting algorithms.
* CMS status transition logic (e.g., verifying status progression from `NEW` to `QUOTED`).

### 40.2 Integration Testing
* Form submission API endpoints (verifying data persistence + email notification triggers).
* Protected Admin middleware (verifying unauthorized requests return 401/403 status codes).
* Database CRUD operations across Services, Portfolio, Blog, and Testimonials modules.

### 40.3 End-to-End (E2E) Testing

```text
E2E Test Scenario 1: Visitor Quote Submission Flow
  Visitor lands on Homepage -> Clicks "Get a Free Quote" -> Fills /quote form -> 
  Submits -> Verifies Success Screen -> Verifies DB persistence (Status: NEW) -> 
  Verifies Admin email notification generated.

E2E Test Scenario 2: Admin Lead Management Flow
  Admin logs into /admin/login -> Navigates to /admin/quotes -> Views new quote -> 
  Updates status to "CONTACTED" -> Adds internal note -> Saves -> Verifies updated status.

E2E Test Scenario 3: CMS Content Lifecycle Flow
  Admin navigates to /admin/services -> Creates new service "Post-Renovation Clean" -> 
  Publishes service -> Visitor navigates to /services -> Verifies new service card renders.
```

### 40.4 Manual QA Matrix
* **Device Testing:** iPhone (Safari), Android (Chrome), iPad (Safari), Macbook (Chrome/Safari), Windows Desktop (Edge/Firefox).
* **Accessibility QA:** Keyboard-only navigation pass, VoiceOver / NVDA screen reader pass.

---

## 41. ACCEPTANCE CRITERIA

The product will be deemed complete and production-ready when all the following criteria are validated:

- [ ] **Homepage Verification:** Homepage loads in under 1.8 seconds with all 13 required sections rendering properly.
- [ ] **Navigation Execution:** Desktop navigation and sticky header transition function smoothly; mobile drawer operates seamlessly without page scroll leaks.
- [ ] **Service Catalog:** Public Services index and dynamic `/services/[slug]` pages render active CMS services accurately.
- [ ] **Quote Engine:** Interactive Quote form validates inputs, enforces anti-spam honeypot, persists requests with status `NEW`, triggers admin email alert, and shows confirmation UI.
- [ ] **Contact Form:** Contact form validates inputs, logs message into database, and triggers notification.
- [ ] **Portfolio Showcase:** Before/After interactive image comparison slider operates smoothly on both touch screen and desktop devices.
- [ ] **Blog Engine:** Blog listing displays published articles with search/category filtering; article detail page renders rich text content correctly.
- [ ] **Admin Authentication:** `/admin` routes reject unauthenticated requests; login form authenticates admin securely; logout revokes sessions.
- [ ] **Admin Lead Management:** Admin can list, view, filter, update status, and attach notes to incoming quote requests.
- [ ] **Admin CMS Modules:** Admin can create, edit, unpublish, and delete entries across Services, Portfolio, Testimonials, and Blog modules.
- [ ] **Site Settings CMS:** Updating business phone, email, or operating hours in Admin settings updates public footer and contact details instantly.
- [ ] **SEO & Metadata:** Every public route renders unique title tags, meta descriptions, open graph tags, XML sitemap, and valid JSON-LD structured data.
- [ ] **Accessibility Compliance:** All interactive elements support keyboard focus; color contrast passes WCAG 2.1 AA limits; prefers-reduced-motion is respected.
- [ ] **Production Build:** Production build compiles cleanly with zero linting or type errors; automated E2E test suite passes 100%.

---

## 42. MVP VS FUTURE ROADMAP

| Product Capability | MVP (Phase 1) | Phase 2 (Growth) | Phase 3 (Platform) |
| :--- | :--- | :--- | :--- |
| **Marketing Website** | Full public site, services, portfolio, blog, legal | Advanced interactive price calculator | Multi-location landing pages |
| **Lead Capture** | Custom Quote request & Contact forms | Instant booking calendar integration | SMS-based quick quote requests |
| **Customer Portal** | None (Quote confirmation via email) | Customer account sign-in & quote history | Self-service appointment rescheduling |
| **Payments** | Manual post-quote offline invoicing | Online deposit processing (Stripe) | Automated recurring subscription billing |
| **Admin Operations** | Lead tracking & CMS management | Staff assignment & calendar view | Automated cleaner route optimization |
| **Cleaner Portal** | None | SMS job notifications for staff | Dedicated staff mobile app for job checklists |

---

## 43. EXPLICIT OUT-OF-SCOPE LIST

To protect project boundaries, the following are **strictly out of scope** for Neatly MVP:
* ❌ Native iOS or Android mobile applications.
* ❌ Multi-tenant marketplace or third-party cleaning vendor registration.
* ❌ Automatic credit card charges during initial quote submission.
* ❌ Cleaner GPS tracking or live ETA mapping.
* ❌ Employee payroll, tax calculations, or tip splitting.
* ❌ Complex external CRM integrations.
* ❌ Automated AI chatbot assistants.

---

## 44. SUCCESS METRICS & KPIs

* **Quote Request Conversion Rate:** Target > 4.5% of total unique site visitors submitting a quote request.
* **Quote Form Completion Rate:** Target > 75% of users who start the `/quote` form completing submission.
* **Mobile Conversion Rate:** Mobile quote conversion rate matching within 10% of desktop conversion rates.
* **Core Web Vitals Pass Rate:** 100% pass rate on mobile and desktop Google PageSpeed benchmarks.
* **Lead Processing Efficiency:** Admin average lead status update time under 4 business hours.

---

## 45. ASSUMPTIONS & OPEN QUESTIONS FOR BUSINESS OWNER

### 45.1 Key Product Assumptions
1. Neatly initially operates as a single cleaning business entity in one primary geographic area.
2. Initial quote requests require manual admin review before a final price quote is delivered to the customer.
3. Service scope and inclusions are standardized across residential packages.
4. Business owner will provide initial real portfolio images and authentic customer reviews.

### 45.2 Open Questions Checklist (Business Owner Inputs Required)

- [ ] **Service Coverage:** What exact cities, counties, or zip codes define the initial service territory?
- [ ] **Business Contact Data:** What exact telephone number, physical office address, and support email should be displayed publicly?
- [ ] **Operating Hours:** What are the exact customer service and cleaning operational hours (e.g., Mon-Fri 8am-6pm)?
- [ ] **Guarantees & Insurance:** What is the formal name of the insurance carrier and the exact policy guarantee statement (e.g., 24-hour re-clean guarantee)?
- [ ] **Service Catalog Finalization:** What are the final initial service package titles and explicit task checklists?
- [ ] **Transactional Email Provider:** Which transactional email service (e.g., Resend, SendGrid, Postmark) will be used for notifications?
- [ ] **Domain & Hosting:** What is the target domain name (`neatlycleaning.com`) and hosting platform?

---

## 46. PRODUCT PRINCIPLES

1. **Trust Before Decoration:** Design choices must prioritize establishing credibility, safety, and reliability over superficial visual novelties.
2. **Clarity Before Complexity:** Service scopes, quotes, and navigation must be crystal clear to eliminate customer hesitation.
3. **Conversion Without Pressure:** Guide visitors into requesting a quote through value and trust rather than aggressive popup overlays or fake scarcity tactics.
4. **Real Content Over Fabricated Content:** Utilize authentic work examples, true service standards, and verified client feedback. Never introduce fake claims.
5. **Mobile-First Quality:** Optimize every flow for mobile devices, ensuring touch targets, forms, and layout hierarchy operate effortlessly on small screens.
6. **Performance is a Feature:** Fast load times directly drive trust and lead conversions; performance is never sacrificed for unneeded JavaScript.
7. **Accessibility is Mandatory:** Ensure Neatly is usable by everyone, strictly respecting WCAG 2.1 AA standards.
8. **Animation Should Support the Experience:** Animations must be calm, fast, subtle, and intentional—enhancing understanding rather than causing distraction.
9. **Security is Built-In:** Protecting customer lead data, admin credentials, and system integrity is a non-negotiable baseline.
10. **Build Only What the Business Needs:** Focus engineering strictly on the MVP requirements to deliver a high-quality, production-ready solution without scope creep.
