import { APP_NAME } from "@neatly/config";
import { CUSTOMER_PATHS } from "@/config/customer";
import { landingServices } from "@/config/landing";

const residentialImage = landingServices.items[0]?.image;

export const SERVICES_CATALOG_SECTION_ID = "catalog";
export const SERVICES_CATALOG_HREF = `#${SERVICES_CATALOG_SECTION_ID}`;

export const servicesPageMetadata = {
  description:
    "Choose the service that fits your home or workplace. Every service starts with a clear scope and a straightforward quote process.",
  title: "Services",
} as const;

export const servicesPageHero = {
  catalogHref: SERVICES_CATALOG_HREF,
  catalogLabel: "Explore Services",
  description: servicesPageMetadata.description,
  eyebrow: "Our services",
  heading: "Cleaning that fits your space.",
  headingId: "services-page-heading",
  headingLines: ["Cleaning that", "fits your space."] as const,
  image: {
    alt:
      residentialImage?.alt ??
      "A Neatly cleaner wiping a marble kitchen island in a bright apartment.",
    height: residentialImage?.height ?? 768,
    objectPosition: residentialImage?.objectPosition ?? "42% 38%",
    src: residentialImage?.src ?? "/images/Services/01_residential.jpeg",
    width: residentialImage?.width ?? 1376,
  },
  quoteHref: CUSTOMER_PATHS.quote,
  quoteLabel: "Request a Quote",
} as const;

export const servicesPageCatalog = {
  description: landingServices.intro,
  eyebrow: landingServices.eyebrow,
  heading: landingServices.heading,
  headingEmphasis: landingServices.headingEmphasis,
  headingId: "services-catalog-heading",
  headingLead: landingServices.headingLead,
} as const;

export const servicesPageEmpty = {
  description: `Check back soon to explore ${APP_NAME}'s cleaning services.`,
  title: "Services are being prepared.",
} as const;

export const servicesPageError = {
  action: "Try Again",
  description: "Please try again in a moment.",
  heading: "We couldn't load our services right now.",
} as const;
