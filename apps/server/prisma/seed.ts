import { statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  AUTH_BCRYPT_COST,
  AUTH_PASSWORD_MIN_LENGTH,
} from "../src/config/auth.ts";
import { seedDevelopmentCms } from "./seed-cms.ts";

const prisma = new PrismaClient();

const SERVICE_COVER_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../web/public/images/Services",
);

interface DevelopmentServiceCover {
  altText: string;
  filename: string;
  height: number;
  storageKey: string;
  url: string;
  width: number;
}

interface DevelopmentServiceSeed {
  benefits: string[];
  cover: DevelopmentServiceCover;
  excludedTasks: string[];
  faqs: { answer: string; question: string }[];
  fullDescription: string;
  includedTasks: string[];
  isFeatured: boolean;
  name: string;
  seoDescription: string;
  seoTitle: string;
  shortDescription: string;
  slug: string;
  sortOrder: number;
}

const SHARED_EXCLUSIONS = [
  "Repairs, painting, or pest control",
  "Hazardous or biohazard cleanup",
  "Work that needs specialist equipment not listed on the quote",
] as const;

const DEVELOPMENT_SERVICES: readonly DevelopmentServiceSeed[] = [
  {
    slug: "residential-cleaning",
    name: "Residential cleaning",
    shortDescription:
      "Regular maintenance for apartments and single-family homes. Recurring or one-time, with inclusions stated before you request a quote.",
    fullDescription:
      "Residential cleaning is regular maintenance for apartments and single-family homes. Visits can be one-time or recurring.\n\nThe quote states what is included before anyone arrives, so the visit matches the rooms and surfaces you described.",
    benefits: [
      "Regular upkeep for apartments and houses",
      "One-time or repeating visits",
      "Inclusions confirmed before the visit",
    ],
    includedTasks: [
      "Kitchen and bathroom surfaces in the rooms listed on the quote",
      "Floor care in the rooms listed on the quote",
      "Dusting of reachable surfaces in the rooms listed on the quote",
    ],
    excludedTasks: [...SHARED_EXCLUSIONS],
    faqs: [
      {
        question: "Is this only a repeating service?",
        answer:
          "No. Residential visits can be one-time or repeating. Frequency is confirmed in the quote.",
      },
      {
        question: "How is the price set?",
        answer:
          "Every visit starts with a quote. We do not publish a single price because scope depends on the property.",
      },
    ],
    seoTitle: "Residential Cleaning",
    seoDescription:
      "Regular maintenance for apartments and homes. Request a quote with inclusions stated before the visit.",
    isFeatured: true,
    sortOrder: 1,
    cover: {
      altText:
        "A cleaner in a charcoal apron wiping a marble kitchen island in a bright apartment, with a Neatly spray bottle on the counter.",
      filename: "01_residential.jpeg",
      height: 768,
      storageKey: "seed/services/residential-cleaning.jpg",
      url: "/images/Services/01_residential.jpeg",
      width: 1376,
    },
  },
  {
    slug: "deep-cleaning",
    name: "Deep cleaning",
    shortDescription:
      "Detail work beyond a standard visit, including baseboards, interior appliances, and scrubbing where the published checklist includes them.",
    fullDescription:
      "Deep cleaning is detail work beyond a standard visit. It can include baseboards, interior appliances, and scrubbing where those tasks are on the quote checklist.\n\nUse this when a space needs more than regular upkeep. The quote is the source of truth for what will be done.",
    benefits: [
      "Detail work beyond a standard visit",
      "Checklist confirmed before anyone arrives",
      "Focused on the rooms listed on the quote",
    ],
    includedTasks: [
      "Baseboards and reachable trim where listed on the quote",
      "Interior appliance cleaning where listed on the quote",
      "Detail scrubbing of bathrooms and kitchens where listed on the quote",
    ],
    excludedTasks: [...SHARED_EXCLUSIONS],
    faqs: [
      {
        question: "Is deep cleaning the same as a regular visit?",
        answer:
          "No. Deep cleaning covers extra detail work. The quote lists which rooms and tasks are included.",
      },
      {
        question: "How is the price set?",
        answer:
          "Every visit starts with a quote. We do not publish a single price because scope depends on the property.",
      },
    ],
    seoTitle: "Deep Cleaning",
    seoDescription:
      "Detail cleaning beyond a standard visit. Request a quote with the checklist confirmed before the visit.",
    isFeatured: false,
    sortOrder: 2,
    cover: {
      altText:
        "A Neatly cleaner kneeling to wipe light-wood kitchen cabinetry with a cloth and spray bottle.",
      filename: "02_deep.jpeg",
      height: 768,
      storageKey: "seed/services/deep-cleaning.jpg",
      url: "/images/Services/02_deep.jpeg",
      width: 1376,
    },
  },
  {
    slug: "move-in-move-out-cleaning",
    name: "Move-in / move-out cleaning",
    shortDescription:
      "Transition cleaning so a property is ready for the next occupancy. Scope is stated before you request a quote.",
    fullDescription:
      "Move-in and move-out cleaning is transition work so a property is ready for the next occupancy, tenancy, or sale.\n\nScope is confirmed before you request a quote. The checklist for the visit is the one in that quote, not a generic package.",
    benefits: [
      "Transition cleaning for the next occupancy",
      "Scope stated before you request a quote",
      "Checklist confirmed for the listed rooms",
    ],
    includedTasks: [
      "Kitchen and bathroom surfaces in the rooms listed on the quote",
      "Floor care in the rooms listed on the quote",
      "Interior surfaces left empty or staged as described on the quote",
    ],
    excludedTasks: [...SHARED_EXCLUSIONS],
    faqs: [
      {
        question: "Is this only for empty properties?",
        answer:
          "It is used for move-in and move-out transitions. Tell us how the property will look on the day so the quote can match the rooms that need work.",
      },
      {
        question: "How is the price set?",
        answer:
          "Every visit starts with a quote. We do not publish a single price because scope depends on the property.",
      },
    ],
    seoTitle: "Move-In / Move-Out Cleaning",
    seoDescription:
      "Transition cleaning so a property is ready for the next occupancy. Request a quote with scope stated first.",
    isFeatured: false,
    sortOrder: 3,
    cover: {
      altText:
        "A bright living room with a beige sofa, light-wood coffee table, and marble fireplace after a move-in clean.",
      filename: "03_move.jpeg",
      height: 1200,
      storageKey: "seed/services/move-in-move-out-cleaning.jpg",
      url: "/images/Services/03_move.jpeg",
      width: 896,
    },
  },
  {
    slug: "commercial-cleaning",
    name: "Commercial cleaning",
    shortDescription:
      "Offices, studios, and small workplaces. Scope is set per property so expectations stay explicit.",
    fullDescription:
      "Commercial cleaning covers offices, studios, and small workplaces. Scope is set per property so expectations stay explicit.\n\nDescribe the space, access, and timing when you request a quote. The quote lists the rooms and tasks included.",
    benefits: [
      "Offices, studios, and small workplaces",
      "Scope set per property",
      "Inclusions confirmed before the visit",
    ],
    includedTasks: [
      "Workstations and shared surfaces in the areas listed on the quote",
      "Floor care in the areas listed on the quote",
      "Kitchenette and washroom surfaces where listed on the quote",
    ],
    excludedTasks: [...SHARED_EXCLUSIONS],
    faqs: [
      {
        question: "Can this be scheduled around working hours?",
        answer:
          "Timing is part of the quote. Share access and preferred hours when you request one.",
      },
      {
        question: "How is the price set?",
        answer:
          "Every visit starts with a quote. We do not publish a single price because scope depends on the property.",
      },
    ],
    seoTitle: "Commercial Cleaning",
    seoDescription:
      "Office, studio, and workplace cleaning with scope set per property. Request a quote before the visit.",
    isFeatured: false,
    sortOrder: 4,
    cover: {
      altText:
        "A cleaner in a navy polo wiping a wooden office desk beside a monitor, notebook, and plants.",
      filename: "04_commercial.jpeg",
      height: 768,
      storageKey: "seed/services/commercial-cleaning.jpg",
      url: "/images/Services/04_commercial.jpeg",
      width: 1376,
    },
  },
  {
    slug: "recurring-cleaning",
    name: "Recurring cleaning",
    shortDescription:
      "Scheduled weekly, bi-weekly, or monthly visits. Frequency and inclusions stay explicit in the quote.",
    fullDescription:
      "Recurring cleaning is scheduled weekly, bi-weekly, or monthly maintenance for a home or workplace.\n\nFrequency, inclusions, and timing are confirmed in the quote so each visit has an explicit scope.",
    benefits: [
      "Weekly, bi-weekly, or monthly visits",
      "Frequency confirmed in the quote",
      "The same listed rooms each visit unless the quote is updated",
    ],
    includedTasks: [
      "Kitchen and bathroom surfaces in the rooms listed on the quote",
      "Floor care in the rooms listed on the quote",
      "Dusting of reachable surfaces in the rooms listed on the quote",
    ],
    excludedTasks: [...SHARED_EXCLUSIONS],
    faqs: [
      {
        question: "Can I change how often visits happen?",
        answer:
          "Yes. Frequency is part of the quote. Ask for an updated quote if the schedule needs to change.",
      },
      {
        question: "How is the price set?",
        answer:
          "Every visit starts with a quote. We do not publish a single price because scope depends on the property.",
      },
    ],
    seoTitle: "Recurring Cleaning",
    seoDescription:
      "Scheduled weekly, bi-weekly, or monthly cleaning. Frequency and inclusions stay explicit in the quote.",
    isFeatured: false,
    sortOrder: 5,
    cover: {
      altText:
        "A smiling Neatly cleaner in a green apron holding microfiber cloths beside a service cart in an open kitchen.",
      filename: "05_recurring.jpeg",
      height: 1536,
      storageKey: "seed/services/recurring-cleaning.jpg",
      url: "/images/Services/05_recurring.jpeg",
      width: 2752,
    },
  },
];

function readSeedAdmin(): {
  email: string;
  name: string;
  password: string;
} {
  const email = (process.env.ADMIN_EMAIL ?? process.env.ADMIN_SEED_EMAIL ?? "")
    .trim()
    .toLowerCase();
  const name = (
    process.env.ADMIN_USERNAME ??
    process.env.ADMIN_NAME ??
    ""
  ).trim();
  const password = (
    process.env.ADMIN_PASSWORD ??
    process.env.ADMIN_SEED_PASSWORD ??
    ""
  ).trim();

  if (email === "" || name === "" || password === "") {
    throw new Error(
      "ADMIN_EMAIL, ADMIN_USERNAME, and ADMIN_PASSWORD are required to seed the development admin user.",
    );
  }

  if (password.length < AUTH_PASSWORD_MIN_LENGTH) {
    throw new Error(
      `ADMIN_PASSWORD must be at least ${String(AUTH_PASSWORD_MIN_LENGTH)} characters.`,
    );
  }

  return { email, name, password };
}

function requireCoverFileSize(filename: string): number {
  const path = join(SERVICE_COVER_DIR, filename);
  const stats = statSync(path);

  if (!stats.isFile() || stats.size <= 0) {
    throw new Error(`Development service cover is missing or empty: ${path}`);
  }

  return stats.size;
}

async function seedDevelopmentAdmin(): Promise<string> {
  const { email, name, password } = readSeedAdmin();
  const passwordHash = await bcrypt.hash(password, AUTH_BCRYPT_COST);
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing !== null) {
    const updated = await prisma.user.update({
      data: {
        emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
        name,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
      },
      where: { email },
    });
    return updated.id;
  }

  const created = await prisma.user.create({
    data: {
      email,
      emailVerifiedAt: new Date(),
      name,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  return created.id;
}

async function seedDevelopmentCatalog(): Promise<void> {
  for (const service of DEVELOPMENT_SERVICES) {
    const size = requireCoverFileSize(service.cover.filename);
    const cover = await prisma.mediaAsset.upsert({
      create: {
        altText: service.cover.altText,
        filename: service.cover.filename,
        height: service.cover.height,
        mimeType: "image/jpeg",
        size,
        storageKey: service.cover.storageKey,
        url: service.cover.url,
        width: service.cover.width,
      },
      update: {
        altText: service.cover.altText,
        filename: service.cover.filename,
        height: service.cover.height,
        mimeType: "image/jpeg",
        size,
        url: service.cover.url,
        width: service.cover.width,
      },
      where: { storageKey: service.cover.storageKey },
    });

    await prisma.service.upsert({
      create: {
        benefits: service.benefits,
        coverMediaId: cover.id,
        excludedTasks: service.excludedTasks,
        faqs: service.faqs,
        fullDescription: service.fullDescription,
        includedTasks: service.includedTasks,
        isActive: true,
        isFeatured: service.isFeatured,
        name: service.name,
        seoDescription: service.seoDescription,
        seoTitle: service.seoTitle,
        shortDescription: service.shortDescription,
        slug: service.slug,
        sortOrder: service.sortOrder,
      },
      update: {
        benefits: service.benefits,
        coverMediaId: cover.id,
        excludedTasks: service.excludedTasks,
        faqs: service.faqs,
        fullDescription: service.fullDescription,
        includedTasks: service.includedTasks,
        isActive: true,
        isFeatured: service.isFeatured,
        name: service.name,
        seoDescription: service.seoDescription,
        seoTitle: service.seoTitle,
        shortDescription: service.shortDescription,
        slug: service.slug,
        sortOrder: service.sortOrder,
      },
      where: { slug: service.slug },
    });
  }
}

if (process.env.NODE_ENV === "production") {
  throw new Error("The development seed script must never run in production.");
}

try {
  const authorId = await seedDevelopmentAdmin();
  await seedDevelopmentCatalog();
  await seedDevelopmentCms(prisma, authorId);
} finally {
  await prisma.$disconnect();
}
