import { z } from "@neatly/config/zod";
import {
  BookingStatus,
  CleanerStatus,
  CustomerStatus,
  QuoteStatus,
  ServiceCategory,
  UserRole,
  UserStatus,
} from "@prisma/client";
import {
  AUTH_EMAIL_MAX_LENGTH,
  AUTH_PASSWORD_MAX_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
} from "../../config/auth.ts";
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_MAX_LIMIT,
  SEARCH_QUERY_MAX_LENGTH,
  SORT_DIRECTIONS,
} from "../../config/constants.ts";

export const emailSchema = z
  .string()
  .trim()
  .max(AUTH_EMAIL_MAX_LENGTH, "Enter a valid email.")
  .toLowerCase()
  .pipe(z.email("Enter a valid email."));

export const passwordSchema = z
  .string()
  .min(
    AUTH_PASSWORD_MIN_LENGTH,
    `Use at least ${String(AUTH_PASSWORD_MIN_LENGTH)} characters.`,
  )
  .max(
    AUTH_PASSWORD_MAX_LENGTH,
    `Use at most ${String(AUTH_PASSWORD_MAX_LENGTH)} characters.`,
  );

export const idSchema = z.cuid("Enter a valid id.");

export const idParamSchema = z.strictObject({
  id: idSchema,
});

export const sortOrderSchema = z.enum(SORT_DIRECTIONS, {
  error: "Use asc or desc.",
});

export const booleanQuerySchema = z
  .enum(["true", "false"], { error: "Use true or false." })
  .transform((value): boolean => value === "true");

export const searchQuerySchema = z
  .string()
  .trim()
  .max(SEARCH_QUERY_MAX_LENGTH, "Use a shorter search.");

export const dateTimeSchema = z.iso
  .datetime({
    error: "Enter a valid date.",
    offset: true,
  })
  .transform((value): Date => new Date(value));

export const userRoleSchema = z.nativeEnum(UserRole, {
  error: "This value is not allowed.",
});

export const userStatusSchema = z.nativeEnum(UserStatus, {
  error: "This value is not allowed.",
});

export const customerStatusSchema = z.nativeEnum(CustomerStatus, {
  error: "This value is not allowed.",
});

export const cleanerStatusSchema = z.nativeEnum(CleanerStatus, {
  error: "This value is not allowed.",
});

export const cleanerAccountStateSchema = z.enum(
  ["ACTIVE", "INACTIVE", "INVITED"],
  {
    error: "This value is not allowed.",
  },
);

export const bookingStatusSchema = z.nativeEnum(BookingStatus, {
  error: "This value is not allowed.",
});

export const quoteStatusSchema = z.nativeEnum(QuoteStatus, {
  error: "This value is not allowed.",
});

export const serviceCategorySchema = z.nativeEnum(ServiceCategory, {
  error: "This value is not allowed.",
});

export const pageSchema = z.preprocess(
  (value: unknown): unknown =>
    value === undefined || value === "" ? PAGINATION_DEFAULT_PAGE : value,
  z.coerce
    .number({ error: "Enter a positive whole number." })
    .int({ error: "Enter a positive whole number." })
    .min(1, { error: "Enter a positive whole number." }),
);

export const limitSchema = z.preprocess(
  (value: unknown): unknown =>
    value === undefined || value === "" ? PAGINATION_DEFAULT_LIMIT : value,
  z.coerce
    .number({ error: "Enter a positive whole number." })
    .int({ error: "Enter a positive whole number." })
    .min(1, { error: "Enter a positive whole number." })
    .max(PAGINATION_MAX_LIMIT, {
      error: `Use at most ${String(PAGINATION_MAX_LIMIT)} items per page.`,
    }),
);

export const paginationQuerySchema = z
  .object({
    limit: limitSchema,
    page: pageSchema,
  })
  .transform((value) => ({
    limit: value.limit,
    page: value.page,
    skip: (value.page - 1) * value.limit,
  }));

export function createSortQuerySchema(
  allowedFields: readonly string[],
): z.ZodType<
  | {
      direction: (typeof SORT_DIRECTIONS)[number];
      field: string;
    }
  | undefined
> {
  return z
    .object({
      order: sortOrderSchema.optional(),
      sort: z.string().trim().min(1).optional(),
    })
    .transform((value, ctx) => {
      if (value.sort === undefined) {
        return undefined;
      }

      if (!allowedFields.includes(value.sort)) {
        ctx.addIssue({
          code: "custom",
          message: "This sort field is not allowed.",
          path: ["sort"],
        });
        return z.NEVER;
      }

      return {
        direction: value.order ?? "asc",
        field: value.sort,
      };
    });
}

export type EmailInput = z.infer<typeof emailSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
export type IdInput = z.infer<typeof idSchema>;
export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;
export type DateTimeInput = z.infer<typeof dateTimeSchema>;
export type UserRoleInput = z.infer<typeof userRoleSchema>;
export type UserStatusInput = z.infer<typeof userStatusSchema>;
export type BookingStatusInput = z.infer<typeof bookingStatusSchema>;
