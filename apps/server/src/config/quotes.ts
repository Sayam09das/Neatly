export const QUOTE_RATE_LIMIT_MAX = 3;
export const QUOTE_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const QUOTE_FULL_NAME_MIN_LENGTH = 2;
export const QUOTE_FULL_NAME_MAX_LENGTH = 80;
export const QUOTE_NOTES_MAX_LENGTH = 1_000;
export const QUOTE_ADDRESS_MIN_LENGTH = 3;
export const QUOTE_ADDRESS_MAX_LENGTH = 200;
export const QUOTE_PHONE_MIN_DIGITS = 10;
export const QUOTE_PHONE_MAX_DIGITS = 15;
export const QUOTE_PREFERRED_DATE_LEAD_MS = 24 * 60 * 60 * 1000;
export const QUOTE_BEDROOMS_MIN = 0;
export const QUOTE_BEDROOMS_MAX = 8;
export const QUOTE_BATHROOMS_MIN = 1;
export const QUOTE_BATHROOMS_MAX = 10;

export const QUOTE_APPROXIMATE_SIZES = [
  "Under 1,000 sq ft",
  "1,000-2,000 sq ft",
  "2,000-3,500 sq ft",
  "3,500+ sq ft",
] as const;

export const QUOTE_PREFERRED_TIMES = [
  "Morning (8am-12pm)",
  "Afternoon (12pm-4pm)",
  "Evening (4pm-8pm)",
] as const;

export const QUOTE_RESIDENTIAL_PROPERTY_TYPES = [
  "HOUSE",
  "APARTMENT",
  "CONDO",
] as const;

export const QUOTE_AMOUNT_MIN = 0.01;
export const QUOTE_AMOUNT_MAX = 1_000_000;
export const QUOTE_AMOUNT_DECIMALS = 2;

export type QuoteApproximateSize = (typeof QUOTE_APPROXIMATE_SIZES)[number];
export type QuotePreferredTime = (typeof QUOTE_PREFERRED_TIMES)[number];
