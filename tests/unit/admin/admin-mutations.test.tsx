/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminBookings } from "@/components/admin/bookings/admin-bookings";
import { AdminCustomers } from "@/components/admin/customers/admin-customers";
import { NotificationItem } from "@/components/admin/notifications/notification-item";
import { ReviewRowActions } from "@/components/admin/reviews/review-row-actions";
import { AdminServices } from "@/components/admin/services/admin-services";
import { BusinessFields } from "@/components/admin/settings/settings-forms";
import { Toaster } from "@/components/feedback/toaster";
import { adminBookingCopy } from "@/config/admin-bookings";
import { adminCustomerCopy } from "@/config/admin-customers";
import { adminNotificationCopy } from "@/config/admin-notifications";
import { adminReviewCopy } from "@/config/admin-reviews";
import { adminServiceCopy } from "@/config/admin-services";
import { adminSettingsCopy } from "@/config/admin-settings";
import { createAdminBooking } from "@/lib/admin/bookings";
import { createAdminCustomer } from "@/lib/admin/customers";
import { markAdminNotificationRead } from "@/lib/admin/notifications";
import { hideAdminReview } from "@/lib/admin/reviews";
import { createAdminService } from "@/lib/admin/services";
import { updateAdminSettings } from "@/lib/admin/settings";
import { clearToasts } from "@/lib/toast";
import type { AdminBooking } from "@/types/admin-booking";
import type { AdminCustomer } from "@/types/admin-customer";
import type { AdminNotification } from "@/types/admin-notification";
import type { AdminReview } from "@/types/admin-review";
import type { AdminService } from "@/types/admin-service";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/customers",
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

vi.mock("@/lib/admin/customers", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/customers")>();
  return { ...actual, createAdminCustomer: vi.fn() };
});

vi.mock("@/lib/admin/services", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/services")>();
  return { ...actual, createAdminService: vi.fn() };
});

vi.mock("@/lib/admin/bookings", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/bookings")>();
  return { ...actual, createAdminBooking: vi.fn() };
});

vi.mock("@/lib/admin/reviews", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/reviews")>();
  return { ...actual, hideAdminReview: vi.fn() };
});

vi.mock("@/lib/admin/notifications", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/admin/notifications")>();
  return { ...actual, markAdminNotificationRead: vi.fn() };
});

vi.mock("@/lib/admin/settings", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin/settings")>();
  return { ...actual, updateAdminSettings: vi.fn() };
});

const TEST_CUSTOMER: AdminCustomer = {
  address: null,
  avatarUrl: null,
  bookingCount: null,
  email: "ada@neatly.test",
  id: "cus_1",
  joinedAt: null,
  name: "Ada Lovelace",
  phone: null,
  statusLabel: "Active",
};

const TEST_SERVICE: AdminService = {
  coverImageUrl: null,
  fullDescription: "Full kitchen reset.",
  id: "svc_1",
  isActive: true,
  name: "Kitchen reset",
  shortDescription: "Reset a kitchen.",
  slug: "kitchen-reset",
};

const TEST_BOOKING: AdminBooking = {
  cleanerId: null,
  cleanerName: null,
  customerId: "cus_1",
  customerName: "Ada Lovelace",
  id: "bkg_1",
  notes: null,
  scheduledAt: null,
  serviceAddress: null,
  serviceId: "svc_1",
  serviceName: "Kitchen reset",
  status: "PENDING",
};

const TEST_REVIEW: AdminReview = {
  content: "The crew was careful.",
  createdAt: null,
  customerName: "Ada Lovelace",
  customerRole: null,
  id: "rev_1",
  isActive: true,
  isFeatured: false,
  rating: 5,
  serviceCategory: "RESIDENTIAL",
};

const TEST_NOTIFICATION: AdminNotification = {
  createdAt: null,
  id: "ntf_1",
  isRead: false,
  message: "A booking is waiting.",
  relatedHref: null,
  relatedLabel: null,
  title: "New booking",
};

const mutationFailure = {
  code: "INVALID_INPUT" as const,
  fields: { email: "Email already exists." },
  forbidden: false,
  message: "Unable to create customer.",
  ok: false as const,
  status: 400,
  unauthorized: false,
};

afterEach((): void => {
  clearToasts();
  vi.clearAllMocks();
});

describe("Admin mutation UI", (): void => {
  it("creates a customer through the API and keeps the dialog open on failure", async (): Promise<void> => {
    const user = userEvent.setup();
    vi.mocked(createAdminCustomer)
      .mockResolvedValueOnce(mutationFailure)
      .mockResolvedValueOnce({
        data: TEST_CUSTOMER,
        ok: true,
        status: 201,
      });

    render(
      <>
        <Toaster />
        <AdminCustomers presentation={{ status: "empty" }} />
      </>,
    );

    const createCustomerButton = screen.getAllByRole("button", {
      name: adminCustomerCopy.primaryAction,
    })[0];

    if (createCustomerButton === undefined) {
      throw new Error("Expected an Add customer action.");
    }

    await user.click(createCustomerButton);

    const dialog = await screen.findByRole("dialog", {
      name: adminCustomerCopy.createTitle,
    });

    await user.type(
      screen.getByLabelText(adminCustomerCopy.nameLabel),
      "Ada Lovelace",
    );
    await user.type(
      screen.getByLabelText(adminCustomerCopy.emailLabel),
      "ada@neatly.test",
    );
    await user.click(
      screen.getByRole("button", { name: adminCustomerCopy.saveLabel }),
    );

    expect(
      (await screen.findAllByText("Unable to create customer.")).length,
    ).toBeGreaterThan(0);
    expect(dialog).toBeInTheDocument();
    expect(createAdminCustomer).toHaveBeenCalledTimes(1);

    await user.click(
      screen.getByRole("button", { name: adminCustomerCopy.saveLabel }),
    );
    await waitFor((): void => {
      expect(
        screen.queryByRole("dialog", { name: adminCustomerCopy.createTitle }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByText(adminCustomerCopy.createSuccess),
    ).toBeInTheDocument();
  });

  it("creates a service and a booking through POST clients", async (): Promise<void> => {
    const user = userEvent.setup();
    vi.mocked(createAdminService).mockResolvedValue({
      data: TEST_SERVICE,
      ok: true,
      status: 201,
    });
    vi.mocked(createAdminBooking).mockResolvedValue({
      data: TEST_BOOKING,
      ok: true,
      status: 201,
    });

    const { rerender } = render(
      <>
        <Toaster />
        <AdminServices presentation={{ status: "empty" }} />
      </>,
    );

    const createServiceButton = screen.getAllByRole("button", {
      name: adminServiceCopy.primaryAction,
    })[0];

    if (createServiceButton === undefined) {
      throw new Error("Expected an Add service action.");
    }

    await user.click(createServiceButton);
    await user.type(
      screen.getByLabelText(adminServiceCopy.nameLabel),
      "Kitchen",
    );
    await user.type(
      screen.getByLabelText(adminServiceCopy.shortDescriptionLabel),
      "Short",
    );
    await user.type(
      screen.getByLabelText(adminServiceCopy.fullDescriptionLabel),
      "Full description",
    );
    await user.click(
      screen.getByRole("button", { name: adminServiceCopy.saveLabel }),
    );
    await waitFor((): void => {
      expect(createAdminService).toHaveBeenCalledWith({
        fullDescription: "Full description",
        name: "Kitchen",
        shortDescription: "Short",
      });
    });

    rerender(
      <>
        <Toaster />
        <AdminBookings
          filterCatalog={{
            cleaners: [{ id: "cln_1", label: "Priya" }],
            customers: [{ id: "cus_1", label: "Ada Lovelace" }],
            services: [{ id: "svc_1", label: "Kitchen reset" }],
          }}
          presentation={{ status: "empty" }}
        />
      </>,
    );

    const createBookingButton = screen.getAllByRole("button", {
      name: adminBookingCopy.primaryAction,
    })[0];

    if (createBookingButton === undefined) {
      throw new Error("Expected a New booking action.");
    }

    await user.click(createBookingButton);
    await user.selectOptions(
      screen.getByLabelText(adminBookingCopy.filterCustomerLabel),
      "cus_1",
    );
    await user.selectOptions(
      screen.getByLabelText(adminBookingCopy.filterServiceLabel),
      "svc_1",
    );
    await user.click(
      screen.getByRole("button", { name: adminBookingCopy.saveLabel }),
    );
    await waitFor((): void => {
      expect(createAdminBooking).toHaveBeenCalled();
    });
    expect(vi.mocked(createAdminBooking).mock.calls[0]?.[0]).toMatchObject({
      customerId: "cus_1",
      serviceId: "svc_1",
    });
  });

  it("hides a review and marks a notification read only after the API succeeds", async (): Promise<void> => {
    const user = userEvent.setup();
    const onMutated = vi.fn();
    vi.mocked(hideAdminReview).mockResolvedValue({
      data: { ...TEST_REVIEW, isActive: false },
      ok: true,
      status: 200,
    });
    vi.mocked(markAdminNotificationRead).mockResolvedValue({
      data: { ...TEST_NOTIFICATION, isRead: true },
      ok: true,
      status: 200,
    });

    render(
      <>
        <Toaster />
        <ReviewRowActions onMutated={onMutated} review={TEST_REVIEW} />
      </>,
    );

    await user.click(
      screen.getByRole("button", { name: adminReviewCopy.actionsLabel }),
    );
    await user.click(
      screen.getByRole("menuitem", { name: adminReviewCopy.hideAction }),
    );
    await user.click(
      screen.getByRole("button", { name: adminReviewCopy.confirmHideAction }),
    );
    await waitFor((): void => {
      expect(hideAdminReview).toHaveBeenCalledWith("rev_1");
    });
    expect(onMutated).toHaveBeenCalledTimes(1);

    render(
      <>
        <Toaster />
        <NotificationItem
          notification={TEST_NOTIFICATION}
          onMutated={onMutated}
        />
      </>,
    );
    await user.click(
      screen.getByRole("button", {
        name: adminNotificationCopy.markReadAction,
      }),
    );
    await waitFor((): void => {
      expect(markAdminNotificationRead).toHaveBeenCalledWith("ntf_1");
    });
  });

  it("saves business settings when persistable and shows a missing-record error otherwise", async (): Promise<void> => {
    const user = userEvent.setup();
    vi.mocked(updateAdminSettings).mockResolvedValue({
      data: {
        address: "1 Harbour Street",
        businessName: "Neatly",
        defaultSeoDesc: "desc",
        defaultSeoTitle: "title",
        email: "hello@neatly.test",
        notificationEmail: "ops@neatly.test",
        phone: "555-0100",
        serviceAreas: [],
        tagline: "Calm cleaning",
      },
      ok: true,
      status: 200,
    });

    const { rerender } = render(<BusinessFields persistable={false} />);
    await user.type(
      screen.getByLabelText(adminSettingsCopy.businessNameLabel),
      "Neatly",
    );
    await user.type(
      screen.getByLabelText(adminSettingsCopy.businessEmailLabel),
      "hello@neatly.test",
    );
    await user.type(
      screen.getByLabelText(adminSettingsCopy.businessPhoneLabel),
      "555-0100",
    );
    await user.type(
      screen.getByLabelText(adminSettingsCopy.businessAddressLabel),
      "1 Harbour Street",
    );
    await user.click(
      screen.getByRole("button", { name: adminSettingsCopy.saveLabel }),
    );
    expect(
      screen.getByText(adminSettingsCopy.settingsMissing),
    ).toBeInTheDocument();
    expect(updateAdminSettings).not.toHaveBeenCalled();

    rerender(<BusinessFields persistable />);
    await user.click(
      screen.getByRole("button", { name: adminSettingsCopy.saveLabel }),
    );
    await waitFor((): void => {
      expect(updateAdminSettings).toHaveBeenCalledWith({
        address: "1 Harbour Street",
        businessName: "Neatly",
        email: "hello@neatly.test",
        phone: "555-0100",
      });
    });
  });
});
