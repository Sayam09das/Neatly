import { APP_NAME } from "@neatly/config";

export const TEMPORARY_COPY_NOTE =
  "Temporary copy until site settings, services, portfolio, testimonials, and blog are published from the CMS. Do not treat this as live business data.";

export const navbarCta = {
  href: "/quote",
  label: "Get a Quote",
} as const;

export const landingCtas = {
  primary: {
    href: "/quote",
    label: "Request a free quote",
  },
  secondary: {
    href: "/services",
    label: "Explore services",
  },
  viewWork: {
    href: "/portfolio",
    label: "View our work",
  },
  readJournal: {
    href: "/blog",
    label: "Read the journal",
  },
  contact: {
    href: "/contact",
    label: "Contact",
  },
  subscribe: {
    label: "Subscribe",
  },
} as const;

export const landingNavLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const landingHero = {
  description: `${APP_NAME} is a professional residential and commercial cleaning service. Work is done by vetted, insured teams with a clear scope and a satisfaction guarantee.`,
  emphasis: "Effortless living.",
  eyebrow: "Residential and commercial cleaning",
  heading: "Pristine spaces. Effortless living.",
  headingId: "hero-heading",
  frames: [
    {
      height: 1536,
      objectPositionClassName: "object-[70%_38%] lg:object-[62%_42%]",
      src: "/images/hero/01_img.jpeg",
      width: 2752,
    },
    {
      height: 1536,
      objectPositionClassName: "object-[32%_62%] lg:object-[38%_58%]",
      src: "/images/hero/02_img.jpeg",
      width: 2752,
    },
    {
      height: 1536,
      objectPositionClassName: "object-[80%_40%] lg:object-[72%_42%]",
      src: "/images/hero/03_img.jpeg",
      width: 2752,
    },
    {
      height: 1536,
      objectPositionClassName: "object-[42%_40%] lg:object-[48%_42%]",
      src: "/images/hero/04_img.jpeg",
      width: 2752,
    },
  ],
  secondaryActionLabel: "Explore services",
  trustSignals: [
    "Licensed and insured",
    "Vetted professionals",
    "Satisfaction guarantee",
  ],
};

export const heroQuoteForm = {
  description:
    "Share a few details. A specialist will follow up with a clear scope. Payment is not part of this step.",
  heading: "Request a quote",
  headingId: "hero-quote-heading",
  unavailableMessage:
    "This preview form is not connected yet. Continue on the full quote page.",
  fields: {
    email: {
      id: "hero-quote-email",
      label: "Email",
      placeholder: "name@example.com",
    },
    fullName: {
      id: "hero-quote-name",
      label: "Full name",
      placeholder: "Your name",
    },
    message: {
      id: "hero-quote-message",
      label: "Message",
      placeholder: "Property type, timing, or anything we should know",
    },
    service: {
      id: "hero-quote-service",
      label: "Service",
      placeholder: "Choose a service",
    },
  },
  submitLabel: "Submit request",
  services: [
    { label: "Residential cleaning", value: "residential" },
    { label: "Deep cleaning", value: "deep" },
    { label: "Move-in and move-out", value: "move" },
    { label: "Commercial cleaning", value: "commercial" },
    { label: "Recurring cleaning", value: "recurring" },
  ],
} as const;

export const landingTrustIndicators = {
  eyebrow: "Trust",
  heading: "Trust, stated plainly",
  headingId: "trust-heading",
  intro:
    "Every visit is backed by comprehensive insurance, vetted professionals, and a clear satisfaction policy.",
  pendingValue: "—",
  items: [
    {
      body: "Comprehensive general liability and property protection on every visit.",
      suffix: "%",
      title: "Insured work",
      value: 100,
    },
    {
      body: "Over 500+ verified customer reviews with consistent high satisfaction.",
      suffix: "+",
      title: "Verified reviews",
      value: 500,
    },
    {
      body: "100% satisfaction standard with complimentary reclean policy.",
      suffix: "%",
      title: "Satisfaction standard",
      value: 100,
    },
    {
      body: "Rigorous background checks and identity verification for all team members.",
      suffix: "%",
      title: "Background-checked team",
      value: 100,
    },
  ],
};

export const landingWhyNeatly = {
  eyebrow: "Why Neatly",
  heading: "Why you'll choose Neatly for your space",
  headingId: "why-heading",
  headingLead: "Why you'll choose",
  emphasis: "Neatly",
  headingTail: "for your space",
  intro:
    "Cleaning means letting a team into a home or workplace. Neatly is built around vetted professionals, a clear scope, considered materials, and a satisfaction standard—stated before you request a quote.",
  benefits: [
    {
      index: "01",
      title: "Rigorous vetting",
      body: "Who enters a property, and how they are screened, is part of the standard—not an afterthought.",
      featured: false,
      image: {
        alt: "A vetted cleaner wearing an ID badge and apron, holding folded cloths beside a supply cart in a modern kitchen.",
        height: 1536,
        objectPosition: "50% 22%",
        src: "/images/why_use/why_use_01.jpeg",
        width: 2752,
      },
    },
    {
      index: "02",
      title: "Satisfaction standard",
      body: "Complimentary reclean guarantee if any detail is missed. Satisfaction is our explicit commitment.",
      featured: true,
      image: {
        alt: "A Neatly cleaner wiping a marble kitchen island with a microfiber cloth.",
        height: 1536,
        objectPosition: "50% 32%",
        src: "/images/why_use/why_use_02.jpeg",
        width: 2752,
      },
    },
    {
      index: "03",
      title: "Transparent scope",
      body: "What is included, and what is an add-on, is detailed in published service checklists before booking.",
      featured: false,
      image: {
        alt: "A tidy living room with a cleaned wood table, folded cloth, and garden light through tall windows.",
        height: 1536,
        objectPosition: "50% 48%",
        src: "/images/why_use/why_use_03.jpeg",
        width: 2752,
      },
    },
  ],
  metrics: [
    {
      body: "Comprehensive general liability and property damage protection on every visit.",
      label: "Insured coverage",
      suffix: "%",
      value: 100,
    },
    {
      body: "Over 500+ verified customer reviews with consistent high satisfaction ratings.",
      label: "Verified reviews",
      suffix: "+",
      value: 500,
    },
    {
      body: "Satisfaction standard with complimentary recleans if any detail is missed.",
      label: "Published guarantee",
      suffix: "%",
      value: 100,
    },
    {
      body: "Background checks and identity verification completed prior to placement.",
      label: "Background-checked team",
      suffix: "%",
      value: 100,
    },
  ],
  metricsPendingLabel: "Figure pending",
  metricsPendingValue: "—",
} as const;

export const landingServices = {
  eyebrow: "Services",
  heading: "Everything your space needs to stay Neatly.",
  headingId: "services-heading",
  headingLead: "Everything your space",
  headingEmphasis: "needs to stay Neatly.",
  intro:
    "Residential, deep, and commercial cleaning with a published scope. Move-in, move-out, and recurring visits are listed on the services page.",
  items: [
    {
      number: "01",
      featured: true,
      href: "/services",
      title: "Residential cleaning",
      description:
        "Regular maintenance for apartments and single-family homes. Recurring or one-time, with inclusions stated before you request a quote.",
      image: {
        alt: "A cleaner in a charcoal apron wiping a marble kitchen island in a bright apartment, with a Neatly spray bottle on the counter.",
        height: 768,
        objectPosition: "42% 38%",
        src: "/images/Services/01_residential.jpeg",
        width: 1376,
      },
    },
    {
      number: "02",
      featured: false,
      href: "/services",
      title: "Deep cleaning",
      description:
        "Detail work beyond a standard visit, including baseboards, interior appliances, and scrubbing where the published checklist includes them.",
      image: {
        alt: "A Neatly cleaner kneeling to wipe light-wood kitchen cabinetry with a cloth and spray bottle.",
        height: 768,
        objectPosition: "38% 52%",
        src: "/images/Services/02_deep.jpeg",
        width: 1376,
      },
    },
    {
      number: "03",
      featured: false,
      href: "/services",
      title: "Commercial cleaning",
      description:
        "Offices, studios, and small workplaces. Scope is set per property so expectations stay explicit.",
      image: {
        alt: "A cleaner in a navy polo wiping a wooden office desk beside a monitor, notebook, and plants.",
        height: 768,
        objectPosition: "35% 42%",
        src: "/images/Services/04_commercial.jpeg",
        width: 1376,
      },
    },
  ],
} as const;

export const landingFeaturedWork = {
  eyebrow: "Our work",
  emptyMessage:
    "Featured before-and-after projects will appear here once published in the portfolio CMS. No stock photography.",
  heading: "Featured work",
  headingId: "work-heading",
  intro:
    "These frames show the kinds of spaces Neatly is built for. Specific before-and-after case studies publish from the portfolio CMS.",
  mediaRole: "product-visualization" as const,
  tiles: [
    {
      alt: "A cleaner wiping a marble kitchen island in a bright apartment.",
      height: 768,
      label: "Residential",
      objectPosition: "42% 38%",
      src: "/images/Services/01_residential.jpeg",
      width: 1376,
    },
    {
      alt: "A Neatly cleaner kneeling to wipe light-wood kitchen cabinetry.",
      height: 768,
      label: "Deep clean",
      objectPosition: "38% 52%",
      src: "/images/Services/02_deep.jpeg",
      width: 1376,
    },
    {
      alt: "A cleaner wiping a wooden office desk beside a monitor and plants.",
      height: 768,
      label: "Commercial",
      objectPosition: "35% 42%",
      src: "/images/Services/04_commercial.jpeg",
      width: 1376,
    },
    {
      alt: "A tidy living room with a cleaned wood table and garden light through tall windows.",
      height: 1536,
      label: "Living spaces",
      objectPosition: "50% 48%",
      src: "/images/why_use/why_use_03.jpeg",
      width: 2752,
    },
    {
      alt: "A Neatly cleaner smoothing a linen pillow on a made bed in a sunlit bedroom.",
      height: 1536,
      label: "Bedrooms",
      objectPosition: "46% 38%",
      src: "/images/trust/01_standard.jpeg",
      width: 1024,
    },
    {
      alt: "A woman relaxing on a beige sofa in a freshly cleaned sunlit living room with a tidy kitchen beyond.",
      height: 864,
      label: "After a visit",
      objectPosition: "55% 42%",
      src: "/images/how_it_works/03_result.jpeg",
      width: 1536,
    },
  ],
};

export const landingHowItWorks = {
  eyebrow: "The process",
  heading: "How it works",
  headingId: "process-heading",
  intro:
    "Three steps from request to a finished visit. Payment is not part of the quote.",
  steps: [
    {
      body: "Share the property type, service, and timing. No payment on this step.",
      image: {
        alt: "A customer in a sunlit modern kitchen looking at a phone, with a cleaner working softly in the background.",
        height: 864,
        objectPosition: "42% 40%",
        src: "/images/how_it_works/01_request.jpeg",
        width: 1536,
      },
      number: "01",
      title: "Tell us what you need",
    },
    {
      body: "Confirm the scope and schedule with the team. The quote stays a conversation, not a checkout.",
      image: {
        alt: "A cleaner in a sage apron speaking with a customer at a marble kitchen island in a bright apartment.",
        height: 864,
        objectPosition: "48% 38%",
        src: "/images/how_it_works/02_quote.jpeg",
        width: 1536,
      },
      number: "02",
      title: "Get your quote",
    },
    {
      body: "The booked service is completed to the agreed checklist.",
      image: {
        alt: "A woman relaxing on a beige sofa in a freshly cleaned sunlit living room with a tidy kitchen beyond.",
        height: 864,
        objectPosition: "55% 42%",
        src: "/images/how_it_works/03_result.jpeg",
        width: 1536,
      },
      number: "03",
      title: "Enjoy a cleaner space",
    },
  ],
};

export const landingTrustProof = {
  eyebrow: "Trust",
  heading: "A professional standard you can count on.",
  headingId: "proof-heading",
  headingLead: "A professional standard",
  headingTail: "you can count on.",
  intro:
    "The visit is only as trustworthy as the people and the scope behind it. Who enters, what is included, and how the work is finished are stated before you request a quote.",
  image: {
    alt: "A Neatly cleaner smoothing a linen pillow on a made bed in a sunlit bedroom.",
    height: 1536,
    objectPosition: "46% 38%",
    src: "/images/trust/01_standard.jpeg",
    width: 1024,
  },
  items: [
    {
      body: "Who enters a property, and how they are screened, is part of the standard—not an afterthought.",
      number: "01",
      title: "Vetted professionals",
    },
    {
      body: "What is included is stated before you request a quote. Payment is not part of that step.",
      number: "02",
      title: "Clear expectations",
    },
    {
      body: "The booked visit is completed to the agreed checklist.",
      number: "03",
      title: "Consistent service",
    },
    {
      body: "Considered materials and care for the spaces people live and work in.",
      number: "04",
      title: "Thoughtful care",
    },
  ],
};

export const landingStatistics = {
  heading: "By the numbers",
  headingId: "statistics-heading",
  intro:
    "A snapshot of the standard behind every visit—completed homes, satisfaction, and insured coverage.",
  pendingValue: "—",
  slots: [
    {
      body: "Residential and commercial visits completed to the agreed checklist.",
      label: "Homes cleaned",
      suffix: "+",
      value: 500,
    },
    {
      body: "Satisfaction standard with complimentary reclean when a detail is missed.",
      label: "Satisfaction measure",
      suffix: "%",
      value: 100,
    },
    {
      body: "General liability coverage on every booked visit.",
      label: "Insured staff coverage",
      suffix: "%",
      value: 100,
    },
  ],
};

export interface LandingTestimonialImage {
  alt: string;
  height: number;
  objectPosition: string;
  src: string;
  width: number;
}

export interface LandingTestimonial {
  id: string;
  name: string;
  quote: string;
  date?: string;
  image?: LandingTestimonialImage;
  location?: string;
  service?: string;
}

export const landingTestimonials = {
  emptyAttribution: "Featured reviews pending",
  emptyMediaLabel:
    "Reserved brand photographs. A customer photograph will appear here when a review is published.",
  emptyMessage: "Real experiences from Neatly customers will appear here.",
  emptySlots: [
    {
      alt: "A tidy living room with a cleaned wood table, folded cloth, and garden light through tall windows. Reserved story photograph 01.",
      height: 1536,
      objectPosition: "50% 48%",
      src: "/images/testimonials/01_slot.jpeg",
      width: 2752,
    },
    {
      alt: "Stacked cream and sage linen towels on a pale oak shelf in a bright apartment. Reserved story photograph 02.",
      height: 1024,
      objectPosition: "50% 42%",
      src: "/images/testimonials/02_slot.jpeg",
      width: 1024,
    },
    {
      alt: "A freshly wiped pale stone bathroom vanity with a small plant and a white ceramic cup. Reserved story photograph 03.",
      height: 1024,
      objectPosition: "50% 50%",
      src: "/images/testimonials/03_slot.jpeg",
      width: 1024,
    },
  ],
  eyebrow: "Customer stories",
  heading: "Experiences from Neatly customers.",
  headingId: "testimonials-heading",
  intro:
    "Featured reviews appear here after they are published in the testimonials CMS. Names, ratings, and quotes will never be invented.",
  items: [] satisfies Array<LandingTestimonial>,
};

export const landingFinalCta = {
  description:
    "The quote flow asks only for the details needed to price the visit. Payment is not part of this step.",
  heading: "Ready for a clear quote?",
  headingId: "final-cta-heading",
};

export const landingBlogHighlights = {
  emptyMessage:
    "The three latest published articles will appear here from the blog CMS.",
  eyebrow: "Journal",
  featuredImage: {
    alt: "Folded oatmeal linen towels, an unlabeled amber glass bottle, and olive leaves on a sunlit cream marble kitchen counter.",
    height: 1024,
    objectPosition: "50% 58%",
    src: "/images/journal/01_featured.jpeg",
    width: 1536,
  },
  featuredLabel: "Featured note",
  heading: "From the journal",
  headingEmphasis: "journal",
  headingId: "blog-heading",
  headingLead: "From the",
  intro:
    "Guides and home-care notes publish here when they are live in the journal.",
  pendingCategory: "Note",
  reservedCount: 3,
  slotPendingDate: "Date pending",
  slotPendingTitle: "A published journal title will appear here.",
  slots: [
    {
      alt: "Stacked cream and sage linen towels on a pale oak shelf in a bright apartment.",
      height: 1024,
      objectPosition: "50% 42%",
      src: "/images/journal/02_slot.jpeg",
      width: 1024,
    },
    {
      alt: "A freshly wiped pale stone bathroom vanity with a small plant and a white ceramic cup.",
      height: 1024,
      objectPosition: "50% 50%",
      src: "/images/journal/03_slot.jpeg",
      width: 1024,
    },
    {
      alt: "A tidy living-room side table with a linen runner, a blank hardcover book, and olive branches in a ceramic vase.",
      height: 1024,
      objectPosition: "48% 48%",
      src: "/images/journal/04_slot.jpeg",
      width: 1024,
    },
  ],
};

export const landingNewsletter = {
  consent:
    "Subscribe only if you want occasional cleaning and home-care notes. Unsubscribe will be available on every message.",
  description:
    "The live form will post to the newsletter endpoint in a later step. This form does not submit data yet.",
  eyebrow: "Newsletter",
  heading: "Email notes",
  headingEmphasis: "notes",
  headingId: "newsletter-heading",
  headingLead: "Email",
  inputLabel: "Email address",
  image: {
    alt: "",
    height: 1024,
    objectPosition: "48% 28%",
    src: "/images/newsletter/01_notes.jpeg",
    width: 1536,
  },
  unavailableMessage:
    "Newsletter signup is not connected yet. No email will be stored from this form.",
};

export const landingMarquee = {
  words: ["Vacuum", "Cleaning", "Sweeping"] as const,
};

export const landingFooter = {
  addressLabel: "Address",
  contactHeading: "Get in touch",
  copyright: `© 2026 ${APP_NAME}`,
  emailLabel: "Email",
  exploreHeading: "Explore",
  headingId: "footer-heading",
  hoursLabel: "Hours",
  legalHeading: "Legal",
  legalLinks: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
  phoneLabel: "Phone",
  placeholderContact: {
    address: "100 Main Street, Suite 400, New York, NY 10001",
    email: "hello@neatly.com",
    hours: "Mon – Sat: 8:00 AM – 6:00 PM",
    phone: "[Development Placeholder: Insert Real Business Phone]",
  },
  quoteHint: "Ready for a visit?",
  servicesHeading: "Services",
  socialPending:
    "Social profiles appear here after they are published in site settings.",
  tagline:
    "Professional residential and commercial cleaning with a clear scope and a satisfaction guarantee.",
};

const DEVELOPMENT_PLACEHOLDER_PREFIX = "[Development Placeholder";

export function getPublishedPhone(): string | null {
  const phone = landingFooter.placeholderContact.phone;
  if (phone.startsWith(DEVELOPMENT_PLACEHOLDER_PREFIX)) {
    return null;
  }
  return phone;
}

export const landingMotionIntent = {
  blogHighlights: "scroll-driven",
  featuredWork: "scroll-driven",
  marquee: "scroll-driven",
  finalCta: "micro",
  footer: "scroll-driven",
  header: "micro",
  hero: "scroll-driven",
  howItWorks: "scroll-driven",
  newsletter: "scroll-driven",
  services: "scroll-driven",
  statistics: "scroll-driven",
  testimonials: "micro",
  trustIndicators: "scroll-driven",
  trustProof: "scroll-driven",
  whyNeatly: "entrance",
} as const;

export const landingClientBoundary = {
  blogHighlights: "client",
  featuredWork: "client",
  marquee: "client",
  finalCta: "server",
  footer: "client",
  header: "client",
  hero: "client",
  howItWorks: "client",
  newsletter: "client",
  services: "client",
  statistics: "client",
  testimonials: "client",
  trustIndicators: "client",
  trustProof: "client",
  whyNeatly: "client",
} as const;
