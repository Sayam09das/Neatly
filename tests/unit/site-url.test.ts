import { afterEach, describe, expect, it } from "vitest";
import { getSiteUrl } from "../../apps/web/src/lib/site-url";

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

afterEach((): void => {
  if (originalSiteUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    return;
  }

  process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
});

describe("getSiteUrl", (): void => {
  it("returns undefined when the public site URL is unset", (): void => {
    delete process.env.NEXT_PUBLIC_SITE_URL;

    expect(getSiteUrl()).toBeUndefined();
  });

  it("returns the validated canonical site URL when configured", (): void => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://neatly.example";

    expect(getSiteUrl()).toBe("https://neatly.example");
  });
});
