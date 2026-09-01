import { statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  BlogStatus,
  NewsletterStatus,
  PrismaClient,
  ServiceCategory,
} from "@prisma/client";

const IMAGE_ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../web/public/images",
);

const DEV_PREFIX = "[Development Placeholder]";

interface LocalCover {
  altText: string;
  filename: string;
  height: number;
  relativePath: string;
  storageKey: string;
  width: number;
}

const COVERS: readonly LocalCover[] = [
  {
    altText: `${DEV_PREFIX} Kitchen counter still for local CMS layout.`,
    filename: "01_kitchen.jpeg",
    height: 1200,
    relativePath: "work/01_kitchen.jpeg",
    storageKey: "seed/cms/01_kitchen.jpg",
    width: 896,
  },
  {
    altText: `${DEV_PREFIX} Office glass still for local CMS layout.`,
    filename: "02_office.jpeg",
    height: 1200,
    relativePath: "work/02_office.jpeg",
    storageKey: "seed/cms/02_office.jpg",
    width: 896,
  },
  {
    altText: `${DEV_PREFIX} Floor-care still for local CMS layout.`,
    filename: "03_floors.jpeg",
    height: 1200,
    relativePath: "work/03_floors.jpeg",
    storageKey: "seed/cms/03_floors.jpg",
    width: 896,
  },
  {
    altText: `${DEV_PREFIX} Carpet still for local CMS layout.`,
    filename: "05_carpet.jpeg",
    height: 1200,
    relativePath: "work/05_carpet.jpeg",
    storageKey: "seed/cms/05_carpet.jpg",
    width: 896,
  },
  {
    altText: `${DEV_PREFIX} Window still for local CMS layout.`,
    filename: "06_window.jpeg",
    height: 1200,
    relativePath: "work/06_window.jpeg",
    storageKey: "seed/cms/06_window.jpg",
    width: 896,
  },
  {
    altText: `${DEV_PREFIX} Living-room still for local CMS layout.`,
    filename: "07_spotless.jpeg",
    height: 1200,
    relativePath: "work/07_spotless.jpeg",
    storageKey: "seed/cms/07_spotless.jpg",
    width: 896,
  },
  {
    altText: `${DEV_PREFIX} Journal cover still for local CMS layout.`,
    filename: "01_featured.jpeg",
    height: 1024,
    relativePath: "journal/01_featured.jpeg",
    storageKey: "seed/cms/08_journal_featured.jpg",
    width: 1536,
  },
  {
    altText: `${DEV_PREFIX} Journal slot still for local CMS layout.`,
    filename: "02_slot.jpeg",
    height: 1024,
    relativePath: "journal/02_slot.jpeg",
    storageKey: "seed/cms/09_journal_slot.jpg",
    width: 1024,
  },
  {
    altText: `${DEV_PREFIX} Second journal slot still for local CMS layout.`,
    filename: "03_slot.jpeg",
    height: 1024,
    relativePath: "journal/03_slot.jpeg",
    storageKey: "seed/cms/10_journal_slot_b.jpg",
    width: 1024,
  },
  {
    altText: `${DEV_PREFIX} Third journal slot still for local CMS layout.`,
    filename: "04_slot.jpeg",
    height: 1024,
    relativePath: "journal/04_slot.jpeg",
    storageKey: "seed/cms/11_journal_slot_c.jpg",
    width: 1024,
  },
  {
    altText: `${DEV_PREFIX} Testimonial-frame still for local CMS layout.`,
    filename: "01_slot.jpeg",
    height: 1536,
    relativePath: "testimonials/01_slot.jpeg",
    storageKey: "seed/cms/12_testimonial_a.jpg",
    width: 2752,
  },
  {
    altText: `${DEV_PREFIX} Second testimonial-frame still for local CMS layout.`,
    filename: "02_slot.jpeg",
    height: 1024,
    relativePath: "testimonials/02_slot.jpeg",
    storageKey: "seed/cms/13_testimonial_b.jpg",
    width: 1024,
  },
  {
    altText: `${DEV_PREFIX} Third testimonial-frame still for local CMS layout.`,
    filename: "03_slot.jpeg",
    height: 1024,
    relativePath: "testimonials/03_slot.jpeg",
    storageKey: "seed/cms/14_testimonial_c.jpg",
    width: 1024,
  },
  {
    altText: `${DEV_PREFIX} Hero still reused as a local CMS layout image.`,
    filename: "01_img.jpeg",
    height: 1536,
    relativePath: "hero/01_img.jpeg",
    storageKey: "seed/cms/15_hero.jpg",
    width: 2752,
  },
];

const CATEGORIES: readonly {
  description: string;
  name: string;
  slug: string;
}[] = [
  {
    description: `${DEV_PREFIX} Home-care notes for the local journal.`,
    name: "Home Care",
    slug: "dev-home-care",
  },
  {
    description: `${DEV_PREFIX} Practical cleaning notes for the local journal.`,
    name: "Cleaning Tips",
    slug: "dev-cleaning-tips",
  },
  {
    description: `${DEV_PREFIX} Kitchen-care notes for the local journal.`,
    name: "Kitchens",
    slug: "dev-kitchens",
  },
  {
    description: `${DEV_PREFIX} Bathroom-care notes for the local journal.`,
    name: "Bathrooms",
    slug: "dev-bathrooms",
  },
  {
    description: `${DEV_PREFIX} Workplace-care notes for the local journal.`,
    name: "Offices",
    slug: "dev-offices",
  },
  {
    description: `${DEV_PREFIX} Move notes for the local journal.`,
    name: "Move-in / Move-out",
    slug: "dev-move",
  },
  {
    description: `${DEV_PREFIX} Surface-care notes for the local journal.`,
    name: "Materials & surfaces",
    slug: "dev-surfaces",
  },
  {
    description: `${DEV_PREFIX} Recurring-visit notes for the local journal.`,
    name: "Recurring care",
    slug: "dev-recurring",
  },
  {
    description: `${DEV_PREFIX} Indoor-air notes for the local journal.`,
    name: "Indoor air",
    slug: "dev-indoor-air",
  },
  {
    description: `${DEV_PREFIX} Seasonal notes for the local journal.`,
    name: "Seasonal prep",
    slug: "dev-seasonal",
  },
];

const POST_TITLES: readonly string[] = [
  "How to keep a kitchen ready between visits",
  "What a quote should make clear before anyone arrives",
  "A simple bathroom checklist for a one-time visit",
  "How office kitchens stay usable during the week",
  "Move-in rooms that need a stated scope",
  "Floors, rugs, and what the quote should list",
  "Weekly, bi-weekly, or monthly: pick from the quote",
  "Windows and reachable glass in a standard visit",
  "How to describe a space when you request a quote",
  "A calm close after the visit is complete",
];

const PROJECTS: readonly {
  category: ServiceCategory;
  coverIndex: number;
  afterIndex: number;
  slug: string;
  title: string;
}[] = [
  {
    afterIndex: 5,
    category: "RESIDENTIAL",
    coverIndex: 0,
    slug: "dev-kitchen-surfaces",
    title: "Kitchen surfaces",
  },
  {
    afterIndex: 7,
    category: "RESIDENTIAL",
    coverIndex: 5,
    slug: "dev-living-room-reset",
    title: "Living room reset",
  },
  {
    afterIndex: 2,
    category: "DEEP_CLEAN",
    coverIndex: 2,
    slug: "dev-floor-detail",
    title: "Floor detail",
  },
  {
    afterIndex: 3,
    category: "DEEP_CLEAN",
    coverIndex: 3,
    slug: "dev-carpet-care",
    title: "Carpet care",
  },
  {
    afterIndex: 4,
    category: "RESIDENTIAL",
    coverIndex: 4,
    slug: "dev-window-glass",
    title: "Window glass",
  },
  {
    afterIndex: 1,
    category: "COMMERCIAL",
    coverIndex: 1,
    slug: "dev-office-desks",
    title: "Office desks",
  },
  {
    afterIndex: 8,
    category: "COMMERCIAL",
    coverIndex: 6,
    slug: "dev-studio-kitchenette",
    title: "Studio kitchenette",
  },
  {
    afterIndex: 9,
    category: "MOVE_IN_OUT",
    coverIndex: 5,
    slug: "dev-empty-ready-rooms",
    title: "Empty, ready rooms",
  },
  {
    afterIndex: 13,
    category: "MOVE_IN_OUT",
    coverIndex: 7,
    slug: "dev-handover-prep",
    title: "Handover prep",
  },
  {
    afterIndex: 11,
    category: "RESIDENTIAL",
    coverIndex: 10,
    slug: "dev-recurring-upkeep",
    title: "Recurring upkeep",
  },
];

function requireFileSize(relativePath: string): number {
  const path = join(IMAGE_ROOT, relativePath);
  const stats = statSync(path);

  if (!stats.isFile() || stats.size <= 0) {
    throw new Error(`Development CMS cover is missing or empty: ${path}`);
  }

  return stats.size;
}

async function upsertCover(
  prisma: PrismaClient,
  cover: LocalCover,
): Promise<string> {
  const size = requireFileSize(cover.relativePath);
  const row = await prisma.mediaAsset.upsert({
    create: {
      altText: cover.altText,
      filename: cover.filename,
      height: cover.height,
      mimeType: "image/jpeg",
      size,
      storageKey: cover.storageKey,
      url: `/images/${cover.relativePath}`,
      width: cover.width,
    },
    update: {
      altText: cover.altText,
      filename: cover.filename,
      height: cover.height,
      mimeType: "image/jpeg",
      size,
      url: `/images/${cover.relativePath}`,
      width: cover.width,
    },
    where: { storageKey: cover.storageKey },
  });

  return row.id;
}

export async function seedDevelopmentCms(
  prisma: PrismaClient,
  authorId: string,
): Promise<void> {
  const coverIds: string[] = [];

  for (const cover of COVERS) {
    coverIds.push(await upsertCover(prisma, cover));
  }

  await prisma.siteSettings.upsert({
    create: {
      address: `${DEV_PREFIX} Insert the real business address.`,
      businessName: "Neatly",
      defaultSeoDesc: `${DEV_PREFIX} Replace this description before launch.`,
      defaultSeoTitle: "Neatly",
      email: "dev-placeholder@example.test",
      id: 1,
      notificationEmail: "dev-placeholder@example.test",
      phone: `${DEV_PREFIX} Insert the real business phone.`,
      serviceAreas: [],
      socialLinks: null,
      tagline: "Clean, minimal, high-trust",
      workingHours: {},
    },
    update: {
      address: `${DEV_PREFIX} Insert the real business address.`,
      defaultSeoDesc: `${DEV_PREFIX} Replace this description before launch.`,
      email: "dev-placeholder@example.test",
      notificationEmail: "dev-placeholder@example.test",
      phone: `${DEV_PREFIX} Insert the real business phone.`,
    },
    where: { id: 1 },
  });

  const categoryIds: string[] = [];

  for (const category of CATEGORIES) {
    const row = await prisma.blogCategory.upsert({
      create: category,
      update: {
        description: category.description,
        name: category.name,
      },
      where: { slug: category.slug },
    });
    categoryIds.push(row.id);
  }

  for (const [index, title] of POST_TITLES.entries()) {
    const slug = `dev-${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}`;
    const status: BlogStatus =
      index < 6 ? "PUBLISHED" : index < 9 ? "DRAFT" : "ARCHIVED";
    const publishedAt = status === "PUBLISHED" ? new Date() : null;
    const excerpt = `${DEV_PREFIX} Sample journal copy for local Admin CMS testing. Replace before launch.`;

    await prisma.blogPost.upsert({
      create: {
        authorId,
        categoryId: categoryIds[index] ?? categoryIds[0],
        content: `${excerpt}\n\n${title} is sample editorial copy for a cleaning startup journal. It does not describe a completed customer job.`,
        coverMediaId: coverIds[index] ?? coverIds[0],
        excerpt,
        publishedAt,
        seoDescription: excerpt,
        seoTitle: title,
        slug,
        status,
        tags: ["development-placeholder", CATEGORIES[index]?.slug ?? "dev"],
        title,
      },
      update: {
        authorId,
        categoryId: categoryIds[index] ?? categoryIds[0],
        content: `${excerpt}\n\n${title} is sample editorial copy for a cleaning startup journal. It does not describe a completed customer job.`,
        coverMediaId: coverIds[index] ?? coverIds[0],
        excerpt,
        publishedAt,
        seoDescription: excerpt,
        seoTitle: title,
        status,
        tags: ["development-placeholder", CATEGORIES[index]?.slug ?? "dev"],
        title,
      },
      where: { slug },
    });
  }

  for (let index = 1; index <= 10; index += 1) {
    const email = `dev-subscriber-${String(index).padStart(2, "0")}@example.test`;
    const unsubscribed = index > 8;
    const status: NewsletterStatus = unsubscribed
      ? "UNSUBSCRIBED"
      : "SUBSCRIBED";

    await prisma.newsletterSubscriber.upsert({
      create: {
        email,
        status,
        unsubscribedAt: unsubscribed ? new Date() : null,
      },
      update: {
        status,
        unsubscribedAt: unsubscribed ? new Date() : null,
      },
      where: { email },
    });
  }

  for (const [index, project] of PROJECTS.entries()) {
    const row = await prisma.portfolioProject.upsert({
      create: {
        category: project.category,
        description: `${DEV_PREFIX} Sample portfolio layout for ${project.title}. This is not a real client case study.`,
        isFeatured: index < 3,
        isPublished: true,
        location: null,
        slug: project.slug,
        sortOrder: index + 1,
        title: `${DEV_PREFIX} ${project.title}`,
      },
      update: {
        category: project.category,
        description: `${DEV_PREFIX} Sample portfolio layout for ${project.title}. This is not a real client case study.`,
        isFeatured: index < 3,
        isPublished: true,
        location: null,
        sortOrder: index + 1,
        title: `${DEV_PREFIX} ${project.title}`,
      },
      where: { slug: project.slug },
    });

    await prisma.portfolioImage.deleteMany({
      where: { portfolioProjectId: row.id },
    });

    const beforeId = coverIds[project.coverIndex] ?? coverIds[0];
    const afterId = coverIds[project.afterIndex] ?? coverIds[1];

    await prisma.portfolioImage.createMany({
      data: [
        {
          altText: `${DEV_PREFIX} Before-frame layout still for ${project.title}.`,
          imageType: "BEFORE",
          mediaAssetId: beforeId,
          portfolioProjectId: row.id,
          sortOrder: 0,
        },
        {
          altText: `${DEV_PREFIX} After-frame layout still for ${project.title}.`,
          imageType: "AFTER",
          mediaAssetId: afterId,
          portfolioProjectId: row.id,
          sortOrder: 1,
        },
      ],
    });
  }

  const reviewRoles = [
    "Apartment",
    "House",
    "Studio",
    "Office",
    "Retail",
    "Condo",
    "Townhouse",
    "Clinic waiting room",
    "Shared kitchen",
    "Guest suite",
  ] as const;
  const reviewCategories: readonly ServiceCategory[] = [
    "RESIDENTIAL",
    "RESIDENTIAL",
    "DEEP_CLEAN",
    "COMMERCIAL",
    "COMMERCIAL",
    "MOVE_IN_OUT",
    "RESIDENTIAL",
    "DEEP_CLEAN",
    "RESIDENTIAL",
    "MOVE_IN_OUT",
  ];

  for (let index = 0; index < 10; index += 1) {
    const customerName = `${DEV_PREFIX} Review ${String(index + 1).padStart(2, "0")}`;
    const content = `${DEV_PREFIX} Sample review copy for local Admin CMS testing. Replace with a real published review. This is not a customer quote.`;
    const existing = await prisma.testimonial.findFirst({
      where: { customerName },
    });
    const data = {
      avatarMediaId: coverIds[10 + (index % 3)] ?? coverIds[0],
      content,
      customerName,
      customerRole: reviewRoles[index],
      isActive: true,
      isFeatured: index < 2,
      rating: index % 5 === 0 ? 4 : 5,
      serviceCategory: reviewCategories[index],
      sortOrder: index + 1,
    };

    if (existing === null) {
      await prisma.testimonial.create({ data });
      continue;
    }

    await prisma.testimonial.update({
      data,
      where: { id: existing.id },
    });
  }
}
