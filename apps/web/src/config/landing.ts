import { APP_NAME } from "@neatly/config";
import { CUSTOMER_PATHS, customerServicePath } from "@/config/customer";

export const TEMPORARY_COPY_NOTE =
  "Temporary copy until site settings, services, portfolio, testimonials, and blog are published from the CMS. Do not treat this as live business data.";

export const navbarCta = {
  href: CUSTOMER_PATHS.quote,
  label: "Get a Quote",
} as const;

export const CONTACT_PATH = "/contact";
export const PROCESS_PATH = "/process";
export const TESTIMONIALS_PATH = "/testimonials";
export const BLOG_PATH = "/blog";
export const LANDING_PROCESS_SECTION_ID = "process";
export const LANDING_REVIEWS_SECTION_ID = "testimonials";
export const LANDING_PROCESS_HREF = PROCESS_PATH;
export const LANDING_REVIEWS_HREF = TESTIMONIALS_PATH;

const unpublishedLandingRoute: string | null = null;

export const landingCtas = {
  primary: {
    href: CUSTOMER_PATHS.quote,
    label: "Request a free quote",
  },
  secondary: {
    href: CUSTOMER_PATHS.services,
    label: "Explore services",
  },
  viewWork: {
    href: unpublishedLandingRoute,
    label: "View our work",
  },
  readJournal: {
    href: BLOG_PATH,
    label: "Read the journal",
  },
  contact: {
    href: CONTACT_PATH,
    label: "Contact",
  },
  subscribe: {
    label: "Subscribe",
  },
} as const;

export const landingNavLinks = [
  { href: CUSTOMER_PATHS.services, label: "Services" },
  { href: LANDING_PROCESS_HREF, label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: LANDING_REVIEWS_HREF, label: "Reviews" },
  { href: BLOG_PATH, label: "Journal" },
  { href: CONTACT_PATH, label: "Contact" },
] as const;

export function blogPostPath(slug: string): string {
  return `${BLOG_PATH}/${encodeURIComponent(slug)}`;
}

export function getPublishedLandingCta(cta: {
  href: string | null;
  label: string;
}): { href: string; label: string } | null {
  if (cta.href === null) {
    return null;
  }

  return {
    href: cta.href,
    label: cta.label,
  };
}

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

const landingHeroPosterFrame = landingHero.frames.at(0);

if (landingHeroPosterFrame === undefined) {
  throw new Error("Landing hero requires a poster frame.");
}

export const landingMetadata = {
  description: landingHero.description,
  openGraphImage: {
    alt: `${APP_NAME} professional residential and commercial cleaning`,
    height: landingHeroPosterFrame.height,
    src: landingHeroPosterFrame.src,
    width: landingHeroPosterFrame.width,
  },
  title: APP_NAME,
} as const;

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
  heading: "A better way to keep your space clean.",
  headingId: "why-heading",
  headingLines: ["A better way to keep", "your space clean."],
  intro:
    "Neatly keeps the cleaning experience simple, clear, and easy to manage — from your first request to the final clean.",
  primaryCta: {
    href: navbarCta.href,
    label: navbarCta.label,
  },
  secondaryCta: {
    href: LANDING_PROCESS_HREF,
    label: "How It Works",
  },
  features: [
    {
      body: "Tell us what you need and receive a quote based on your cleaning request before moving forward.",
      icon: "quotes",
      index: "01",
      title: "Clear, upfront quotes",
    },
    {
      body: "Choose from the services available through Neatly and select the option that fits your cleaning needs.",
      icon: "services",
      index: "02",
      title: "Services built around your space",
    },
    {
      body: "Once your booking is ready, Neatly assigns a cleaner to the job so you know who is responsible for completing your service.",
      icon: "cleaners",
      index: "03",
      title: "Assigned professionals",
    },
    {
      body: "Track your booking through the Neatly workflow, from request and assignment to completion.",
      icon: "workflow",
      index: "04",
      title: "Simple from start to finish",
    },
  ],
} as const;

export const landingServices = {
  eyebrow: "Our services",
  heading: "Choose a service",
  headingId: "services-heading",
  headingLead: "Choose a",
  headingEmphasis: "service",
  intro: "Find the right cleaning service for your space.",
  viewLabel: "View Service",
  items: [
    {
      number: "01",
      featured: true,
      href: customerServicePath("residential-cleaning"),
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
      href: customerServicePath("deep-cleaning"),
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
      href: customerServicePath("move-in-move-out-cleaning"),
      title: "Move-in / move-out cleaning",
      description:
        "Transition cleaning so a property is ready for the next occupancy. Scope is stated before you request a quote.",
      image: {
        alt: "A bright living room with a beige sofa, light-wood coffee table, and marble fireplace after a move-in clean.",
        height: 1200,
        objectPosition: "50% 48%",
        src: "/images/Services/03_move.jpeg",
        width: 896,
      },
    },
    {
      number: "04",
      featured: false,
      href: customerServicePath("commercial-cleaning"),
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
    {
      number: "05",
      featured: false,
      href: customerServicePath("recurring-cleaning"),
      title: "Recurring cleaning",
      description:
        "Scheduled weekly, bi-weekly, or monthly visits. Frequency and inclusions stay explicit in the quote.",
      image: {
        alt: "A smiling Neatly cleaner in a green apron holding microfiber cloths beside a service cart in an open kitchen.",
        height: 1536,
        objectPosition: "48% 36%",
        src: "/images/Services/05_recurring.jpeg",
        width: 2752,
      },
    },
  ],
} as const;

export function landingServiceStillBySrc(
  src: string,
): (typeof landingServices.items)[number]["image"] | undefined {
  return landingServices.items.find((item) => item.image.src === src)?.image;
}

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
      alt: "A cleaner wiping a white marble kitchen counter beside an amber spray bottle.",
      height: 1200,
      id: "kitchen",
      label: "Kitchen",
      objectPosition: "48% 42%",
      src: "/images/work/01_kitchen.jpeg",
      width: 896,
    },
    {
      alt: "Two cleaners in a sunlit office, one wiping a glass partition beside a service cart.",
      height: 1200,
      id: "office",
      label: "Office",
      objectPosition: "62% 40%",
      src: "/images/work/02_office.jpeg",
      width: 896,
    },
    {
      alt: "A cleaner guiding a floor machine across polished stone in an open living space.",
      height: 1200,
      id: "floors",
      label: "Floors",
      objectPosition: "55% 48%",
      src: "/images/work/03_floors.jpeg",
      width: 896,
    },
    {
      alt: "A cleaner kneeling to wipe a chrome bathtub faucet in a stone-tiled bathroom.",
      height: 1200,
      id: "bathroom",
      label: "Bathroom",
      objectPosition: "50% 42%",
      src: "/images/work/04_bathroom.jpeg",
      width: 896,
    },
    {
      alt: "A cleaner working a carpet wand across a pale rug in a garden-facing living room.",
      height: 1200,
      id: "carpet",
      label: "Carpet",
      objectPosition: "48% 40%",
      src: "/images/work/05_carpet.jpeg",
      width: 896,
    },
    {
      alt: "A cleaner squeegeeing a floor-to-ceiling window that looks onto a green garden.",
      height: 1200,
      id: "windows",
      label: "Windows",
      objectPosition: "58% 38%",
      src: "/images/work/06_window.jpeg",
      width: 896,
    },
    {
      alt: "A sunlit living room with a made sofa, tidy coffee table, and marble fireplace after a visit.",
      height: 1200,
      id: "living-room",
      label: "Living room",
      objectPosition: "50% 48%",
      src: "/images/work/07_spotless.jpeg",
      width: 896,
    },
  ],
};

export const landingHowItWorks = {
  eyebrow: "How it works",
  heading: "Cleaning made simple.",
  headingId: "process-heading",
  intro:
    "From choosing a service to completing your cleaning, Neatly keeps every step clear and easy to follow.",
  ctaEyebrow: "Ready when you are",
  ctaHeading: "Let's get your space feeling fresh.",
  ctaHeadingId: "process-cta-heading",
  ctaDescription:
    "Choose a service, request your quote, and take the next step with Neatly.",
  image: {
    alt: "A woman relaxing on a beige sofa in a freshly cleaned sunlit living room with a tidy kitchen beyond.",
    height: 864,
    objectPosition: "55% 42%",
    src: "/images/how_it_works/03_result.jpeg",
    width: 1536,
  },
  journeyHeading: "Your cleaning journey",
  journey: [
    {
      detail: "Selected",
      icon: "service",
      id: "service",
      label: "Service",
      stepIds: ["choose"],
    },
    {
      detail: "Accepted",
      icon: "quote",
      id: "quote",
      label: "Quote",
      stepIds: ["request", "accept"],
    },
    {
      detail: "Confirmed",
      icon: "booking",
      id: "booking",
      label: "Booking",
      stepIds: ["book"],
    },
    {
      detail: "Assigned",
      icon: "cleaner",
      id: "cleaner",
      label: "Cleaner",
      stepIds: ["assign"],
    },
    {
      detail: "Completed",
      icon: "complete",
      id: "completed",
      label: "Cleaning",
      stepIds: ["complete", "review"],
    },
  ],
  primaryCta: {
    href: navbarCta.href,
    label: navbarCta.label,
  },
  quotesCta: {
    href: CUSTOMER_PATHS.quotes,
    label: "View your quotes",
  },
  secondaryCta: {
    href: CUSTOMER_PATHS.services,
    label: "Explore Services",
  },
  steps: [
    {
      body: "Browse the available services and select the one that fits your space.",
      cta: {
        href: CUSTOMER_PATHS.services,
        label: "Explore Services",
      },
      icon: "service",
      id: "choose",
      number: "01",
      title: "Choose a Service",
    },
    {
      body: "Tell us what you need so we can prepare a quote before you commit.",
      cta: {
        href: CUSTOMER_PATHS.quote,
        label: "Request a Quote",
      },
      icon: "quote",
      id: "request",
      number: "02",
      title: "Request a Quote",
    },
    {
      body: "Review the quote and accept it when you are ready to move forward.",
      icon: "accept",
      id: "accept",
      number: "03",
      title: "Accept Your Quote",
    },
    {
      body: "Confirm the details and create your booking once the quote looks right.",
      icon: "booking",
      id: "book",
      number: "04",
      title: "Book Your Cleaning",
    },
    {
      body: "Neatly assigns a cleaner so you know who is responsible for the visit.",
      icon: "cleaner",
      id: "assign",
      number: "05",
      title: "Cleaner Gets Assigned",
    },
    {
      body: "Your cleaner completes the work according to the agreed service.",
      icon: "complete",
      id: "complete",
      number: "06",
      title: "Cleaning Is Completed",
    },
    {
      body: "After the cleaning, you can share your experience through a review.",
      icon: "review",
      id: "review",
      number: "07",
      title: "Leave a Review",
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
  featured?: boolean;
  image?: LandingTestimonialImage;
  location?: string;
  rating?: number;
  service?: string;
}

export const landingTestimonialCategoryLabels = {
  COMMERCIAL: "Commercial",
  DEEP_CLEAN: "Deep clean",
  MOVE_IN_OUT: "Move-in / Move-out",
  RESIDENTIAL: "Residential",
} as const;

export type LandingTestimonialCategory =
  keyof typeof landingTestimonialCategoryLabels;

export const landingTestimonials = {
  emptyAttribution: "Published reviews appear here",
  emptyCta: navbarCta,
  emptyHeading: "Trusted by customers who value a cleaner space.",
  emptyMediaLabel:
    "Reserved brand photographs. A customer photograph will appear here when a review is published.",
  emptyMessage:
    "Customer reviews will appear here as more Neatly cleanings are completed.",
  errorMessage: "Customer reviews are temporarily unavailable.",
  eyebrow: "Customer reviews",
  heading: "Loved by customers who value a cleaner space.",
  headingId: "testimonials-heading",
  headingLead: "Loved by customers who value",
  headingTail: "a cleaner space.",
  intro:
    "Real experiences from customers who have used Neatly. Names, ratings, and quotes will never be invented.",
  items: [] satisfies Array<LandingTestimonial>,
  loadingLabel: "Loading customer reviews",
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
};

export const landingFinalCta = {
  description:
    "Choose the service that fits your space, request a quote, and take the next step with Neatly.",
  eyebrow: "Ready when you are",
  heading: "A cleaner space starts here.",
  headingId: "final-cta-heading",
  headingLines: ["A cleaner space", "starts here."],
  primaryCta: navbarCta,
  secondaryCta: {
    href: CUSTOMER_PATHS.services,
    label: "Explore Services",
  },
};

export const landingBlogHighlights = {
  emptyMessage:
    "The three latest published articles will appear here from the blog CMS.",
  errorMessage: "Journal notes are temporarily unavailable.",
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
  loadingLabel: "Loading journal notes",
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
    "Occasional cleaning and home-care notes. No sales sequences from this form.",
  errorMessage: "We could not save that email. Please try again.",
  eyebrow: "Newsletter",
  fieldError: "Enter a valid email.",
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
  submittingLabel: "Saving",
  successMessage:
    "You are on the list. Every message will include a way to unsubscribe.",
};

export const landingMarquee = {
  words: ["Vacuum", "Cleaning", "Sweeping"] as const,
};

export const landingFooter = {
  accountHeading: "Account",
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
    { href: "/cookies", label: "Cookies" },
  ],
  phoneLabel: "Phone",
  placeholderContact: {
    address: "[Development Placeholder: Insert Real Business Address]",
    email: "[Development Placeholder: Insert Real Business Email]",
    hours: "[Development Placeholder: Insert Real Business Hours]",
    phone: "[Development Placeholder: Insert Real Business Phone]",
  },
  quoteHint: "Ready for a visit?",
  registerLabel: "Register",
  servicesHeading: "Services",
  socialPending:
    "Social profiles appear here after they are published in site settings.",
  supportHeading: "Support",
  tagline:
    "Professional residential and commercial cleaning with a clear scope and a satisfaction guarantee.",
};

const DEVELOPMENT_PLACEHOLDER_PREFIX = "[Development Placeholder";

export interface PublishedContact {
  address: string | null;
  email: string | null;
  hours: string | null;
  phone: string | null;
}

function publishedOrNull(value: string): string | null {
  const trimmed = value.trim();

  if (trimmed === "" || trimmed.startsWith(DEVELOPMENT_PLACEHOLDER_PREFIX)) {
    return null;
  }

  return trimmed;
}

export function getPublishedContact(): PublishedContact {
  const contact = landingFooter.placeholderContact;

  return {
    address: publishedOrNull(contact.address),
    email: publishedOrNull(contact.email),
    hours: publishedOrNull(contact.hours),
    phone: publishedOrNull(contact.phone),
  };
}

export function hasPublishedContact(): boolean {
  const contact = getPublishedContact();

  return (
    contact.address !== null ||
    contact.email !== null ||
    contact.hours !== null ||
    contact.phone !== null
  );
}

export function getPublishedPhone(): string | null {
  return getPublishedContact().phone;
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
