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
  eyebrow: "Professional cleaning",
  heading: "Pristine spaces. Effortless living.",
  headingId: "hero-heading",
  media: {
    alt: "Replace with a real, high-resolution photograph of a finished Neatly cleaning project.",
    role: "hero" as const,
  },
  trustSignals: [
    "Licensed and insured",
    "Vetted professionals",
    "Satisfaction guarantee",
  ],
};

export const landingTrustIndicators = {
  heading: "Trust, stated plainly",
  headingId: "trust-heading",
  items: [
    {
      body: "Coverage details will come from site settings. Do not invent certifications.",
      title: "Insured work",
    },
    {
      body: "Reviews appear here only after they are published in the CMS.",
      title: "Verified reviews",
    },
    {
      body: "Guarantee language will come from site settings.",
      title: "Satisfaction standard",
    },
    {
      body: "Staffing and screening standards will come from site settings.",
      title: "Background-checked team",
    },
  ],
};

export const landingWhyNeatly = {
  heading: `Why ${APP_NAME}`,
  headingId: "why-heading",
  intro:
    "Cleaning requires access to a home or workplace. The homepage should explain standards before asking for a quote.",
  pillars: [
    {
      body: "Who enters a property, and how they are screened, will be described from approved business copy.",
      title: "Rigorous vetting",
    },
    {
      body: "Product and process standards will be described from approved business copy.",
      title: "Considered materials",
    },
    {
      body: "The reclean or satisfaction policy will be described from site settings.",
      title: "Clear guarantee",
    },
    {
      body: "What is included, and what is an add-on, will come from service records.",
      title: "Transparent scope",
    },
  ],
};

export const landingServices = {
  heading: "Services",
  headingId: "services-heading",
  intro:
    "Service cards will be loaded from the CMS. These labels only reserve the architecture for the default categories in the product requirements.",
  items: [
    {
      href: "/services",
      name: "Residential cleaning",
      summary: "Recurring or one-time home maintenance.",
    },
    {
      href: "/services",
      name: "Deep cleaning",
      summary: "Detail work beyond a standard visit.",
    },
    {
      href: "/services",
      name: "Move-in and move-out",
      summary: "Turnover cleaning for property transitions.",
    },
    {
      href: "/services",
      name: "Commercial cleaning",
      summary: "Offices, studios, and small workplaces.",
    },
  ],
};

export const landingFeaturedWork = {
  emptyMessage:
    "Featured before-and-after projects will appear here once published in the portfolio CMS. No stock photography.",
  heading: "Featured work",
  headingId: "work-heading",
  mediaRole: "product-visualization" as const,
};

export const landingHowItWorks = {
  heading: "How it works",
  headingId: "process-heading",
  steps: [
    {
      body: "Share the property type, service, and timing. No payment on this step.",
      title: "Request a quote",
    },
    {
      body: "Confirm the scope and schedule with the team.",
      title: "Confirm the visit",
    },
    {
      body: "The booked service is completed to the agreed checklist.",
      title: "Enjoy a clean space",
    },
  ],
};

export const landingStatistics = {
  emptyMessage:
    "Operational figures will appear here only from verified site settings. Do not invent homes cleaned, ratings, or percentages.",
  heading: "By the numbers",
  headingId: "statistics-heading",
  slots: [
    { label: "Homes cleaned" },
    { label: "Satisfaction measure" },
    { label: "Insured staff coverage" },
  ],
};

export const landingTestimonials = {
  emptyMessage:
    "Customer reviews will appear here only after they are published and featured in the testimonials CMS. Names, ratings, and quotes will never be invented.",
  heading: "Customer reviews",
  headingId: "testimonials-heading",
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
  heading: "From the journal",
  headingId: "blog-heading",
};

export const landingNewsletter = {
  consent:
    "Subscribe only if you want occasional cleaning and home-care notes. Unsubscribe will be available on every message.",
  description:
    "The live form will post to the newsletter endpoint in a later step. This scaffold does not submit data.",
  heading: "Email notes",
  headingId: "newsletter-heading",
  inputLabel: "Email address",
};

export const landingFooter = {
  copyright: `© ${APP_NAME}`,
  headingId: "footer-heading",
  legalLinks: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
  placeholderContact: {
    address: "100 Main Street, Suite 400, New York, NY 10001",
    email: "hello@neatly.com",
    hours: "Mon – Sat: 8:00 AM – 6:00 PM",
    phone: "+1 (800) 555-6328",
  },
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
  blogHighlights: "entrance",
  featuredWork: "scroll-driven",
  finalCta: "micro",
  footer: "none",
  header: "micro",
  hero: "scroll-driven",
  howItWorks: "entrance",
  newsletter: "micro",
  services: "entrance",
  statistics: "entrance",
  testimonials: "entrance",
  trustIndicators: "entrance",
  whyNeatly: "entrance",
} as const;

export const landingClientBoundary = {
  blogHighlights: "server",
  featuredWork: "future-client",
  finalCta: "server",
  footer: "server",
  header: "client",
  hero: "future-client",
  howItWorks: "server",
  newsletter: "future-client",
  services: "server",
  statistics: "server",
  testimonials: "future-client",
  trustIndicators: "server",
  whyNeatly: "server",
} as const;
