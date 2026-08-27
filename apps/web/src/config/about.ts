import { APP_NAME } from "@neatly/config";
import { landingCtas } from "@/config/landing";

export const aboutMetadata = {
  description: `${APP_NAME} is a professional residential and commercial cleaning service. This page covers who we are, how a visit is delivered, and the standard behind the work.`,
  title: "About",
} as const;

export const aboutHero = {
  ctaHref: landingCtas.primary.href,
  ctaLabel: landingCtas.primary.label,
  description:
    "Cleaning means letting a team into a home or workplace. Neatly is built so that decision feels calm, explicit, and dependable.",
  eyebrow: "About Neatly",
  heading: "A cleaner space starts with something more.",
  headingId: "about-hero-heading",
  headingLines: ["A cleaner space", "starts with", "something more."] as const,
  image: {
    alt: "A Neatly cleaner wiping a marble kitchen island with a microfiber cloth.",
    height: 1536,
    objectPosition: "50% 32%",
    src: "/images/why_use/why_use_02.jpeg",
    width: 2752,
  },
} as const;

export const aboutStory = {
  eyebrow: "Our story",
  heading: "Neatly exists as a clear front door.",
  headingId: "about-story-heading",
  headingLines: ["Neatly exists as", "a clear front door."] as const,
  intro:
    "Cleaning means letting a team into a home or workplace. That decision should feel calm, explicit, and safe—not vague.",
  narrative:
    "Professional cleaning often arrives with fragmented branding, opaque scope, and contact methods that ask more of the customer than they should. Neatly is the clearer path: vetted people, a published checklist, and a satisfaction standard, stated before you request a quote.",
  image: {
    alt: "A tidy living room with a cleaned wood table, folded cloth, and garden light through tall windows.",
    height: 1536,
    objectPosition: "50% 48%",
    src: "/images/why_use/why_use_03.jpeg",
    width: 2752,
  },
  detail: {
    alt: "A cleaner wiping a white marble kitchen counter beside an amber spray bottle.",
    caption: "Work is finished to a published checklist—not a vague promise.",
    height: 1200,
    objectPosition: "48% 42%",
    src: "/images/work/01_kitchen.jpeg",
    width: 896,
  },
} as const;

export interface AboutPrinciple {
  body: string;
  number: string;
  title: string;
}

export const aboutStandard = {
  eyebrow: "Our standard",
  heading: "What quality means here",
  headingId: "about-standard-heading",
  headingLines: ["What quality", "means here."] as const,
  intro:
    "Neatly is built around execution you can inspect: who enters, what is included, how the work is finished, and what happens if a detail is missed.",
  principles: [
    {
      body: "Uncompromising quality standards on every booked visit. The work is completed to the agreed checklist—not a loose interpretation of clean.",
      number: "01",
      title: "Quality",
    },
    {
      body: "Predictable delivery. Recurring or one-time, the same professional standard applies so the visit does not depend on luck.",
      number: "02",
      title: "Consistency",
    },
    {
      body: "Homes and workplaces are personal. Care for property, considered materials, and a human tone are part of the work—not decoration around it.",
      number: "03",
      title: "Care",
    },
    {
      body: "What is included, and what is an add-on, is detailed before booking. Scope stays explicit so there are no hidden surprises.",
      number: "04",
      title: "Clarity",
    },
  ] satisfies ReadonlyArray<AboutPrinciple>,
} as const;

export interface AboutProcessStep {
  body: string;
  image: {
    alt: string;
    height: number;
    objectPosition: string;
    src: string;
    width: number;
  };
  number: string;
  title: string;
}

export const aboutProcess = {
  eyebrow: "How we work",
  heading: "A visit, explained with care",
  headingId: "about-process-heading",
  headingLines: ["A visit,", "explained", "with care."] as const,
  intro:
    "The quote path is simple. This is the deeper standard for how the work itself is understood, prepared, delivered, and reviewed.",
  steps: [
    {
      body: "Share the property type, service, and timing. The scope is gathered so the visit can be priced and planned without guesswork. Payment is not part of this step.",
      image: {
        alt: "A customer in a sunlit modern kitchen looking at a phone, with a cleaner working softly in the background.",
        height: 864,
        objectPosition: "42% 40%",
        src: "/images/how_it_works/01_request.jpeg",
        width: 1536,
      },
      number: "01",
      title: "Understand",
    },
    {
      body: "A vetted, insured team is matched to the published checklist. Considered materials and a clear inclusion list are prepared before anyone arrives.",
      image: {
        alt: "A cleaner in a sage apron speaking with a customer at a marble kitchen island in a bright apartment.",
        height: 864,
        objectPosition: "48% 38%",
        src: "/images/how_it_works/02_quote.jpeg",
        width: 1536,
      },
      number: "02",
      title: "Prepare",
    },
    {
      body: "The booked service is completed to the agreed checklist. Residential, deep, and commercial visits follow the scope you confirmed—not an improvised extra list.",
      image: {
        alt: "A Neatly cleaner kneeling to wipe light-wood kitchen cabinetry with a cloth and spray bottle.",
        height: 768,
        objectPosition: "38% 52%",
        src: "/images/Services/02_deep.jpeg",
        width: 1376,
      },
      number: "03",
      title: "Clean",
    },
    {
      body: "The finish is reviewed against the checklist. If any detail is missed, a complimentary reclean is the published satisfaction standard.",
      image: {
        alt: "A woman relaxing on a beige sofa in a freshly cleaned sunlit living room with a tidy kitchen beyond.",
        height: 864,
        objectPosition: "55% 42%",
        src: "/images/how_it_works/03_result.jpeg",
        width: 1536,
      },
      number: "04",
      title: "Review",
    },
  ] satisfies ReadonlyArray<AboutProcessStep>,
} as const;

export const aboutTeam = {
  emptyMessage:
    "Named team profiles will appear here when they are published. Names, titles, and credentials will never be invented.",
  eyebrow: "The people behind the clean",
  heading: "Who enters the space is part of the standard",
  headingId: "about-team-heading",
  headingLines: ["Who enters the space", "is part of the standard."] as const,
  intro:
    "Cleaning requires physical access to a home or workplace. Neatly treats that as a trust decision: vetted professionals, background checks, and insured coverage—stated before a visit is booked.",
  image: {
    alt: "A vetted cleaner wearing an ID badge and apron, holding folded cloths beside a supply cart in a modern kitchen.",
    height: 1536,
    objectPosition: "50% 22%",
    src: "/images/why_use/why_use_01.jpeg",
    width: 2752,
  },
} as const;

export interface AboutCommitmentItem {
  body: string;
  number: string;
  title: string;
}

export const aboutCommitment = {
  eyebrow: "Our commitment",
  heading: "A clean space should give you one less thing to worry about.",
  headingId: "about-commitment-heading",
  headingLines: [
    "A clean space",
    "should give you",
    "one less thing",
    "to worry about.",
  ] as const,
  intro:
    "Neatly promises reliable cleaning execution backed by professional staff, transparent communication, uncompromising quality standards, and respect for customer property.",
  items: [
    {
      body: "Homes and offices are entered with care. Property is treated as if it were our own, with considered materials and a finished checklist.",
      number: "01",
      title: "Respect your space",
    },
    {
      body: "What is included is stated before you request a quote. The conversation stays explicit. Payment is not part of that step.",
      number: "02",
      title: "Clear communication",
    },
    {
      body: "The work is human: courteous, calm, and precise. Scope is followed so the visit feels thoughtful rather than rushed or vague.",
      number: "03",
      title: "Thoughtful service",
    },
    {
      body: "The same standard applies across residential and commercial visits. Consistency is how trust is earned after the first booking.",
      number: "04",
      title: "Consistent standards",
    },
  ] satisfies ReadonlyArray<AboutCommitmentItem>,
} as const;

export const aboutQuality = {
  eyebrow: "Quality in every detail",
  heading: "The last look matters as much as the first",
  headingId: "about-quality-heading",
  intro:
    "Attention to detail is not a slogan. It is the difference between a visit that looks finished and one that still asks something of you.",
  statements: [
    "Surfaces, fixtures, and floors are completed to the agreed checklist.",
    "Considered materials are chosen for the spaces people live and work in.",
    "If a detail is missed, the satisfaction standard is a complimentary reclean.",
  ],
  primary: {
    alt: "A sunlit living room with a made sofa, tidy coffee table, and marble fireplace after a visit.",
    height: 1200,
    objectPosition: "50% 48%",
    src: "/images/work/07_spotless.jpeg",
    width: 896,
  },
  secondary: {
    alt: "A cleaner kneeling to wipe a chrome bathtub faucet in a stone-tiled bathroom.",
    height: 1200,
    objectPosition: "50% 42%",
    src: "/images/work/04_bathroom.jpeg",
    width: 896,
  },
  tertiary: {
    alt: "A cleaner squeegeeing a floor-to-ceiling window that looks onto a green garden.",
    height: 1200,
    objectPosition: "58% 38%",
    src: "/images/work/06_window.jpeg",
    width: 896,
  },
} as const;

export interface AboutDifferentiator {
  expectation: string;
  neatly: string;
  title: string;
}

export const aboutWhy = {
  eyebrow: "Why Neatly",
  expectationLabel: "A common experience",
  heading: "A calmer way to request professional cleaning",
  headingId: "about-why-heading",
  intro:
    "The difference is not a slogan about being the only option. It is a clearer standard for scope, people, and what happens after the visit.",
  neatlyLabel: "The Neatly approach",
  items: [
    {
      expectation:
        "The visit is described in general terms, so inclusions stay ambiguous until someone is already in the space.",
      neatly:
        "What is included, and what is an add-on, is detailed in published service checklists before booking.",
      title: "Scope",
    },
    {
      expectation:
        "Who arrives can feel like an unknown, even when the work itself is ordinary.",
      neatly:
        "Who enters a property, and how they are screened, is part of the standard—not an afterthought.",
      title: "People",
    },
    {
      expectation:
        "If a detail is missed, there is no stated path back to a finished visit.",
      neatly:
        "Complimentary reclean if any detail is missed. Satisfaction is an explicit commitment.",
      title: "Finish",
    },
    {
      expectation:
        "Getting a price can mean a long call or a form that asks more than it needs.",
      neatly:
        "A quote request asks for essential property details. Payment is not part of that step.",
      title: "Quote",
    },
  ] satisfies ReadonlyArray<AboutDifferentiator>,
} as const;

export const aboutCta = {
  description:
    "Share the property type, service, and timing. A specialist will follow up with a clear scope. Payment is not part of this step.",
  heading: "A cleaner space starts with Neatly.",
  headingId: "about-cta-heading",
  image: {
    alt: "",
    height: 1536,
    objectPosition: "48% 42%",
    src: "/images/hero/04_img.jpeg",
    width: 2752,
  },
  primaryHref: landingCtas.primary.href,
  primaryLabel: landingCtas.primary.label,
  secondaryHref: landingCtas.secondary.href,
  secondaryLabel: landingCtas.secondary.label,
} as const;
