import {
  type Actor,
  isAdminActor,
  requireAdminActor,
} from "../../lib/domain/actor.ts";
import { reviewNotFound } from "../../lib/domain/errors.ts";
import {
  type ListResult,
  resolvePagination,
  resolveSort,
  toListResult,
} from "../../lib/domain/list.ts";
import { ValidationError } from "../../lib/errors.ts";
import type { ReviewRepository } from "../../repositories/review.repository.ts";
import {
  type CreateReviewInput,
  REVIEW_SORT_FIELDS,
  type ReviewListQuery,
  type ReviewRecord,
  type UpdateReviewInput,
} from "./review.types.ts";

const RATING_MIN = 1;
const RATING_MAX = 5;

export class ReviewService {
  private readonly reviews: ReviewRepository;

  public constructor(reviews: ReviewRepository) {
    this.reviews = reviews;
  }

  public async create(
    actor: Actor,
    input: CreateReviewInput,
  ): Promise<ReviewRecord> {
    requireAdminActor(actor);
    return this.reviews.create({
      ...input,
      content: requireText(input.content, "content"),
      customerName: requireText(input.customerName, "customerName"),
      rating: requireRating(input.rating),
    });
  }

  public async getById(id: string, actor?: Actor): Promise<ReviewRecord> {
    const review = await this.reviews.findById(id);

    if (review === null || (!review.isActive && !isAdminViewer(actor))) {
      throw reviewNotFound();
    }

    return review;
  }

  public async list(
    query: ReviewListQuery = {},
    actor?: Actor,
  ): Promise<ListResult<ReviewRecord>> {
    const pagination = resolvePagination(query.pagination);
    const sort = resolveSort(query.sort, REVIEW_SORT_FIELDS);
    const result = await this.reviews.list({
      ...query,
      active: isAdminViewer(actor) ? query.active : true,
      pagination,
      sort,
    });
    return toListResult(result.items, result.total, pagination);
  }

  public async update(
    actor: Actor,
    id: string,
    input: UpdateReviewInput,
  ): Promise<ReviewRecord> {
    requireAdminActor(actor);
    await this.getById(id, actor);
    const updated = await this.reviews.update(id, {
      ...input,
      content:
        input.content === undefined
          ? undefined
          : requireText(input.content, "content"),
      customerName:
        input.customerName === undefined
          ? undefined
          : requireText(input.customerName, "customerName"),
      rating:
        input.rating === undefined ? undefined : requireRating(input.rating),
    });

    if (updated === null) {
      throw reviewNotFound();
    }

    return updated;
  }

  public async hide(actor: Actor, id: string): Promise<ReviewRecord> {
    requireAdminActor(actor);
    await this.getById(id, actor);
    const updated = await this.reviews.update(id, { isActive: false });

    if (updated === null) {
      throw reviewNotFound();
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

function requireRating(rating: number): number {
  if (!Number.isInteger(rating) || rating < RATING_MIN || rating > RATING_MAX) {
    throw new ValidationError("Validation failed.", [
      { field: "rating", issue: "Enter a rating from 1 to 5." },
    ]);
  }

  return rating;
}

function isAdminViewer(actor: Actor | undefined): boolean {
  return actor !== undefined && isAdminActor(actor);
}
