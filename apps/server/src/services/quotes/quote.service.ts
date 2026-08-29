import { QUOTE_PREFERRED_DATE_LEAD_MS } from "../../config/quotes.ts";
import type { SessionCustomerIdentity } from "../../lib/domain/actor.ts";
import {
  catalogItemNotFound,
  quoteRequestNotFound,
} from "../../lib/domain/errors.ts";
import {
  type ListResult,
  resolvePagination,
  toListResult,
} from "../../lib/domain/list.ts";
import { ConflictError, ValidationError } from "../../lib/errors.ts";
import type { CatalogRepository } from "../../repositories/catalog.repository.ts";
import type { QuoteRepository } from "../../repositories/quote.repository.ts";
import {
  type CreateQuoteRequestInput,
  type CustomerQuoteListQuery,
  type CustomerQuoteView,
  type PublicQuoteConfirmation,
  type QuoteRequestRecord,
  toCustomerQuoteView,
  toPublicQuoteConfirmation,
} from "./quote.types.ts";

export class QuoteService {
  private readonly catalog: CatalogRepository;
  private readonly quotes: QuoteRepository;

  public constructor(quotes: QuoteRepository, catalog: CatalogRepository) {
    this.quotes = quotes;
    this.catalog = catalog;
  }

  public async createPublic(
    input: CreateQuoteRequestInput,
  ): Promise<PublicQuoteConfirmation> {
    const serviceId = await this.resolveActiveServiceId(input.serviceId);
    this.assertPreferredDate(input.preferredDate);

    const created = await this.quotes.create({
      ...input,
      additionalNotes: emptyToNull(input.additionalNotes),
      serviceId,
    });

    return toPublicQuoteConfirmation(created);
  }

  public async getById(id: string): Promise<QuoteRequestRecord> {
    const quote = await this.quotes.findById(id);

    if (quote === null) {
      throw quoteRequestNotFound();
    }

    return quote;
  }

  public async listForCustomer(
    identity: SessionCustomerIdentity,
    query: CustomerQuoteListQuery = {},
  ): Promise<ListResult<CustomerQuoteView>> {
    const pagination = resolvePagination(query.pagination);
    const result = await this.quotes.listByEmail({
      email: identity.email.trim().toLowerCase(),
      pagination,
      status: query.status,
    });

    return toListResult(
      result.items.map(toCustomerQuoteView),
      result.total,
      pagination,
    );
  }

  public async getForCustomer(
    identity: SessionCustomerIdentity,
    id: string,
  ): Promise<CustomerQuoteView> {
    const quote = await this.quotes.findByIdForEmail(
      id,
      identity.email.trim().toLowerCase(),
    );

    if (quote === null) {
      throw quoteRequestNotFound();
    }

    return toCustomerQuoteView(quote);
  }

  private async resolveActiveServiceId(
    serviceId: string | null | undefined,
  ): Promise<string | null> {
    if (serviceId === undefined || serviceId === null) {
      return null;
    }

    const offering = await this.catalog.findById(serviceId);

    if (offering === null) {
      throw catalogItemNotFound();
    }

    if (!offering.isActive) {
      throw new ConflictError("This service is not available.");
    }

    return offering.id;
  }

  private assertPreferredDate(preferredDate: Date): void {
    const min = new Date(Date.now() + QUOTE_PREFERRED_DATE_LEAD_MS);
    const minDay = Date.UTC(
      min.getUTCFullYear(),
      min.getUTCMonth(),
      min.getUTCDate(),
    );

    if (preferredDate.getTime() < minDay) {
      throw new ValidationError("Validation failed.", [
        {
          field: "preferredDate",
          issue: "Choose a date at least 24 hours from now.",
        },
      ]);
    }
  }
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
