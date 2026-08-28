import { ConflictError } from "../errors.ts";

export function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");

  return slug;
}

export function requireSlug(value: string): string {
  const slug = slugify(value);

  if (slug === "") {
    throw new ConflictError("A URL slug could not be created from this name.");
  }

  return slug;
}
