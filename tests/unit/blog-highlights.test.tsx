/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogHighlights } from "@/components/sections/journal";
import { formatJournalSlotIndex } from "@/components/sections/journal/journal-index";
import { landingBlogHighlights, landingCtas } from "@/config/landing";

describe("formatJournalSlotIndex", (): void => {
  it("pads reserved slot indexes", (): void => {
    expect(formatJournalSlotIndex(1)).toBe("01");
    expect(formatJournalSlotIndex(3)).toBe("03");
  });
});

describe("BlogHighlights", (): void => {
  it("renders the editorial empty journal without invented articles", (): void => {
    render(<BlogHighlights />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: landingBlogHighlights.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(landingBlogHighlights.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByText(landingBlogHighlights.pendingCategory),
    ).toBeInTheDocument();
    expect(screen.getByText(landingBlogHighlights.intro)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: landingBlogHighlights.emptyMessage,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: landingBlogHighlights.featuredImage.alt,
      }),
    ).toHaveAttribute("src", expect.stringContaining("journal"));
    expect(landingBlogHighlights.slots).toHaveLength(
      landingBlogHighlights.reservedCount,
    );

    for (const [index, slot] of landingBlogHighlights.slots.entries()) {
      expect(
        screen.getByText(`Slot ${formatJournalSlotIndex(index + 1)}`),
      ).toBeInTheDocument();
      expect(screen.getByRole("img", { name: slot.alt })).toBeInTheDocument();
    }

    expect(
      screen.getAllByText(landingBlogHighlights.slotPendingTitle),
    ).toHaveLength(landingBlogHighlights.reservedCount);
    expect(
      screen.queryByRole("link", { name: landingCtas.readJournal.label }),
    ).toHaveAttribute("href", "/blog");
    expect(document.querySelector('a[href="/blog"]')).not.toBeNull();
    expect(screen.queryByText(/ultimate/i)).not.toBeInTheDocument();
    expect(screen.queryByText("%")).not.toBeInTheDocument();
  });

  it("renders published journal titles instead of reserved placeholders", (): void => {
    render(
      <BlogHighlights
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
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "How to keep a kitchen ready between visits",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /How to keep a kitchen ready between visits/i,
      }),
    ).toHaveAttribute("href", "/blog/dev-sample");
    expect(
      screen.queryByRole("heading", {
        level: 3,
        name: landingBlogHighlights.emptyMessage,
      }),
    ).not.toBeInTheDocument();
  });
});
