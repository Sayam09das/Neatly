import { APP_NAME } from "@neatly/config";
import { landingCtas, landingFooter, navbarCta } from "@/config/landing";

export const contactMetadata = {
  description: `Contact ${APP_NAME} for general questions. Cleaning visits start with a quote so the scope and timing stay explicit.`,
  title: "Contact",
} as const;

export const contactPageCopy = {
  detailsHeading: "Business details",
  detailsHeadingId: "contact-details-heading",
  eyebrow: "Contact",
  heading: "How to reach Neatly.",
  headingId: "contact-heading",
  intro:
    "Use this page for general questions. Cleaning visits start with a quote so scope and timing stay explicit.",
  quoteCta: {
    href: navbarCta.href,
    label: navbarCta.label,
  },
  quoteHint: "Need a cleaning visit?",
  unpublishedDetails:
    "Phone, email, hours, and address appear here after they are published in site settings.",
} as const;

export const contactFormCopy = {
  description:
    "Share a question that is not a quote request. This form does not book a visit or store a message yet.",
  fields: {
    email: {
      label: "Email",
      placeholder: "name@example.com",
    },
    fullName: {
      label: "Full name",
      placeholder: "Your name",
    },
    message: {
      label: "Message",
      placeholder: "How can we help?",
    },
    phone: {
      label: "Phone",
      placeholder: "Optional",
    },
    subject: {
      label: "Subject",
      placeholder: "What is this about?",
    },
  },
  heading: "General inquiry",
  headingId: "contact-form-heading",
  quoteActionLabel: landingCtas.primary.label,
  submitLabel: "Send message",
  submittingLabel: "Sending",
  unavailableMessage:
    "This form is not connected yet. No inquiry is stored. Request a quote for a cleaning visit.",
} as const;

export const contactDetailLabels = {
  address: landingFooter.addressLabel,
  email: landingFooter.emailLabel,
  hours: landingFooter.hoursLabel,
  phone: landingFooter.phoneLabel,
} as const;
