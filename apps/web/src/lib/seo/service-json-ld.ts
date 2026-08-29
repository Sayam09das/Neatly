import { APP_NAME } from "@neatly/config";
import type { CustomerServiceDetail } from "@/types/customer";

export interface ServiceJsonLd {
  "@context": "https://schema.org";
  "@type": "Service";
  description: string;
  name: string;
  provider: {
    "@type": "CleaningService";
    name: string;
  };
  url?: string;
}

export function buildServiceJsonLd(input: {
  service: CustomerServiceDetail;
  url: string | undefined;
}): ServiceJsonLd {
  const description =
    input.service.seoDescription?.trim() ||
    input.service.shortDescription.trim() ||
    input.service.fullDescription.trim();

  const schema: ServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    description,
    name: input.service.name,
    provider: {
      "@type": "CleaningService",
      name: APP_NAME,
    },
  };

  if (input.url !== undefined) {
    schema.url = input.url;
  }

  return schema;
}
