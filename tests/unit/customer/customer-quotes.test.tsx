/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CustomerQuotes } from "@/components/customer/quotes/customer-quotes";
import {
  CUSTOMER_PATHS,
  customerEmptyCopy,
  customerQuoteServiceTypeLabels,
  customerQuoteStatusLabels,
  customerQuotesCopy,
} from "@/config/customer";
import { formatCustomerQuoteDate } from "@/lib/customer/quotes";
import type { CustomerQuoteView } from "@/types/customer";

const quote: CustomerQuoteView = {
  additionalNotes: null,
  approximateSize: "1,000-2,000 sq ft",
  bathrooms: 1,
  bedrooms: 2,
  createdAt: "2026-08-30T10:00:00.000Z",
  email: "ada@neatly.example",
  frequency: "ONE_TIME",
  fullName: "Ada Lovelace",
  id: "cmtfonlc8000srpwvi60xgw1r",
  phone: "9876543210",
  preferredDate: "2026-09-04T00:00:00.000Z",
  preferredTime: "Morning (8am-12pm)",
  propertyType: "APARTMENT",
  serviceAddress: "14 Park Street",
  serviceId: null,
  serviceType: "RESIDENTIAL",
  status: "NEW",
};

describe("CustomerQuotes", (): void => {
  it("renders an honest empty state with a request action", (): void => {
    render(
      <CustomerQuotes
        list={{
          items: [],
          pagination: { limit: 20, page: 1, total: 0, totalPages: 0 },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: customerQuotesCopy.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(customerEmptyCopy.quotes.title),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: customerQuotesCopy.requestAction }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.quote);
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("lists submitted quotes without inventing records", (): void => {
    render(
      <CustomerQuotes
        list={{
          items: [quote],
          pagination: { limit: 20, page: 1, total: 1, totalPages: 1 },
        }}
      />,
    );

    expect(
      screen.getAllByText(customerQuoteServiceTypeLabels.RESIDENTIAL).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(customerQuoteStatusLabels.NEW).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(quote.id).length).toBeGreaterThan(0);
    expect(formatCustomerQuoteDate(quote.preferredDate)).toMatch(/2026/);
  });
});
