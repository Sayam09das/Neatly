/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesPage } from "@/components/services-page";
import {
  CUSTOMER_PATHS,
  customerCatalogErrorCopy,
  customerEmptyCopy,
  customerServiceApplyLabel,
  customerServiceApplyPath,
  customerServiceDetailsLabel,
  customerServicePath,
  customerServicesCopy,
} from "@/config/customer";
import {
  LANDING_PROCESS_HREF,
  landingFinalCta,
  landingHowItWorks,
  landingWhyNeatly,
  navbarCta,
} from "@/config/landing";
import {
  SERVICES_CATALOG_HREF,
  servicesPageCatalog,
  servicesPageEmpty,
  servicesPageError,
  servicesPageHero,
} from "@/config/services-page";
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

describe("ServicesPage", (): void => {
  it("renders the public catalog from published services without invented prices", (): void => {
    render(
      <ServicesPage
        list={{
          pagination: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
          services,
        }}
        query={{ page: 1, q: "" }}
        status="success"
      />,
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: servicesPageHero.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: servicesPageCatalog.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: servicesPageHero.catalogLabel })[0],
    ).toHaveAttribute("href", SERVICES_CATALOG_HREF);
    expect(
      screen.getAllByRole("link", { name: servicesPageHero.quoteLabel })[0],
    ).toHaveAttribute("href", CUSTOMER_PATHS.quote);
    expect(
      screen.getByRole("link", {
        name: customerServiceDetailsLabel(services[0]?.name ?? ""),
      }),
    ).toHaveAttribute("href", customerServicePath("home-refresh"));
    expect(
      screen.getByRole("link", {
        name: customerServiceApplyLabel(services[0]?.name ?? ""),
      }),
    ).toHaveAttribute("href", customerServiceApplyPath("home-refresh"));
    expect(
      screen.getByRole("link", {
        name: customerServiceDetailsLabel(services[1]?.name ?? ""),
      }),
    ).toHaveAttribute("href", customerServicePath("studio-reset"));
    expect(
      screen.getByText(customerServicesCopy.featuredLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingWhyNeatly.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingWhyNeatly.intro)).toBeInTheDocument();
    for (const feature of landingWhyNeatly.features) {
      expect(
        screen.getByRole("heading", { level: 3, name: feature.title }),
      ).toBeInTheDocument();
    }
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingHowItWorks.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingHowItWorks.intro)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: landingHowItWorks.image.alt }),
    ).toBeInTheDocument();
    for (const step of landingHowItWorks.steps) {
      expect(
        screen.getByRole("heading", { level: 3, name: step.title }),
      ).toBeInTheDocument();
    }
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingFinalCta.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingFinalCta.description)).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: navbarCta.label })[0],
    ).toHaveAttribute("href", navbarCta.href);
    expect(
      screen
        .getAllByRole("link", { name: servicesPageHero.catalogLabel })
        .some(
          (link) =>
            link.getAttribute("href") === landingFinalCta.secondaryCta.href,
        ),
    ).toBe(true);
    expect(
      screen.getAllByRole("link", { name: "How It Works" })[0],
    ).toHaveAttribute("href", LANDING_PROCESS_HREF);
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  }, 15000);

  it("shows a prepared empty state when the catalog has no published services", (): void => {
    render(
      <ServicesPage
        list={{
          pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
          services: [],
        }}
        query={{ page: 1, q: "" }}
        status="success"
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: servicesPageEmpty.title,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(servicesPageEmpty.description)).toBeInTheDocument();
  });

  it("keeps search empty results distinct from an unpublished catalog", (): void => {
    render(
      <ServicesPage
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
  });

  it("explains a catalog failure without technical details", (): void => {
    render(
      <ServicesPage list={null} query={{ page: 1, q: "" }} status="error" />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      servicesPageError.heading,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      customerCatalogErrorCopy.description,
    );
    expect(
      screen.getByRole("button", { name: servicesPageError.action }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/prisma/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/500/)).not.toBeInTheDocument();
  });
});
