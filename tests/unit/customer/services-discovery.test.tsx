/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesDiscovery } from "@/components/customer/services/services-discovery";
import {
  CUSTOMER_PATHS,
  customerEmptyCopy,
  customerErrorCopy,
  customerServiceDetailsLabel,
  customerServicePath,
  customerServicesCopy,
  customerSurfaceCopy,
} from "@/config/customer";
import type { CustomerService } from "@/types/customer";

const services: CustomerService[] = [
  {
    coverImageAlt: null,
    coverImageUrl: null,
    id: "svc_1",
    isFeatured: true,
    name: "Home Refresh",
    shortDescription: "Weekly tidy",
    slug: "home-refresh",
  },
  {
    coverImageAlt: "Studio kitchen",
    coverImageUrl: "/media/studio.jpg",
    id: "svc_2",
    isFeatured: false,
    name: "Studio Reset",
    shortDescription: "Apartment reset",
    slug: "studio-reset",
  },
];

describe("ServicesDiscovery", (): void => {
  it("renders published services with real slugs and no invented prices", (): void => {
    render(
      <ServicesDiscovery
        list={{
          pagination: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
          services,
        }}
        query={{ page: 1, q: "" }}
        status="success"
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: customerSurfaceCopy.services.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", {
        name: customerServicesCopy.searchLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole("button", { name: customerServicesCopy.searchSubmit })
        .closest("form"),
    ).toHaveAttribute("action", CUSTOMER_PATHS.services);
    expect(
      screen.getByRole("link", {
        name: customerServiceDetailsLabel(services[0]?.name ?? ""),
      }),
    ).toHaveAttribute("href", customerServicePath("home-refresh"));
    expect(
      screen.getByRole("link", {
        name: customerServiceDetailsLabel(services[1]?.name ?? ""),
      }),
    ).toHaveAttribute("href", customerServicePath("studio-reset"));
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(screen.queryByText(/popular/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", {
        name: customerServicesCopy.paginationLabel,
      }),
    ).not.toBeInTheDocument();
  });

  it("explains empty search results and can return to the full catalog", (): void => {
    render(
      <ServicesDiscovery
        list={{
          pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
          services: [],
        }}
        query={{ page: 1, q: "deep" }}
        status="success"
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: customerEmptyCopy.serviceSearch.title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: customerServicesCopy.browseAll }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.services);
    expect(
      screen.getByRole("link", { name: customerServicesCopy.searchClear }),
    ).toHaveAttribute("href", CUSTOMER_PATHS.services);
  });

  it("keeps the page usable when the catalog request fails", (): void => {
    render(
      <ServicesDiscovery
        list={null}
        query={{ page: 1, q: "" }}
        status="error"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      customerErrorCopy.description,
    );
    expect(
      screen.getByRole("button", { name: customerErrorCopy.action }),
    ).toBeInTheDocument();
  });
});
