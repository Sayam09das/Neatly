import {
  type Actor,
  isAdminActor,
  requireAdminActor,
} from "../../lib/domain/actor.ts";
import { catalogItemNotFound } from "../../lib/domain/errors.ts";
import {
  type ListResult,
  resolvePagination,
  resolveSort,
  toListResult,
} from "../../lib/domain/list.ts";
import { requireSlug } from "../../lib/domain/slug.ts";
import { ConflictError, ValidationError } from "../../lib/errors.ts";
import type { CatalogRepository } from "../../repositories/catalog.repository.ts";
import {
  CATALOG_SORT_FIELDS,
  type CatalogListQuery,
  type CatalogRecord,
  type CreateCatalogInput,
  type PublicCatalogDetail,
  type PublicCatalogItem,
  type PublicCatalogListQuery,
  toPublicCatalogDetail,
  toPublicCatalogItem,
  type UpdateCatalogInput,
} from "./catalog.types.ts";

export class CatalogService {
  private readonly catalog: CatalogRepository;

  public constructor(catalog: CatalogRepository) {
    this.catalog = catalog;
  }

  public async create(
    actor: Actor,
    input: CreateCatalogInput,
  ): Promise<CatalogRecord> {
    requireAdminActor(actor);
    const name = requireText(input.name, "name");
    const slug = requireSlug(input.slug ?? name);
    const existing = await this.catalog.findBySlug(slug);

    if (existing !== null) {
      throw new ConflictError("A service with this slug already exists.");
    }

    return this.catalog.create({
      ...input,
      fullDescription: requireText(input.fullDescription, "fullDescription"),
      name,
      shortDescription: requireText(input.shortDescription, "shortDescription"),
      slug,
    });
  }

  public async getById(id: string, actor?: Actor): Promise<CatalogRecord> {
    const item = await this.catalog.findById(id);

    if (item === null || (!item.isActive && !isAdminViewer(actor))) {
      throw catalogItemNotFound();
    }

    return item;
  }

  public async list(
    query: CatalogListQuery = {},
    actor?: Actor,
  ): Promise<ListResult<CatalogRecord>> {
    const pagination = resolvePagination(query.pagination);
    const sort = resolveSort(query.sort, CATALOG_SORT_FIELDS);
    const result = await this.catalog.list({
      ...query,
      active: isAdminViewer(actor) ? query.active : true,
      pagination,
      sort,
    });
    return toListResult(result.items, result.total, pagination);
  }

  public async listPublic(
    query: PublicCatalogListQuery = {},
  ): Promise<ListResult<PublicCatalogItem>> {
    const result = await this.list({
      pagination: query.pagination,
      search: query.search,
    });

    return {
      items: result.items.map(toPublicCatalogItem),
      pagination: result.pagination,
    };
  }

  public async getPublicBySlug(slug: string): Promise<PublicCatalogDetail> {
    const item = await this.catalog.findBySlug(slug.trim());

    if (item === null || !item.isActive) {
      throw catalogItemNotFound();
    }

    return toPublicCatalogDetail(item);
  }

  public async update(
    actor: Actor,
    id: string,
    input: UpdateCatalogInput,
  ): Promise<CatalogRecord> {
    requireAdminActor(actor);
    const item = await this.catalog.findById(id);

    if (item === null) {
      throw catalogItemNotFound();
    }

    let slug = input.slug;

    if (slug !== undefined || input.name !== undefined) {
      slug = requireSlug(slug ?? input.name ?? item.name);
      const existing = await this.catalog.findBySlug(slug);

      if (existing !== null && existing.id !== item.id) {
        throw new ConflictError("A service with this slug already exists.");
      }
    }

    const updated = await this.catalog.update(id, {
      ...input,
      fullDescription:
        input.fullDescription === undefined
          ? undefined
          : requireText(input.fullDescription, "fullDescription"),
      name:
        input.name === undefined ? undefined : requireText(input.name, "name"),
      shortDescription:
        input.shortDescription === undefined
          ? undefined
          : requireText(input.shortDescription, "shortDescription"),
      slug,
    });

    if (updated === null) {
      throw catalogItemNotFound();
    }

    return updated;
  }

  public async archive(actor: Actor, id: string): Promise<CatalogRecord> {
    requireAdminActor(actor);
    const item = await this.catalog.findById(id);

    if (item === null) {
      throw catalogItemNotFound();
    }

    const updated = await this.catalog.update(id, { isActive: false });

    if (updated === null) {
      throw catalogItemNotFound();
    }

    return updated;
  }
}

function requireText(value: string, field: string): string {
  const trimmed = value.trim();

  if (trimmed === "") {
    throw new ValidationError("Validation failed.", [
      { field, issue: "This field is required." },
    ]);
  }

  return trimmed;
}

function isAdminViewer(actor: Actor | undefined): boolean {
  return actor !== undefined && isAdminActor(actor);
}
