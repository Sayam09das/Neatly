/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { QuoteRequestForm } from "@/components/customer/quote/quote-request-form";
import { customerQuoteCopy, customerQuoteFieldCopy } from "@/config/customer";
import type { CustomerServiceDetail } from "@/types/customer";

const service: CustomerServiceDetail = {
  benefits: [],
  coverImageAlt: null,
  coverImageUrl: null,
  excludedTasks: [],
  faqs: [],
  fullDescription: "A complete residential clean.",
  id: "svc_1",
  includedTasks: [],
  isFeatured: false,
  name: "Home Refresh",
  seoDescription: null,
  seoTitle: null,
  shortDescription: "Weekly tidy",
  slug: "home-refresh",
};

describe("QuoteRequestForm contact step", (): void => {
  it("prefills account name and email and offers extra contact fields", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <QuoteRequestForm
        account={{
          address: "12 Oak Street",
          email: "ada@neatly.example",
          name: "Ada Customer",
          phone: "5551234567",
        }}
        service={service}
        serviceUnavailable={false}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: customerQuoteCopy.continue }),
    );
    await user.type(
      screen.getByLabelText(customerQuoteFieldCopy.bedrooms),
      "2",
    );
    await user.type(
      screen.getByLabelText(customerQuoteFieldCopy.bathrooms),
      "1",
    );
    await user.click(
      screen.getByRole("button", { name: customerQuoteCopy.continue }),
    );
    await user.type(
      screen.getByLabelText(customerQuoteFieldCopy.preferredDate),
      "2026-09-10",
    );
    await user.click(
      screen.getByRole("button", { name: customerQuoteCopy.continue }),
    );

    expect(screen.getByLabelText(customerQuoteFieldCopy.fullName)).toHaveValue(
      "Ada Customer",
    );
    expect(screen.getByLabelText(customerQuoteFieldCopy.email)).toHaveValue(
      "ada@neatly.example",
    );
    expect(screen.getByLabelText(customerQuoteFieldCopy.email)).toHaveAttribute(
      "readonly",
    );
    expect(screen.getByLabelText(customerQuoteFieldCopy.phone)).toHaveValue(
      "5551234567",
    );
    expect(
      screen.getByRole("button", { name: customerQuoteCopy.addEmail }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: customerQuoteCopy.addPhone }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: customerQuoteCopy.addPerson }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: customerQuoteCopy.addEmail }),
    );
    expect(
      screen.getByLabelText(customerQuoteFieldCopy.extraEmail),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: customerQuoteCopy.addPhone }),
    );
    await user.click(
      screen.getByRole("button", { name: customerQuoteCopy.addPhone }),
    );
    expect(screen.getAllByLabelText(/additional phone/i)).toHaveLength(2);
    expect(
      screen.queryByRole("button", { name: customerQuoteCopy.addPhone }),
    ).not.toBeInTheDocument();
  });
});
