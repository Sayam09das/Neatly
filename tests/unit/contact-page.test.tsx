/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ContactPage } from "@/components/contact-page";
import { contactFormCopy, contactPageCopy } from "@/config/contact";
import { landingFooter, navbarCta } from "@/config/landing";

describe("ContactPage", (): void => {
  it("exposes one h1, the inquiry form, and unpublished business details", (): void => {
    render(<ContactPage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: contactPageCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: contactFormCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: contactPageCopy.detailsHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(contactPageCopy.unpublishedDetails),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(landingFooter.placeholderContact.phone),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(landingFooter.placeholderContact.email),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: navbarCta.label })[0],
    ).toHaveAttribute("href", navbarCta.href);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  }, 15000);

  it("keeps inquiry fields labeled and does not store a valid submission", async (): Promise<void> => {
    const user = userEvent.setup();
    render(<ContactPage />);

    await user.type(
      screen.getByLabelText(contactFormCopy.fields.fullName.label),
      "Ada Lovelace",
    );
    await user.type(
      screen.getByLabelText(contactFormCopy.fields.email.label),
      "ada@neatly.example",
    );
    await user.type(
      screen.getByLabelText(contactFormCopy.fields.subject.label),
      "Office hours",
    );
    await user.type(
      screen.getByLabelText(contactFormCopy.fields.message.label),
      "Do you clean small offices on weekday evenings?",
    );
    await user.click(
      screen.getByRole("button", { name: contactFormCopy.submitLabel }),
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      contactFormCopy.unavailableMessage,
    );
  });
});
