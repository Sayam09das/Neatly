/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminContactsPage from "@/app/admin/(app)/contacts/page";
import { AdminContacts } from "@/components/admin/contacts/admin-contacts";
import { ContactCard } from "@/components/admin/contacts/contact-card";
import { ContactDetails } from "@/components/admin/contacts/contact-details";
import { ContactStatusBadge } from "@/components/admin/contacts/contact-status-badge";
import { ContactsPagination } from "@/components/admin/contacts/contacts-pagination";
import {
  ADMIN_CONTACT_DETAILS_PATH,
  adminContactCopy,
  adminContactStatusLabels,
  getAdminContactDetailsPath,
} from "@/config/admin-contacts";
import { ADMIN_PATHS } from "@/config/admin-nav";
import type { AdminContact } from "@/types/admin-contact";
import { adminContactStatuses } from "@/types/admin-contact";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/contacts",
  useRouter: (): { replace: () => void } => ({
    replace: (): void => undefined,
  }),
  useSearchParams: (): URLSearchParams => new URLSearchParams(),
}));

vi.mock("@/lib/admin/use-admin-list-state", () => ({
  useAdminListState: <T,>({
    defaults,
  }: {
    defaults: T;
  }): {
    filters: T;
    page: number;
    setFilters: (filters: T) => void;
    setPage: (page: number) => void;
  } => ({
    filters: defaults,
    page: 1,
    setFilters: (): void => undefined,
    setPage: (): void => undefined,
  }),
}));

const TEST_CONTACT: AdminContact = {
  adminNotes: null,
  createdAt: "2026-08-30T09:00:00.000Z",
  email: "ada@neatly.test",
  fullName: "Ada Lovelace",
  id: "contact_test",
  message: "Please confirm weekend availability for a commercial office.",
  phone: "+1-555-0100",
  status: "NEW",
  subject: "Office cleaning inquiry",
  updatedAt: "2026-08-30T09:00:00.000Z",
};

const FORBIDDEN_FAKE_CONTACT_COPY = [
  "John Smith",
  "Jane Doe",
  "MSG-1024",
  "How can I help you today?",
];

describe("Admin contacts page", (): void => {
  it("renders the title, search, filters, metrics, and empty state without fake contacts", async (): Promise<void> => {
    render(<AdminContactsPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminContactCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminContactCopy.description)).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: adminContactCopy.searchLabel }),
    ).toHaveAttribute("placeholder", adminContactCopy.searchPlaceholder);
    expect(
      screen.getByRole("combobox", { name: adminContactCopy.statusLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: adminContactCopy.dateRangeLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminContactCopy.filtersLabel }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminContactCopy.metricTotal)).toBeInTheDocument();
    expect(
      screen.getAllByText(adminContactCopy.metricNew).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminContactCopy.metricRead).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminContactCopy.metricResponded).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminContactCopy.metricArchived).length,
    ).toBeGreaterThan(0);
    await waitFor((): void => {
      expect(screen.getByText(adminContactCopy.emptyTitle)).toBeInTheDocument();
    });
    expect(
      screen.getByText(adminContactCopy.emptyDescription),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", {
        name: adminContactCopy.paginationLabel,
      }),
    ).not.toBeInTheDocument();

    const markup = document.body.textContent ?? "";

    for (const phrase of FORBIDDEN_FAKE_CONTACT_COPY) {
      expect(markup).not.toContain(phrase);
    }
  });

  it("renders loading, error, and retry-ready states", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(
      <AdminContacts presentation={{ status: "loading" }} />,
    );

    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    expect(screen.getByText(adminContactCopy.loadingLabel)).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);

    rerender(
      <AdminContacts
        presentation={{
          onRetry,
          status: "error",
        }}
      />,
    );

    expect(screen.getByText(adminContactCopy.errorTitle)).toBeInTheDocument();
    expect(
      screen.getByText(adminContactCopy.errorDescription),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminContactCopy.retryLabel }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders table structure, mobile cards, and accessible actions for supplied rows", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminContacts
        presentation={{
          contacts: [TEST_CONTACT],
          status: "ready",
        }}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: adminContactCopy.tableSubject,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(TEST_CONTACT.fullName).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText(TEST_CONTACT.email).length).toBeGreaterThan(0);
    expect(screen.getAllByText(TEST_CONTACT.subject).length).toBeGreaterThan(0);
    expect(document.querySelector('[data-slot="contact-card"]')).toBeTruthy();
    expect(
      screen.getAllByRole("link", { name: adminContactCopy.viewAction }).length,
    ).toBeGreaterThan(0);

    const actionButton = screen.getAllByRole("button", {
      name: adminContactCopy.actionsLabel,
    })[0];

    if (actionButton === undefined) {
      throw new Error("Expected a contact actions trigger.");
    }

    await user.click(actionButton);

    expect(
      await screen.findByRole("menuitem", {
        name: adminContactCopy.viewAction,
      }),
    ).toHaveAttribute("href", getAdminContactDetailsPath(TEST_CONTACT.id));
    expect(
      screen.getByRole("menuitem", {
        name: adminContactCopy.markReadAction,
      }),
    ).toHaveAttribute("data-disabled");
    expect(
      screen.getByRole("menuitem", {
        name: adminContactCopy.archiveAction,
      }),
    ).toHaveAttribute("data-disabled");
  });

  it("opens the filter sheet without inventing contact records", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminContacts presentation={{ status: "empty" }} />);

    await user.click(
      screen.getByRole("button", { name: adminContactCopy.filtersLabel }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: adminContactCopy.filterSheetTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminContactCopy.filterSheetDescription),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(
        screen.queryByRole("dialog", {
          name: adminContactCopy.filterSheetTitle,
        }),
      ).not.toBeInTheDocument();
    });
    expect(screen.queryByText(TEST_CONTACT.id)).not.toBeInTheDocument();
  });

  it("shows filter chips and clear filters only when filters are active", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminContacts presentation={{ status: "empty" }} />);

    expect(
      screen.queryByRole("button", { name: adminContactCopy.clearFilters }),
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: adminContactCopy.statusLabel }),
      "NEW",
    );

    expect(
      screen.getByRole("button", {
        name: `Remove ${adminContactCopy.statusLabel}: ${adminContactStatusLabels.NEW}`,
      }),
    ).toBeInTheDocument();
    const clearChip = screen.getAllByRole("button", {
      name: adminContactCopy.clearFilters,
    })[0];

    if (clearChip === undefined) {
      throw new Error("Expected a clear filters action.");
    }

    await user.click(clearChip);
    await waitFor((): void => {
      expect(
        screen.queryByRole("button", { name: adminContactCopy.clearFilters }),
      ).not.toBeInTheDocument();
    });
  });

  it("shows the search-empty state when filters hide supplied contacts", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminContacts
        presentation={{
          contacts: [TEST_CONTACT],
          status: "ready",
        }}
      />,
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: adminContactCopy.statusLabel }),
      "ARCHIVED",
    );

    expect(
      screen.getByText(adminContactCopy.noMatchesTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminContactCopy.noMatchesDescription),
    ).toBeInTheDocument();
    const clearMatches = screen.getAllByRole("button", {
      name: adminContactCopy.clearFilters,
    })[0];

    if (clearMatches === undefined) {
      throw new Error("Expected a clear filters action.");
    }

    await user.click(clearMatches);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});

describe("Contact presentation components", (): void => {
  it("renders every contact status as text", (): void => {
    const { rerender } = render(
      <ContactStatusBadge status={adminContactStatuses[0]} />,
    );

    for (const status of adminContactStatuses) {
      rerender(<ContactStatusBadge status={status} />);
      expect(
        screen.getByText(adminContactStatusLabels[status]),
      ).toBeInTheDocument();
    }
  });

  it("renders a compact contact card for supplied data", (): void => {
    render(<ContactCard contact={TEST_CONTACT} />);

    expect(screen.getByText(TEST_CONTACT.fullName)).toBeInTheDocument();
    expect(screen.getByText(TEST_CONTACT.email)).toBeInTheDocument();
    expect(screen.getByText(TEST_CONTACT.subject)).toBeInTheDocument();
    expect(screen.getByText(adminContactStatusLabels.NEW)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: adminContactCopy.viewAction }),
    ).toHaveAttribute("href", getAdminContactDetailsPath(TEST_CONTACT.id));
  });

  it("renders pagination architecture without inventing pages on empty data", (): void => {
    render(
      <ContactsPagination
        pagination={{
          page: 1,
          pageSize: 10,
          total: 24,
          totalPages: 3,
        }}
      />,
    );

    expect(
      screen.getByRole("navigation", {
        name: adminContactCopy.paginationLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: adminContactCopy.paginationPrevious,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: `${adminContactCopy.paginationPageLabel} 2`,
      }),
    ).toBeInTheDocument();
  });

  it("keeps the details path wired for contact review", (): void => {
    expect(ADMIN_PATHS.contacts).toBe("/admin/contacts");
    expect(ADMIN_CONTACT_DETAILS_PATH).toBe("/admin/contacts/[id]");
    expect(getAdminContactDetailsPath("contact_test")).toBe(
      "/admin/contacts/contact_test",
    );
  });
});

describe("Contact details", (): void => {
  it("renders supplied contact details without inventing timeline events", (): void => {
    render(
      <ContactDetails
        contactId={TEST_CONTACT.id}
        presentation={{ contact: TEST_CONTACT, status: "ready" }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminContactCopy.detailsHeading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(TEST_CONTACT.email)).toBeInTheDocument();
    expect(screen.getByText(TEST_CONTACT.phone ?? "")).toBeInTheDocument();
    expect(screen.getByText(TEST_CONTACT.message)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminContactCopy.markReadAction }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: adminContactCopy.archiveAction }),
    ).toBeDisabled();
    expect(
      screen.getByText(adminContactCopy.timelineCreated),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(adminContactCopy.timelineUpdated),
    ).not.toBeInTheDocument();
  });

  it("renders the not-found state when a contact is unavailable", (): void => {
    render(
      <ContactDetails contactId="missing" presentation={{ status: "empty" }} />,
    );

    expect(
      screen.getByText(adminContactCopy.detailsNotFoundTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: adminContactCopy.backToContacts }),
    ).toHaveAttribute("href", ADMIN_PATHS.contacts);
  });
});
