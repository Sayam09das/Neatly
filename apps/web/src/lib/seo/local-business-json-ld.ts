import { APP_NAME } from "@neatly/config";
import {
  getPublishedContact,
  landingMetadata,
  type PublishedContact,
} from "@/config/landing";
import { getSiteUrl } from "@/lib/site-url";

export interface LocalBusinessJsonLd {
  "@context": "https://schema.org";
  "@type": readonly ["LocalBusiness", "CleaningService"];
  address?: string;
  description: string;
  email?: string;
  name: string;
  openingHours?: string;
  telephone?: string;
  url?: string;
}

export interface LocalBusinessJsonLdInput {
  contact: PublishedContact;
  description: string;
  name: string;
  siteUrl: string | undefined;
}

export function buildLocalBusinessJsonLd(
  input: LocalBusinessJsonLdInput,
): LocalBusinessJsonLd {
  const schema: LocalBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "CleaningService"],
    description: input.description,
    name: input.name,
  };

  if (input.siteUrl !== undefined) {
    schema.url = input.siteUrl;
  }

  if (input.contact.address !== null) {
    schema.address = input.contact.address;
  }

  if (input.contact.email !== null) {
    schema.email = input.contact.email;
  }

  if (input.contact.hours !== null) {
    schema.openingHours = input.contact.hours;
  }

  if (input.contact.phone !== null) {
    schema.telephone = input.contact.phone;
  }

  return schema;
}

export function getHomeLocalBusinessJsonLd(): LocalBusinessJsonLd {
  return buildLocalBusinessJsonLd({
    contact: getPublishedContact(),
    description: landingMetadata.description,
    name: APP_NAME,
    siteUrl: getSiteUrl(),
  });
}
