import { afterEach, describe, expect, it, vi } from "vitest";
import { CUSTOMER_API_PATHS } from "@/config/customer";
import { landingBlogHighlights } from "@/config/landing";
import {
  formatPublicBlogDate,
  loadPublicBlogHighlights,
  mapPublicBlogList,
  mapPublicBlogPost,
  splitJournalParagraphs,
} from "@/lib/customer/public-blog";

vi.mock("@neatly/config/server", () => ({
  loadServerEnv: (): { NEATLY_API_URL: string } => ({
    NEATLY_API_URL: "http://127.0.0.1:4010",
  }),
}));

const publicPost = {
  categoryName: "Home Care",
  coverImageAlt: landingBlogHighlights.featuredImage.alt,
  coverImageUrl: landingBlogHighlights.featuredImage.src,
  excerpt: "Sample excerpt for architecture tests only.",
  id: "post-1",
  publishedAt: "2026-09-01T12:00:00.000Z",
  slug: "dev-sample",
  title: "How to keep a kitchen ready between visits",
};

describe("public blog mapping", (): void => {
  it("maps customer-facing fields and strips private metadata", (): void => {
    const mapped = mapPublicBlogPost(publicPost);

    expect(mapped).toMatchObject({
      date: "September 2026",
      href: "/blog/dev-sample",
      slug: "dev-sample",
      title: "How to keep a kitchen ready between visits",
    });
    expect(JSON.stringify(mapped)).not.toContain("authorId");
    expect(JSON.stringify(mapped)).not.toContain("content");
    expect(mapPublicBlogPost({ title: "Broken" })).toBeNull();
    expect(mapPublicBlogList({ items: [publicPost] })).toHaveLength(1);
    expect(formatPublicBlogDate("not-a-date")).toBeUndefined();
    expect(splitJournalParagraphs("One.\n\nTwo.")).toEqual(["One.", "Two."]);
  });
});

describe("loadPublicBlogHighlights", (): void => {
  afterEach((): void => {
    vi.unstubAllGlobals();
  });

  it("loads published journal posts from the public customer API", async (): Promise<void> => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async (): Promise<unknown> => ({
        data: { items: [publicPost] },
        success: true,
      }),
      status: 200,
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await loadPublicBlogHighlights();

    expect(result.ok).toBe(true);
    expect(result.items[0]?.title).toBe(publicPost.title);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      CUSTOMER_API_PATHS.blog,
    );
  });
});
