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
      body: "The reclean and satisfaction policy will come from site settings. Until then, this card reserves the guarantee pillar.",
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
      body: "What is included, and what is an add-on, will come from published service records—so expectations stay explicit.",
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
      body: "Coverage details publish from site settings. Do not invent certifications.",
      label: "Insured coverage",
      value: null,
    },
    {
      body: "Reviews appear here only after they are published in the CMS.",
      label: "Verified reviews",
      value: null,
    },
    {
      body: "Guarantee language will come from site settings.",
      label: "Published guarantee",
      value: null,
    },
    {
      body: "Staffing and screening standards will come from site settings.",
      label: "Background-checked team",
      value: null,
    },
  ],
  metricsPendingLabel: "Figure pending",
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
        alt: "A vetted cleaner wearing an ID badge and apron, holding folded cloths beside a supply cart in a modern kitchen.",
        height: 1536,
        objectPosition: "50% 22%",
        src: "/images/why_use/why_use_01.jpeg",
        width: 2752,
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
        alt: "A Neatly cleaner wiping a marble kitchen island with a microfiber cloth.",
        height: 1536,
        objectPosition: "50% 32%",
        src: "/images/why_use/why_use_02.jpeg",
        width: 2752,
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
        alt: "A tidy living room with a cleaned wood table, folded cloth, and garden light through tall windows.",
        height: 1536,
        objectPosition: "50% 48%",
        src: "/images/why_use/why_use_03.jpeg",
        width: 2752,
      },
    },
  ],
} as const;

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
    phone: "[Development Placeholder: Insert Real Business Phone]",
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
  services: "scroll-driven",
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
  hero: "client",
  howItWorks: "server",
  newsletter: "future-client",
  services: "client",
  statistics: "server",
  testimonials: "future-client",
  trustIndicators: "server",
  whyNeatly: "client",
} as const;
