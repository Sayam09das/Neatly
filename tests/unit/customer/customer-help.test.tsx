/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CustomerHelp } from "@/components/customer/help/customer-help";
import {
  CUSTOMER_PATHS,
  customerHelpCopy,
  customerServicePath,
} from "@/config/customer";
import type { CustomerHelpWorkspace } from "@/types/customer";

const workspace: CustomerHelpWorkspace = {
  topics: [
    {
      faqs: [{ answer: "Yes, weekly.", question: "Is this recurring?" }],
      name: "Home Refresh",
      slug: "home-refresh",
    },
  ],
};

const unpublishedContact = {
  address: null,
  email: null,
  hours: null,
  phone: null,
};

describe("CustomerHelp", (): void => {
  it("renders real service FAQs and account links without fake contact", (): void => {
    render(<CustomerHelp contact={unpublishedContact} workspace={workspace} />);

    expect(
      screen.getByRole("heading", { name: customerHelpCopy.heading }),
    ).toBeInTheDocument();
    expect(screen.getByText("Is this recurring?")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Manage a booking" }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.bookings);
    expect(
      screen.getByRole("link", { name: "Update your profile" }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.profile);
    expect(screen.getByText(customerHelpCopy.contactEmpty)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home Refresh" })).toHaveAttribute(
      "href",
      customerServicePath("home-refresh"),
    );
    expect(screen.queryByText("admin@neatly.local")).not.toBeInTheDocument();
  });

  it("shows a no-result state that still offers contact support", async (): Promise<void> => {
    const user = userEvent.setup();
    render(<CustomerHelp contact={unpublishedContact} workspace={workspace} />);

    await user.type(
      screen.getByLabelText(customerHelpCopy.searchLabel),
      "payments refund",
    );

    expect(screen.getByText(customerHelpCopy.noResults)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: customerHelpCopy.noResultsAction }),
    ).toHaveAttribute("href", "#customer-help-contact");
    expect(screen.queryByText("Is this recurring?")).not.toBeInTheDocument();
  });
});
