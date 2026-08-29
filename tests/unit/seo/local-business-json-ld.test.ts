import { APP_NAME } from "@neatly/config";
import { describe, expect, it } from "vitest";
import { landingMetadata } from "@/config/landing";
import { buildLocalBusinessJsonLd } from "@/lib/seo/local-business-json-ld";

describe("home LocalBusiness JSON-LD", (): void => {
  it("emits identity fields without unpublished NAP data", (): void => {
    const schema = buildLocalBusinessJsonLd({
      contact: {
        address: null,
        email: null,
        hours: null,
        phone: null,
      },
      description: landingMetadata.description,
      name: APP_NAME,
      siteUrl: "https://neatly.example",
    });

    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "CleaningService"],
      description: landingMetadata.description,
      name: APP_NAME,
      url: "https://neatly.example",
    });
    expect(schema).not.toHaveProperty("telephone");
    expect(schema).not.toHaveProperty("address");
    expect(schema).not.toHaveProperty("email");
    expect(schema).not.toHaveProperty("openingHours");
    expect(JSON.stringify(schema)).not.toMatch(/10,000|99\.9%/);
  });

  it("adds published contact fields only when they exist", (): void => {
    const schema = buildLocalBusinessJsonLd({
      contact: {
        address: "1200 Market Street, San Francisco, CA 94103",
        email: "hello@neatly.example",
        hours: "Mon-Fri 8:00-18:00",
        phone: "+14155550123",
      },
      description: landingMetadata.description,
      name: APP_NAME,
      siteUrl: undefined,
    });

    expect(schema.address).toBe("1200 Market Street, San Francisco, CA 94103");
    expect(schema.email).toBe("hello@neatly.example");
    expect(schema.openingHours).toBe("Mon-Fri 8:00-18:00");
    expect(schema.telephone).toBe("+14155550123");
    expect(schema).not.toHaveProperty("url");
  });
});
