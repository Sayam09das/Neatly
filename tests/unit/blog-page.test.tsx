/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogPage } from "@/components/blog-page";
import { blogPageCopy } from "@/config/blog-page";
import {
  BLOG_PATH,
  landingBlogHighlights,
  landingFinalCta,
} from "@/config/landing";

describe("BlogPage", (): void => {
  it("exposes one h1 and published journal notes", (): void => {
    render(
      <BlogPage
        posts={[
          {
            categoryName: "Home Care",
            coverAlt: landingBlogHighlights.featuredImage.alt,
            coverSrc: landingBlogHighlights.featuredImage.src,
            date: "September 2026",
            excerpt: "Sample excerpt for architecture tests only.",
            href: "/blog/dev-sample",
            id: "post-1",
            slug: "dev-sample",
            title: "How to keep a kitchen ready between visits",
          },
        ]}
        status="success"
      />,
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: blogPageCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "How to keep a kitchen ready between visits",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingFinalCta.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Journal" })[0]).toHaveAttribute(
      "href",
      BLOG_PATH,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
