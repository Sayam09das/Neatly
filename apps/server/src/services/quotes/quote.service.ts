import {
  QUOTE_AMOUNT_DECIMALS,
  QUOTE_AMOUNT_MAX,
  QUOTE_AMOUNT_MIN,
  QUOTE_PREFERRED_DATE_LEAD_MS,
} from "../../config/quotes.ts";
import type { Actor, SessionCustomerIdentity } from "../../lib/domain/actor.ts";
import { requireAdminActor } from "../../lib/domain/actor.ts";
import {
  catalogItemNotFound,
  invalidQuoteTransition,
  quoteAlreadyConverted,
  quoteRequestNotFound,
} from "../../lib/domain/errors.ts";
import {
  type ListResult,
  resolvePagination,
  resolveSort,
  toListResult,
} from "../../lib/domain/list.ts";
import { ConflictError, ValidationError } from "../../lib/errors.ts";
import type { CatalogRepository } from "../../repositories/catalog.repository.ts";
import type { QuoteRepository } from "../../repositories/quote.repository.ts";
import {
  type AdminQuoteListQuery,
  type AdminQuoteView,
  type CreateQuoteRequestInput,
  type CustomerQuoteListQuery,
  type CustomerQuoteView,
  type PublicQuoteConfirmation,
  QUOTE_SORT_FIELDS,
  type QuoteRequestRecord,
  toAdminQuoteView,
  toCustomerQuoteView,
  toPublicQuoteConfirmation,
  type UpdateAdminQuoteInput,
} from "./quote.types.ts";
import {
  assertAdminQuoteTransition,
  canAdminSetQuotedAmount,
  canCustomerAcceptQuote,
  canCustomerDeclineQuote,
} from "./quote-transitions.ts";

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
    return toCustomerQuoteView(await this.requireOwnedQuote(identity, id));
  }

  public async acceptForCustomer(
    identity: SessionCustomerIdentity,
    id: string,
  ): Promise<CustomerQuoteView> {
    const quote = await this.requireOwnedQuote(identity, id);

    if (quote.status === "ACCEPTED") {
      return toCustomerQuoteView(quote);
    }

    if (quote.status === "CONVERTED") {
      throw quoteAlreadyConverted();
    }

    if (!canCustomerAcceptQuote(quote.status)) {
      throw invalidQuoteTransition();
    }

    const updated = await this.quotes.compareAndUpdate(quote.id, "QUOTED", {
      quotedAmount: quote.quotedAmount,
      status: "ACCEPTED",
    });

    if (updated === null) {
      throw invalidQuoteTransition();
    }

    return toCustomerQuoteView(updated);
  }

  public async declineForCustomer(
    identity: SessionCustomerIdentity,
    id: string,
  ): Promise<CustomerQuoteView> {
    const quote = await this.requireOwnedQuote(identity, id);

    if (!canCustomerDeclineQuote(quote.status)) {
      throw invalidQuoteTransition();
    }

    const updated = await this.quotes.compareAndUpdate(quote.id, "QUOTED", {
      quotedAmount: quote.quotedAmount,
      status: "DECLINED",
    });

    if (updated === null) {
      throw invalidQuoteTransition();
    }

    return toCustomerQuoteView(updated);
  }

  public async listForAdmin(
    actor: Actor,
    query: AdminQuoteListQuery = {},
  ): Promise<ListResult<AdminQuoteView>> {
    requireAdminActor(actor);
    const pagination = resolvePagination(query.pagination);
    const sort = resolveSort(query.sort, QUOTE_SORT_FIELDS);
    const result = await this.quotes.list({ ...query, pagination, sort });
    return toListResult(
      result.items.map(toAdminQuoteView),
      result.total,
      pagination,
    );
  }

  public async getForAdmin(actor: Actor, id: string): Promise<AdminQuoteView> {
    requireAdminActor(actor);
    const quote = await this.quotes.findById(id);

    if (quote === null) {
      throw quoteRequestNotFound();
    }

    return toAdminQuoteView(quote);
  }

  public async updateForAdmin(
    actor: Actor,
    id: string,
    input: UpdateAdminQuoteInput,
  ): Promise<AdminQuoteView> {
    requireAdminActor(actor);
    const quote = await this.quotes.findById(id);

    if (quote === null) {
      throw quoteRequestNotFound();
    }

    if (
      input.adminNotes === undefined &&
      input.quotedAmount === undefined &&
      input.status === undefined
    ) {
      throw new ValidationError("Validation failed.", [
        { field: "status", issue: "Provide a quote update." },
      ]);
    }

    const quotedAmount = this.resolveQuotedAmount(quote, input);
    const nextStatus = this.resolveAdminStatus(quote, input, quotedAmount);

    if (nextStatus !== quote.status) {
      assertAdminQuoteTransition(quote.status, nextStatus);
    } else if (input.status !== undefined && input.status !== quote.status) {
      assertAdminQuoteTransition(quote.status, input.status);
    }

    if (
      quotedAmount !== quote.quotedAmount &&
      !canAdminSetQuotedAmount(quote.status)
    ) {
      throw invalidQuoteTransition();
    }

    const updated = await this.quotes.compareAndUpdate(quote.id, quote.status, {
      adminNotes:
        input.adminNotes === undefined
          ? quote.adminNotes
          : emptyToNull(input.adminNotes),
      quotedAmount,
      status: nextStatus,
    });

    if (updated === null) {
      throw new ConflictError("The quote was updated by another request.");
    }

    return toAdminQuoteView(updated);
  }

  private async requireOwnedQuote(
    identity: SessionCustomerIdentity,
    id: string,
  ): Promise<QuoteRequestRecord> {
    const quote = await this.quotes.findByIdForEmail(
      id,
      identity.email.trim().toLowerCase(),
    );

    if (quote === null) {
      throw quoteRequestNotFound();
    }

    return quote;
  }

  private resolveQuotedAmount(
    quote: QuoteRequestRecord,
    input: UpdateAdminQuoteInput,
  ): number | null {
    if (input.quotedAmount === undefined) {
      return quote.quotedAmount;
    }

    if (input.quotedAmount === null) {
      throw new ValidationError("Validation failed.", [
        { field: "quotedAmount", issue: "Enter a quoted amount." },
      ]);
    }

    return this.assertQuotedAmount(input.quotedAmount);
  }

  private resolveAdminStatus(
    quote: QuoteRequestRecord,
    input: UpdateAdminQuoteInput,
    quotedAmount: number | null,
  ): QuoteRequestRecord["status"] {
    if (input.status !== undefined) {
      if (input.status === "QUOTED" && quotedAmount === null) {
        throw new ValidationError("Validation failed.", [
          { field: "quotedAmount", issue: "Enter a quoted amount." },
        ]);
      }

      if (input.status === "ACCEPTED" || input.status === "CONVERTED") {
        throw invalidQuoteTransition();
      }

      return input.status;
    }

    if (
      input.quotedAmount !== undefined &&
      quotedAmount !== null &&
      canAdminSetQuotedAmount(quote.status)
    ) {
      return "QUOTED";
    }

    return quote.status;
  }

  private assertQuotedAmount(value: number): number {
    if (!Number.isFinite(value) || value < QUOTE_AMOUNT_MIN) {
      throw new ValidationError("Validation failed.", [
        { field: "quotedAmount", issue: "Enter a valid quoted amount." },
      ]);
    }

    if (value > QUOTE_AMOUNT_MAX) {
      throw new ValidationError("Validation failed.", [
        { field: "quotedAmount", issue: "Use a smaller quoted amount." },
      ]);
    }

    const factor = 10 ** QUOTE_AMOUNT_DECIMALS;
    const scaled = value * factor;

    if (Math.abs(scaled - Math.round(scaled)) > 1e-6) {
      throw new ValidationError("Validation failed.", [
        {
          field: "quotedAmount",
          issue: "Use up to two decimal places.",
        },
      ]);
    }

    return Number(value.toFixed(QUOTE_AMOUNT_DECIMALS));
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
