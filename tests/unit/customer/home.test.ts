import { describe, expect, it } from "vitest";
import { CUSTOMER_PATHS, customerSurfaceCopy } from "@/config/customer";
import {
  getPublishedLandingCta,
  landingCtas,
  landingHero,
} from "@/config/landing";
import {
  getHomeAccountCta,
  getHomeHeroSecondaryCta,
  getHomeProcessQuotesHref,
} from "@/lib/customer/home";

const customerSession = {
  identity: { email: "ada@neatly.example", name: "Ada" },
  role: "CUSTOMER",
} as const;

const adminSession = {
  identity: { email: "ops@neatly.example", name: "Ops" },
  role: "ADMIN",
} as const;

describe("home CTAs", (): void => {
  it("keeps guest and admin visitors on public quote and services routes", (): void => {
    expect(getHomeHeroSecondaryCta(null)).toEqual({
      href: landingCtas.secondary.href,
      label: landingHero.secondaryActionLabel,
    });
    expect(getHomeHeroSecondaryCta(adminSession)).toEqual({
      href: landingCtas.secondary.href,
      label: landingHero.secondaryActionLabel,
    });
    expect(getHomeAccountCta(null)).toBeNull();
    expect(getHomeAccountCta(adminSession)).toBeNull();
    expect(getHomeProcessQuotesHref(null)).toBeUndefined();
    expect(getHomeProcessQuotesHref(adminSession)).toBeUndefined();
    expect(landingCtas.primary.href).toBe(CUSTOMER_PATHS.quote);
    expect(landingCtas.secondary.href).toBe(CUSTOMER_PATHS.services);
    expect(getPublishedLandingCta(landingCtas.viewWork)).toBeNull();
    expect(getPublishedLandingCta(landingCtas.readJournal)).toEqual({
      href: "/blog",
      label: landingCtas.readJournal.label,
    });
    expect(getPublishedLandingCta(landingCtas.contact)).toEqual({
      href: landingCtas.contact.href,
      label: landingCtas.contact.label,
    });
  });

  it("adds a customer account action without exposing admin routes", (): void => {
    expect(getHomeHeroSecondaryCta(customerSession)).toEqual({
      href: CUSTOMER_PATHS.dashboard,
      label: customerSurfaceCopy.dashboard.title,
    });
    expect(getHomeAccountCta(customerSession)).toEqual({
      href: CUSTOMER_PATHS.dashboard,
      label: customerSurfaceCopy.dashboard.title,
    });
    expect(getHomeProcessQuotesHref(customerSession)).toBe(
      CUSTOMER_PATHS.quotes,
    );
    expect(getHomeHeroSecondaryCta(customerSession).href).not.toMatch(
      /^\/admin/,
    );
  });
});
