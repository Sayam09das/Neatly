import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { BlogPostPage, BlogPostUnavailable } from "@/components/blog-post-page";
import { BlogPostingJsonLd } from "@/components/seo/blog-posting-json-ld";
import { blogPageMetadata } from "@/config/blog-page";
import { blogPostPath } from "@/config/landing";
import { getCurrentUser } from "@/lib/auth/current-user";
import { toCustomerNavbarSession } from "@/lib/customer/navbar";
import { loadPublicBlogPost } from "@/lib/customer/public-blog";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

interface BlogPostRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadPublicBlogPost(slug);

  if (!result.ok) {
    return {
      robots: { follow: true, index: false },
      title: blogPageMetadata.title,
    };
  }

  const description = result.post.seoDescription?.trim() || result.post.excerpt;
  const title = result.post.seoTitle?.trim() || result.post.title;
  const siteUrl = getSiteUrl();
  const canonical =
    siteUrl === undefined
      ? undefined
      : `${siteUrl}${blogPostPath(result.post.slug)}`;

  return {
    description,
    title,
    ...(canonical === undefined
      ? {}
      : {
          alternates: {
            canonical,
          },
        }),
  };
}

export default async function BlogPostRoute({
  params,
}: BlogPostRouteProps): Promise<ReactElement> {
  const { slug } = await params;
  const [user, result] = await Promise.all([
    getCurrentUser(),
    loadPublicBlogPost(slug),
  ]);
  const session = toCustomerNavbarSession(user);

  if (!result.ok && result.notFound) {
    notFound();
  }

  if (!result.ok) {
    return <BlogPostUnavailable session={session} />;
  }

  const siteUrl = getSiteUrl();
  const url =
    siteUrl === undefined
      ? undefined
      : `${siteUrl}${blogPostPath(result.post.slug)}`;

  return (
    <>
      <BlogPostingJsonLd post={result.post} url={url} />
      <BlogPostPage post={result.post} session={session} />
    </>
  );
}
