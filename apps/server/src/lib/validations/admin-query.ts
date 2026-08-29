import { z } from "@neatly/config/zod";
import type { PaginationQuery, SortQuery } from "../query.ts";
import {
  dateTimeSchema,
  limitSchema,
  pageSchema,
  searchQuerySchema,
  sortOrderSchema,
} from "./primitives.ts";

export const optionalSearchSchema = searchQuerySchema.optional();

export const dateQuerySchema = z
  .string()
  .trim()
  .min(1)
  .transform((value, ctx): Date => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = new Date(`${value}T00:00:00.000Z`);

      if (Number.isNaN(parsed.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid date.",
        });
        return z.NEVER;
      }

      return parsed;
    }

    return dateTimeSchema.parse(value);
  });

export const dateQueryEndSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value, ctx): Date => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = new Date(`${value}T23:59:59.999Z`);

      if (Number.isNaN(parsed.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a valid date.",
        });
        return z.NEVER;
      }

      return parsed;
    }

    return dateTimeSchema.parse(value);
  });

export const optionalIdQuerySchema = z.cuid("Enter a valid id.").optional();

export interface AdminListQuery {
  pagination: PaginationQuery;
  search?: string;
  sort?: SortQuery;
}

interface AdminListQueryInput {
  limit: number;
  order?: SortQuery["direction"];
  page: number;
  search?: string;
  sort?: string;
}

export function createAdminListQuerySchema<T extends z.ZodRawShape>(
  sortFields: readonly string[],
  filters: T,
): z.ZodType<AdminListQuery & z.infer<z.ZodObject<T>>> {
  return z
    .object({
      limit: limitSchema,
      order: sortOrderSchema.optional(),
      page: pageSchema,
      search: optionalSearchSchema,
      sort: z.string().trim().min(1).optional(),
      ...filters,
    })
    .transform((input, ctx) => {
      const value = input as AdminListQueryInput & Record<string, unknown>;
      let sort: SortQuery | undefined;

      if (value.sort !== undefined) {
        if (!sortFields.includes(value.sort)) {
          ctx.addIssue({
            code: "custom",
            message: "This sort field is not allowed.",
            path: ["sort"],
          });
          return z.NEVER;
        }

        sort = {
          direction: value.order ?? "asc",
          field: value.sort,
        };
      }

      const {
        limit,
        order: _order,
        page,
        search,
        sort: _sortField,
        ...rest
      } = value;
      void _order;
      void _sortField;

      return {
        ...(rest as z.infer<z.ZodObject<T>>),
        pagination: {
          limit,
          page,
          skip: (page - 1) * limit,
        },
        search,
        sort,
      };
    });
}
