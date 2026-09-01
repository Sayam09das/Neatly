import { z } from "@neatly/config/zod";
import {
  ADMIN_LONG_TEXT_MAX_LENGTH,
  ADMIN_TEXT_MAX_LENGTH,
} from "../../config/constants.ts";
import { QUOTE_AMOUNT_MAX, QUOTE_AMOUNT_MIN } from "../../config/quotes.ts";
import { BOOKING_SORT_FIELDS } from "../../services/bookings/booking.types.ts";
import { CATALOG_SORT_FIELDS } from "../../services/catalog/catalog.types.ts";
import { CLEANER_SORT_FIELDS } from "../../services/cleaners/cleaner.types.ts";
import {
  BLOG_SORT_FIELDS,
  NEWSLETTER_SORT_FIELDS,
  PORTFOLIO_SORT_FIELDS,
} from "../../services/cms/cms.types.ts";
import { CUSTOMER_SORT_FIELDS } from "../../services/customers/customer.types.ts";
import { NOTIFICATION_SORT_FIELDS } from "../../services/notifications/notification.types.ts";
import { QUOTE_SORT_FIELDS } from "../../services/quotes/quote.types.ts";
import { REVIEW_SORT_FIELDS } from "../../services/reviews/review.types.ts";
import {
  createAdminListQuerySchema,
  dateQueryEndSchema,
  dateQuerySchema,
  optionalIdQuerySchema,
} from "./admin-query.ts";
import {
  blogStatusSchema,
  bookingStatusSchema,
  booleanQuerySchema,
  cleanerAccountStateSchema,
  cleanerStatusSchema,
  customerStatusSchema,
  emailSchema,
  idSchema,
  newsletterStatusSchema,
  quoteServiceTypeSchema,
  quoteStatusSchema,
  serviceCategorySchema,
} from "./primitives.ts";

const shortText = z.string().trim().min(1).max(ADMIN_TEXT_MAX_LENGTH);
const optionalShortText = z
  .string()
  .trim()
  .max(ADMIN_TEXT_MAX_LENGTH)
  .nullable()
  .optional();
const longText = z.string().trim().min(1).max(ADMIN_LONG_TEXT_MAX_LENGTH);
const optionalLongText = z
  .string()
  .trim()
  .max(ADMIN_LONG_TEXT_MAX_LENGTH)
  .nullable()
  .optional();
const stringListSchema = z.array(
  z.string().trim().min(1).max(ADMIN_TEXT_MAX_LENGTH),
);
const jsonValueSchema = z.unknown();

export const customerListQuerySchema = createAdminListQuerySchema(
  CUSTOMER_SORT_FIELDS,
  {
    createdFrom: dateQuerySchema.optional(),
    createdTo: dateQueryEndSchema.optional(),
    status: customerStatusSchema.optional(),
  },
);

export const createCustomerBodySchema = z
  .strictObject({
    address: optionalShortText,
    email: emailSchema,
    name: shortText,
    phone: optionalShortText,
  })
  .transform((value) => ({
    address: value.address ?? null,
    email: value.email,
    name: value.name,
    phone: value.phone ?? null,
  }));

export const updateCustomerBodySchema = z.strictObject({
  address: optionalShortText,
  email: emailSchema.optional(),
  name: shortText.optional(),
  phone: optionalShortText,
});

export const customerStatusBodySchema = z.strictObject({
  status: customerStatusSchema,
});

export const cleanerListQuerySchema = createAdminListQuerySchema(
  CLEANER_SORT_FIELDS,
  {
    accountState: cleanerAccountStateSchema.optional(),
    status: cleanerStatusSchema.optional(),
  },
);

export const createCleanerBodySchema = z.strictObject({
  email: emailSchema,
  name: shortText,
  phone: shortText,
});

export const updateCleanerBodySchema = z.strictObject({
  email: emailSchema.optional().nullable(),
  name: shortText.optional(),
  phone: optionalShortText,
});

export const cleanerStatusBodySchema = z.strictObject({
  status: cleanerStatusSchema,
});

export const catalogListQuerySchema = createAdminListQuerySchema(
  CATALOG_SORT_FIELDS,
  {
    active: booleanQuerySchema.optional(),
  },
);

const optionalHttpsUrl = z
  .string()
  .trim()
  .max(2_048)
  .nullable()
  .optional()
  .refine(
    (value): boolean =>
      value === undefined ||
      value === null ||
      value === "" ||
      value.startsWith("https://"),
    "Enter a valid HTTPS image URL.",
  );

export const createCatalogBodySchema = z.strictObject({
  benefits: stringListSchema.optional(),
  coverImageUrl: optionalHttpsUrl,
  coverMediaId: idSchema.optional().nullable(),
  excludedTasks: stringListSchema.optional(),
  faqs: jsonValueSchema.optional(),
  fullDescription: longText,
  includedTasks: jsonValueSchema.optional(),
  isFeatured: z.boolean().optional(),
  name: shortText,
  seoDescription: optionalShortText,
  seoTitle: optionalShortText,
  shortDescription: shortText,
  slug: z.string().trim().max(ADMIN_TEXT_MAX_LENGTH).optional(),
  sortOrder: z.number().int().min(0).max(10_000).optional(),
});

export const updateCatalogBodySchema = createCatalogBodySchema.partial();

export const bookingListQuerySchema = createAdminListQuerySchema(
  BOOKING_SORT_FIELDS,
  {
    cleanerId: optionalIdQuerySchema,
    customerId: optionalIdQuerySchema,
    scheduledFrom: dateQuerySchema.optional(),
    scheduledTo: dateQueryEndSchema.optional(),
    serviceId: optionalIdQuerySchema,
    status: bookingStatusSchema.optional(),
  },
);

export const quoteListQuerySchema = createAdminListQuerySchema(
  QUOTE_SORT_FIELDS,
  {
    createdFrom: dateQuerySchema.optional(),
    createdTo: dateQueryEndSchema.optional(),
    serviceType: quoteServiceTypeSchema.optional(),
    status: quoteStatusSchema.optional(),
  },
);

export const updateQuoteBodySchema = z
  .strictObject({
    adminNotes: optionalLongText,
    quotedAmount: z
      .number({ error: "Enter a valid quoted amount." })
      .finite({ error: "Enter a valid quoted amount." })
      .min(QUOTE_AMOUNT_MIN, { error: "Enter a valid quoted amount." })
      .max(QUOTE_AMOUNT_MAX, { error: "Use a smaller quoted amount." })
      .optional(),
    status: quoteStatusSchema.optional(),
  })
  .refine(
    (value) =>
      value.adminNotes !== undefined ||
      value.quotedAmount !== undefined ||
      value.status !== undefined,
    { message: "Provide at least one quote field to update." },
  );

export const createBookingBodySchema = z.strictObject({
  cleanerId: idSchema.optional().nullable(),
  customerId: idSchema,
  notes: optionalLongText,
  quoteRequestId: idSchema.optional().nullable(),
  scheduledAt: dateQuerySchema.optional().nullable(),
  serviceAddress: optionalShortText,
  serviceId: idSchema,
});

export const updateBookingBodySchema = z.strictObject({
  notes: optionalLongText,
  scheduledAt: dateQuerySchema.optional().nullable(),
  serviceAddress: optionalShortText,
});

export const bookingStatusBodySchema = z.strictObject({
  status: bookingStatusSchema,
});

export const assignCleanerBodySchema = z.strictObject({
  cleanerId: idSchema,
});

export const reviewListQuerySchema = createAdminListQuerySchema(
  REVIEW_SORT_FIELDS,
  {
    active: booleanQuerySchema.optional(),
    category: serviceCategorySchema.optional(),
    createdFrom: dateQuerySchema.optional(),
    createdTo: dateQueryEndSchema.optional(),
    rating: z.coerce
      .number({ error: "Enter a rating from 1 to 5." })
      .int({ error: "Enter a rating from 1 to 5." })
      .min(1)
      .max(5)
      .optional(),
  },
);

export const blogListQuerySchema = createAdminListQuerySchema(
  BLOG_SORT_FIELDS,
  {
    createdFrom: dateQuerySchema.optional(),
    createdTo: dateQueryEndSchema.optional(),
    status: blogStatusSchema.optional(),
  },
);

export const portfolioListQuerySchema = createAdminListQuerySchema(
  PORTFOLIO_SORT_FIELDS,
  {
    category: serviceCategorySchema.optional(),
    createdFrom: dateQuerySchema.optional(),
    createdTo: dateQueryEndSchema.optional(),
    published: booleanQuerySchema.optional(),
  },
);

export const newsletterListQuerySchema = createAdminListQuerySchema(
  NEWSLETTER_SORT_FIELDS,
  {
    status: newsletterStatusSchema.optional(),
    subscribedFrom: dateQuerySchema.optional(),
    subscribedTo: dateQueryEndSchema.optional(),
  },
);

export const updateReviewBodySchema = z.strictObject({
  content: longText.optional(),
  customerName: shortText.optional(),
  customerRole: optionalShortText,
  isFeatured: z.boolean().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  serviceCategory: serviceCategorySchema.optional().nullable(),
  sortOrder: z.number().int().min(0).max(10_000).optional(),
});

export const notificationListQuerySchema = createAdminListQuerySchema(
  NOTIFICATION_SORT_FIELDS,
  {
    unreadOnly: booleanQuerySchema.optional(),
  },
);

export const createNotificationBodySchema = z.strictObject({
  message: longText,
  recipientId: idSchema,
  relatedHref: optionalShortText,
  relatedLabel: optionalShortText,
  title: shortText,
});

export const updateSettingsBodySchema = z.strictObject({
  address: shortText.optional(),
  businessName: shortText.optional(),
  defaultSeoDesc: shortText.optional(),
  defaultSeoTitle: shortText.optional(),
  email: emailSchema.optional(),
  notificationEmail: emailSchema.optional(),
  phone: shortText.optional(),
  serviceAreas: stringListSchema.optional(),
  socialLinks: jsonValueSchema.optional(),
  tagline: shortText.optional(),
  workingHours: jsonValueSchema.optional(),
});

export type CreateCustomerBody = z.infer<typeof createCustomerBodySchema>;
export type UpdateCustomerBody = z.infer<typeof updateCustomerBodySchema>;
export type CustomerStatusBody = z.infer<typeof customerStatusBodySchema>;
export type CreateCleanerBody = z.infer<typeof createCleanerBodySchema>;
export type UpdateCleanerBody = z.infer<typeof updateCleanerBodySchema>;
export type CleanerStatusBody = z.infer<typeof cleanerStatusBodySchema>;
export type CreateCatalogBody = z.infer<typeof createCatalogBodySchema>;
export type UpdateCatalogBody = z.infer<typeof updateCatalogBodySchema>;
export type CreateBookingBody = z.infer<typeof createBookingBodySchema>;
export type UpdateBookingBody = z.infer<typeof updateBookingBodySchema>;
export type BookingStatusBody = z.infer<typeof bookingStatusBodySchema>;
export type AssignCleanerBody = z.infer<typeof assignCleanerBodySchema>;
export type UpdateReviewBody = z.infer<typeof updateReviewBodySchema>;
export type CreateNotificationBody = z.infer<
  typeof createNotificationBodySchema
>;
export type UpdateSettingsBody = z.infer<typeof updateSettingsBodySchema>;
export type CustomerListQuery = z.infer<typeof customerListQuerySchema>;
export type CleanerListQuery = z.infer<typeof cleanerListQuerySchema>;
export type CatalogListQueryInput = z.infer<typeof catalogListQuerySchema>;
export type BookingListQueryInput = z.infer<typeof bookingListQuerySchema>;
export type QuoteListQueryInput = z.infer<typeof quoteListQuerySchema>;
export type UpdateQuoteBody = z.infer<typeof updateQuoteBodySchema>;
export type ReviewListQueryInput = z.infer<typeof reviewListQuerySchema>;
export type BlogListQueryInput = z.infer<typeof blogListQuerySchema>;
export type PortfolioListQueryInput = z.infer<typeof portfolioListQuerySchema>;
export type NewsletterListQueryInput = z.infer<
  typeof newsletterListQuerySchema
>;
export type NotificationListQueryInput = z.infer<
  typeof notificationListQuerySchema
>;
