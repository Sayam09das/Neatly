import type { Metadata } from "next";
import type { ReactElement } from "react";
import { BlogPage } from "@/components/blog-page";
import { blogPageMetadata } from "@/config/blog-page";
import { getCurrentUser } from "@/lib/auth/current-user";
import { toCustomerNavbarSession } from "@/lib/customer/navbar";
import { loadPublicBlogPosts } from "@/lib/customer/public-blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: blogPageMetadata.description,
  openGraph: {
    description: blogPageMetadata.description,
    title: blogPageMetadata.title,
  },
  title: blogPageMetadata.title,
};

export default async function BlogRoute(): Promise<ReactElement> {
  const [user, posts] = await Promise.all([
    getCurrentUser(),
    loadPublicBlogPosts(),
  ]);

  return (
    <BlogPage
      posts={posts.items}
      session={toCustomerNavbarSession(user)}
      status={posts.ok ? "success" : "error"}
    />
  );
}
