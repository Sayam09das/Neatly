import { APP_NAME } from "@neatly/config";
import { AUTH_SESSION_COOKIE_NAME } from "@/config/auth";

export const LEGAL_PATHS = {
  cookies: "/cookies",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export const COOKIE_CONSENT_STORAGE_KEY = "neatly_cookie_consent";
export const COOKIE_CONSENT_CHANGE_EVENT = "neatly-cookie-consent-change";

export const COOKIE_CONSENT_HIDDEN_PATH_PREFIXES = [
  "/admin",
  "/dashboard",
  "/cleaner",
] as const;

export const legalSkipToContentLabel = "Skip to content";

export interface LegalSection {
  heading: string;
  headingId: string;
  paragraphs: readonly string[];
}

export interface LegalDocument {
  eyebrow: string;
  heading: string;
  headingId: string;
  intro: string;
  lastUpdated: string;
  metadata: {
    description: string;
    title: string;
  };
  path: string;
  sections: readonly LegalSection[];
}

export const cookieConsentCopy = {
  acceptLabel: "Accept cookies",
  description:
    "Essential cookies keep you signed in. Optional cookies stay off until you accept.",
  heading: "Cookies on this site",
  headingId: "cookie-consent-heading",
  policyLabel: "Cookie policy",
  rejectLabel: "Reject optional",
} as const;

export const cookiePreferencesCopy = {
  heading: "Your cookie choice",
  headingId: "cookie-preferences-heading",
  changeLabel: "Change cookie choices",
  accepted:
    "Optional cookies are allowed. Essential cookies still keep accounts signed in.",
  rejected:
    "Optional cookies are off. Essential cookies still keep accounts signed in.",
  unset: "You have not made a choice yet. Use the banner or the button below.",
} as const;

export const privacyPolicy: LegalDocument = {
  eyebrow: "Legal",
  heading: "Privacy policy",
  headingId: "privacy-heading",
  intro: `${APP_NAME} collects only what is needed to answer quotes, inquiries, newsletter sign-ups, and signed-in accounts. This page is plain-language system copy. It is not a substitute for published business contact details.`,
  lastUpdated: "1 September 2026",
  metadata: {
    description: `How ${APP_NAME} collects, stores, and deletes personal data from quotes, contact forms, cookies, and accounts.`,
    title: "Privacy policy",
  },
  path: LEGAL_PATHS.privacy,
  sections: [
    {
      heading: "What we collect",
      headingId: "privacy-collect",
      paragraphs: [
        "Quote requests may include your name, email, phone, service address, property details, preferred timing, and notes about the visit.",
        "The contact form may include your name, email, optional phone, subject, and message. The newsletter form collects only an email address.",
        "If you create an account, we store your name, email, and a hashed password. We do not store passwords in plain text.",
        "We do not invent or publish customer reviews, phone numbers, or addresses on this site. Published contact details come from site settings when they exist.",
      ],
    },
    {
      heading: "Why we collect it",
      headingId: "privacy-purpose",
      paragraphs: [
        "We use quote and contact details to reply about a cleaning request or a general question. Newsletter email is used only for the notes you subscribed to.",
        "Account details are used to sign you in, protect the session, and show your bookings or admin work. We do not sell personal information.",
      ],
    },
    {
      heading: "Cookies and similar storage",
      headingId: "privacy-cookies",
      paragraphs: [
        `The signed-in session uses an HttpOnly cookie named ${AUTH_SESSION_COOKIE_NAME}. JavaScript cannot read it. It is Secure in production and SameSite=Strict.`,
        "Your cookie choice is stored in this browser so we can remember Accept or Reject optional cookies. See the cookie policy for the current list.",
        "We do not load advertising networks. Optional analytics cookies are not installed unless you accept them and a tracker is later enabled.",
      ],
    },
    {
      heading: "How long we keep it",
      headingId: "privacy-retention",
      paragraphs: [
        "Session cookies last up to seven days, or until you sign out.",
        "Quote, contact, and account records stay until the request is handled or you ask us to delete them. Newsletter email stays until you unsubscribe.",
      ],
    },
    {
      heading: "Who we share it with",
      headingId: "privacy-sharing",
      paragraphs: [
        "Hosting, database, and email providers process data only to run this website and send messages you requested, such as a verification link or a quote follow-up.",
        "We do not share personal data for advertising. We may disclose information if the law requires it.",
      ],
    },
    {
      heading: "Your requests",
      headingId: "privacy-requests",
      paragraphs: [
        "You can ask to access or delete your personal data. Use the contact page until a dedicated deletion form exists. Do not send passwords in that message.",
        "Newsletter messages will include a way to unsubscribe. Signing out ends the current session cookie.",
      ],
    },
  ],
};

export const termsOfService: LegalDocument = {
  eyebrow: "Legal",
  heading: "Terms of service",
  headingId: "terms-heading",
  intro: `These terms cover use of the ${APP_NAME} website, quote requests, and related accounts. Cleaning work follows the scope you accept on a quote. This page does not invent insurance carriers, prices, or cancellation windows that are not stated on a booking.`,
  lastUpdated: "1 September 2026",
  metadata: {
    description: `Website terms for ${APP_NAME}, including quote estimates, accounts, cancellation, and liability limits.`,
    title: "Terms of service",
  },
  path: LEGAL_PATHS.terms,
  sections: [
    {
      heading: "Using this website",
      headingId: "terms-use",
      paragraphs: [
        `You may use this site to learn about ${APP_NAME}, request a quote, contact us, or sign in to an account you created.`,
        "Do not misuse the site, attempt unauthorized access, or submit false details. We may refuse or remove content that is abusive or unlawful.",
      ],
    },
    {
      heading: "Quotes are estimates",
      headingId: "terms-quotes",
      paragraphs: [
        "A quote is based on the details you provide. It is not a contract and not a payment. Payment is not part of the quote request step.",
        "The visit is confirmed only after you accept a quote and complete the booking steps shown in your account. The agreed checklist is the scope of work.",
      ],
    },
    {
      heading: "Accounts",
      headingId: "terms-accounts",
      paragraphs: [
        "You are responsible for keeping your sign-in details private. Tell us through the contact page if you think an account was used without permission.",
        "We may suspend an account that is used to harm the service, other people, or this website.",
      ],
    },
    {
      heading: "Cancellation",
      headingId: "terms-cancel",
      paragraphs: [
        "You may decline a quote before you accept it. After a booking is confirmed, follow the cancellation path shown on that booking.",
        "If a stated cancellation window is missing from a booking, contact us before the visit so we can record the change. Do not assume a free-cancel period that is not written there.",
      ],
    },
    {
      heading: "Liability",
      headingId: "terms-liability",
      paragraphs: [
        "The website is provided so you can request work and manage that request. We are not liable for delays caused by inaccurate details you submit, or for outages outside our reasonable control.",
        "Insurance and satisfaction terms for a completed visit are those stated on the accepted quote and any published site settings. This page does not invent a carrier name or a dollar cap.",
      ],
    },
    {
      heading: "Changes",
      headingId: "terms-changes",
      paragraphs: [
        "We may update these terms when the product changes. The date at the top of this page is the current version. Continued use of the site after an update means you accept the revised terms.",
      ],
    },
  ],
};

export const cookiePolicy: LegalDocument = {
  eyebrow: "Legal",
  heading: "Cookie policy",
  headingId: "cookies-heading",
  intro: `${APP_NAME} uses a small set of cookies and browser storage. Essential items keep you signed in. Optional items stay off until you choose Accept cookies.`,
  lastUpdated: "1 September 2026",
  metadata: {
    description: `Cookie list for ${APP_NAME}: essential session cookies, your consent choice, and optional cookies that stay off until you accept.`,
    title: "Cookie policy",
  },
  path: LEGAL_PATHS.cookies,
  sections: [
    {
      heading: "Essential cookies",
      headingId: "cookies-essential",
      paragraphs: [
        `Signed-in sessions use ${AUTH_SESSION_COOKIE_NAME}. It is HttpOnly, SameSite=Strict, and Secure in production. It lasts up to seven days or until you sign out.`,
        "This cookie is required for customer, cleaner, and admin accounts. Rejecting optional cookies does not remove it.",
      ],
    },
    {
      heading: "Your choice",
      headingId: "cookies-choice",
      paragraphs: [
        `Accept or Reject optional cookies stores a value in this browser under ${COOKIE_CONSENT_STORAGE_KEY}. That record is not an advertising cookie. It only remembers your choice.`,
        "You can change the choice on this page. Clearing site data in your browser also clears it.",
      ],
    },
    {
      heading: "Optional cookies",
      headingId: "cookies-optional",
      paragraphs: [
        "We do not currently load third-party advertising or analytics cookies. If optional measurement is added later, it will stay off until you accept.",
        "Until then, Accept cookies records consent only. No extra tracker is installed by that button today.",
      ],
    },
  ],
};

export const legalDocuments = [
  privacyPolicy,
  termsOfService,
  cookiePolicy,
] as const;

export function shouldOfferCookieConsent(pathname: string): boolean {
  return !COOKIE_CONSENT_HIDDEN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
