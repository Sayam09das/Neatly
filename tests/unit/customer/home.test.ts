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
    expect(landingCtas.primary.href).toBe(CUSTOMER_PATHS.quote);
    expect(landingCtas.secondary.href).toBe(CUSTOMER_PATHS.services);
    expect(getPublishedLandingCta(landingCtas.viewWork)).toBeNull();
    expect(getPublishedLandingCta(landingCtas.readJournal)).toBeNull();
    expect(getPublishedLandingCta(landingCtas.contact)).toBeNull();
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
    expect(getHomeHeroSecondaryCta(customerSession).href).not.toMatch(
      /^\/admin/,
    );
  });
});
