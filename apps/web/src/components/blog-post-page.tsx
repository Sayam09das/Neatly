import { Button } from "@neatly/ui";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ClosingBand } from "@/components/sections/closing-band";
import { FinalCta } from "@/components/sections/final-cta";
import { Newsletter } from "@/components/sections/newsletter";
import { SiteFooter } from "@/components/sections/site-footer";
import { blogPostPageCopy } from "@/config/blog-page";
import {
  BLOG_PATH,
  landingBlogHighlights,
  TEMPORARY_COPY_NOTE,
} from "@/config/landing";
import { getHomeAccountCta } from "@/lib/customer/home";
import type { CustomerNavbarSession } from "@/lib/customer/navbar";
import {
  formatPublicBlogDate,
  resolveJournalCover,
  splitJournalParagraphs,
} from "@/lib/customer/public-blog";
import type { PublicBlogPostDetailPayload } from "@/lib/validations/public-blog.schema";

interface BlogPostPageProps {
  post: PublicBlogPostDetailPayload;
  session?: CustomerNavbarSession | null;
}

export function BlogPostPage({
  post,
  session = null,
}: BlogPostPageProps): ReactElement {
  const date = formatPublicBlogDate(post.publishedAt);
  const paragraphs = splitJournalParagraphs(post.content);
  const cover = resolveJournalCover(
    {
      coverAlt: post.coverImageAlt ?? "",
      coverSrc: post.coverImageUrl ?? "",
    },
    landingBlogHighlights.featuredImage,
  );

  return (
    <>
      <a
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-gutter focus-visible:z-tooltip focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground"
        href="#main-content"
      >
        Skip to content
      </a>
      <Navbar session={session} />
      <main id="main-content">
        <p className="sr-only">{TEMPORARY_COPY_NOTE}</p>
        <article className="bg-background">
          <div className="mx-auto w-full max-w-page px-gutter py-section">
            <p className="text-label text-primary uppercase">
              {post.categoryName?.trim() ||
                landingBlogHighlights.pendingCategory}
            </p>
            <h1 className="mt-4 max-w-3xl text-display tracking-tight">
              {post.title}
            </h1>
            {date === undefined ? null : (
              <p className="mt-4 text-caption text-muted-foreground">{date}</p>
            )}
            <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-xl bg-muted">
              <Image
                alt={cover.alt}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1280px) 1120px, 100vw"
                src={cover.src}
              />
            </div>
            <div className="mx-auto mt-10 max-w-2xl">
              {paragraphs.map((paragraph, index) => (
                <p
                  className={index === 0 ? "text-body" : "mt-6 text-body"}
                  key={`${String(index)}:${paragraph.slice(0, 32)}`}
                >
                  {paragraph}
                </p>
              ))}
              <div className="mt-10">
                <Button asChild variant="outline">
                  <Link href={BLOG_PATH}>{blogPostPageCopy.backLabel}</Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
        <FinalCta accountCta={getHomeAccountCta(session)} />
        <ClosingBand>
          <Newsletter />
          <SiteFooter session={session} surface="photo" />
        </ClosingBand>
      </main>
    </>
  );
}

interface BlogPostUnavailableProps {
  session?: CustomerNavbarSession | null;
}

export function BlogPostUnavailable({
  session = null,
}: BlogPostUnavailableProps): ReactElement {
  return (
    <>
      <Navbar session={session} />
      <main id="main-content">
        <section className="bg-background">
          <div className="mx-auto w-full max-w-page px-gutter py-section">
            <h1 className="max-w-2xl text-display tracking-tight">
              {blogPostPageCopy.unavailableHeading}
            </h1>
            <p className="mt-6 max-w-xl text-body text-muted-foreground">
              {blogPostPageCopy.unavailableMessage}
            </p>
            <div className="mt-8">
              <Button asChild variant="outline">
                <Link href={BLOG_PATH}>{blogPostPageCopy.backLabel}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
