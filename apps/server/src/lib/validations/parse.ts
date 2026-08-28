import type { z } from "@neatly/config/zod";
import { VALIDATION_FAILED_MESSAGE } from "../../config/constants.ts";
import { type ApiFieldIssue, ValidationError } from "../errors.ts";

const UNSAFE_FIELD_NAMES = new Set(["__proto__", "constructor", "prototype"]);

interface ZodIssueLike {
  code: string;
  keys?: string[];
  message: string;
  path: readonly PropertyKey[];
}

export function parseWithSchema<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  throw new ValidationError(
    VALIDATION_FAILED_MESSAGE,
    toFieldIssues(result.error.issues as readonly ZodIssueLike[]),
  );
}

export function searchParamsToRecord(
  searchParams: URLSearchParams,
): Record<string, string> {
  const record: Record<string, string> = Object.create(null) as Record<
    string,
    string
  >;

  for (const [key, value] of searchParams.entries()) {
    if (UNSAFE_FIELD_NAMES.has(key) || record[key] !== undefined) {
      continue;
    }

    const trimmed = value.trim();

    if (trimmed !== "") {
      record[key] = value;
    }
  }

  return record;
}

export function toFieldsMap(
  details: readonly ApiFieldIssue[],
): Record<string, string> {
  const fields: Record<string, string> = Object.create(null) as Record<
    string,
    string
  >;

  for (const detail of details) {
    if (fields[detail.field] === undefined) {
      fields[detail.field] = detail.issue;
    }
  }

  return fields;
}

function toFieldIssues(issues: readonly ZodIssueLike[]): ApiFieldIssue[] {
  const details: ApiFieldIssue[] = [];

  for (const issue of issues) {
    if (issue.code === "unrecognized_keys" && issue.keys !== undefined) {
      for (const key of issue.keys) {
        details.push({
          field: sanitizeFieldName(key),
          issue: "This field is not allowed.",
        });
      }
      continue;
    }

    details.push({
      field: fieldPath(issue.path),
      issue: publicIssueMessage(issue),
    });
  }

  return details;
}

function fieldPath(path: readonly PropertyKey[]): string {
  if (path.length === 0) {
    return "form";
  }

  return sanitizeFieldName(path.map(String).join("."));
}

function sanitizeFieldName(field: string): string {
  const segments = field.split(".");

  if (segments.some((segment) => UNSAFE_FIELD_NAMES.has(segment))) {
    return "form";
  }

  return field;
}

function publicIssueMessage(issue: ZodIssueLike): string {
  if (issue.code === "unrecognized_keys") {
    return "This field is not allowed.";
  }

  return issue.message;
}
