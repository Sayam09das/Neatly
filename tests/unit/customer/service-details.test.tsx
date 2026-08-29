/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServiceDetails } from "@/components/customer/services/service-details";
import {
  customerQuoteLabel,
  customerQuotePath,
  customerServiceDetailCopy,
  customerServicesCopy,
} from "@/config/customer";
import type { CustomerServiceDetail } from "@/types/customer";

const service: CustomerServiceDetail = {
  benefits: ["Tidy kitchen"],
  coverImageAlt: null,
  coverImageUrl: null,
  excludedTasks: ["Interior oven"],
  faqs: [],
  fullDescription: "A complete residential clean.",
  id: "svc_1",
  includedTasks: ["Counters"],
  isFeatured: false,
  name: "Home Refresh",
  seoDescription: null,
  seoTitle: null,
  shortDescription: "Weekly tidy",
  slug: "home-refresh",
};

describe("ServiceDetails", (): void => {
  it("renders real service content and a quote entry point", (): void => {
    render(<ServiceDetails service={service} />);

    expect(
      screen.getByRole("heading", { level: 1, name: service.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(service.fullDescription)).toBeInTheDocument();
    expect(screen.getByText("Counters")).toBeInTheDocument();
    expect(screen.getByText("Interior oven")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: customerQuoteLabel(service.name) }),
    ).toHaveAttribute("href", customerQuotePath(service.slug));
    expect(
      screen.getByRole("link", { name: customerServicesCopy.backToServices }),
    ).toHaveAttribute("href", "/services");
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(screen.queryByText(/edit service/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(customerServiceDetailCopy.faqsHeading),
    ).not.toBeInTheDocument();
  });
});
