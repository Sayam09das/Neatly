import type { QuoteStatus } from "@prisma/client";
import { invalidQuoteTransition } from "../../lib/domain/errors.ts";

export const ADMIN_QUOTE_STATUS_TRANSITIONS: Record<
  QuoteStatus,
  readonly QuoteStatus[]
> = {
  ACCEPTED: [],
  CLOSED: [],
  CONTACTED: ["QUOTED", "DECLINED", "CLOSED", "REVIEWING"],
  CONVERTED: [],
  DECLINED: ["CLOSED"],
  NEW: ["REVIEWING", "CONTACTED", "QUOTED", "DECLINED", "CLOSED"],
  QUOTED: ["DECLINED", "CLOSED"],
  REVIEWING: ["CONTACTED", "QUOTED", "DECLINED", "CLOSED", "NEW"],
};

export function canAdminTransitionQuoteStatus(
  from: QuoteStatus,
  to: QuoteStatus,
): boolean {
  if (from === to) {
    return from === "QUOTED" || from === "REVIEWING" || from === "CONTACTED";
  }

  return ADMIN_QUOTE_STATUS_TRANSITIONS[from].includes(to);
}

export function assertAdminQuoteTransition(
  from: QuoteStatus,
  to: QuoteStatus,
): void {
  if (!canAdminTransitionQuoteStatus(from, to)) {
    throw invalidQuoteTransition();
  }
}

export function canCustomerAcceptQuote(status: QuoteStatus): boolean {
  return status === "QUOTED" || status === "ACCEPTED";
}

export function canCustomerDeclineQuote(status: QuoteStatus): boolean {
  return status === "QUOTED";
}

export function canAdminSetQuotedAmount(status: QuoteStatus): boolean {
  return (
    status === "NEW" ||
    status === "REVIEWING" ||
    status === "CONTACTED" ||
    status === "QUOTED"
  );
}
