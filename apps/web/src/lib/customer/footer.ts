import { AUTH_ADMIN_HOME_PATH, AUTH_REGISTER_ALIAS_PATH } from "@/config/auth";
import { CUSTOMER_LOGIN_PATH, customerNavbarCopy } from "@/config/customer";
import { customerFooterAccountLinks } from "@/config/customer-nav";
import {
  hasPublishedContact,
  landingFooter,
  navbarCta,
} from "@/config/landing";
import type {
  CustomerNavbarArea,
  CustomerNavbarSession,
} from "@/lib/customer/navbar";
import { getCustomerNavbarPresentation } from "@/lib/customer/navbar";

export interface CustomerFooterNavItem {
  href: string;
  label: string;
}

export interface CustomerFooterUtilityNav {
  heading: string;
  headingId: string;
  links: readonly CustomerFooterNavItem[];
}

const FOOTER_ACCOUNT_HEADING_ID = "footer-account-heading";
const FOOTER_SUPPORT_HEADING_ID = "footer-support-heading";

export function getCustomerFooterUtilityNav(
  session: CustomerNavbarSession | null,
  area: CustomerNavbarArea,
): CustomerFooterUtilityNav | null {
  const presentation = getCustomerNavbarPresentation(session, area);

  if (presentation.mode === "customer") {
    return {
      heading: landingFooter.accountHeading,
      headingId: FOOTER_ACCOUNT_HEADING_ID,
      links: customerFooterAccountLinks,
    };
  }

  if (presentation.mode === "admin") {
    return {
      heading: landingFooter.supportHeading,
      headingId: FOOTER_SUPPORT_HEADING_ID,
      links: [
        { href: AUTH_ADMIN_HOME_PATH, label: customerNavbarCopy.adminLabel },
        { href: navbarCta.href, label: navbarCta.label },
      ],
    };
  }

  if (hasPublishedContact()) {
    return null;
  }

  return {
    heading: landingFooter.supportHeading,
    headingId: FOOTER_SUPPORT_HEADING_ID,
    links: [
      { href: CUSTOMER_LOGIN_PATH, label: customerNavbarCopy.loginLabel },
      { href: AUTH_REGISTER_ALIAS_PATH, label: landingFooter.registerLabel },
      { href: navbarCta.href, label: navbarCta.label },
    ],
  };
}
