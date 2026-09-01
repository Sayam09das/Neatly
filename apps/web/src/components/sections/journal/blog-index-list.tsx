import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { blogPageCopy } from "@/config/blog-page";
import { landingBlogHighlights } from "@/config/landing";
import type { LandingJournalPost } from "@/lib/customer/public-blog";
import { resolveJournalCover } from "@/lib/customer/public-blog";

interface BlogIndexListProps {
  posts: ReadonlyArray<LandingJournalPost>;
  status: "error" | "success";
}

export function BlogIndexList({
  posts,
  status,
}: BlogIndexListProps): ReactElement {
  if (status === "error") {
    return (
      <div
        className="rounded-xl border border-border bg-surface p-6 sm:p-8"
        role="status"
      >
        <p className="text-h3 tracking-tight">
          {blogPageCopy.unavailableHeading}
        </p>
        <p className="mt-4 max-w-prose text-body text-muted-foreground">
          {blogPageCopy.errorMessage}
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        className="rounded-xl border border-border bg-surface p-6 sm:p-8"
        role="status"
      >
        <p className="text-h3 tracking-tight">{blogPageCopy.emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-grid sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.id}>
          <BlogIndexCard post={post} />
        </li>
      ))}
    </ul>
  );
}

function BlogIndexCard({ post }: { post: LandingJournalPost }): ReactElement {
  const fallback = landingBlogHighlights.featuredImage;
  const cover = resolveJournalCover(
    { coverAlt: post.coverAlt, coverSrc: post.coverSrc },
    fallback,
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background">
      <Link
        className="flex h-full flex-col rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href={post.href}
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          <Image
            alt={cover.alt}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            src={cover.src}
          />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-label text-primary uppercase">
            {post.categoryName?.trim() || landingBlogHighlights.pendingCategory}
          </p>
          <h2 className="mt-3 text-h3 tracking-tight">{post.title}</h2>
          {post.date === undefined ? null : (
            <p className="mt-2 text-caption text-muted-foreground">
              {post.date}
            </p>
          )}
          <p className="mt-3 text-body-small text-muted-foreground">
            {post.excerpt}
          </p>
          <p className="mt-4 text-body-small text-primary">
            {blogPageCopy.readArticleLabel}
          </p>
        </div>
      </Link>
    </article>
  );
}
