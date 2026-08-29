import { CUSTOMER_PATHS, customerSurfaceCopy } from "@/config/customer";
import { landingCtas, landingHero } from "@/config/landing";
import {
  type CustomerNavbarSession,
  getCustomerNavbarMode,
} from "@/lib/customer/navbar";

export interface HomeCta {
  href: string;
  label: string;
}

export function getHomeHeroSecondaryCta(
  session: CustomerNavbarSession | null,
): HomeCta {
  if (getCustomerNavbarMode(session, "public") === "customer") {
    return {
      href: CUSTOMER_PATHS.dashboard,
      label: customerSurfaceCopy.dashboard.title,
    };
  }

  return {
    href: landingCtas.secondary.href,
    label: landingHero.secondaryActionLabel,
  };
}

export function getHomeAccountCta(
  session: CustomerNavbarSession | null,
): HomeCta | null {
  if (getCustomerNavbarMode(session, "public") !== "customer") {
    return null;
  }

  return {
    href: CUSTOMER_PATHS.dashboard,
    label: customerSurfaceCopy.dashboard.title,
  };
}
