"use client";

import { Button, Card } from "@neatly/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactElement } from "react";
import { fadeUp } from "@/animations/motion/variants";
import { BlogRowActions } from "@/components/admin/blog/blog-row-actions";
import { BlogStatusBadge } from "@/components/admin/blog/blog-status-badge";
import { adminBlogCopy, getAdminBlogDetailsPath } from "@/config/admin-blog";
import {
  formatBlogInstant,
  getBlogCategoryLabel,
  getBlogTitle,
} from "@/lib/admin/blog";
import type { AdminBlogPost } from "@/types/admin-blog";

interface BlogCardProps {
  post: AdminBlogPost;
}

export function BlogCard({ post }: BlogCardProps): ReactElement {
  return (
    <motion.article
      className="rounded-lg border border-border bg-surface p-4"
      data-slot="blog-card"
      variants={fadeUp}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-body-small font-medium text-foreground">
            {getBlogTitle(post.title)}
          </p>
          <p className="mt-1 truncate text-caption text-muted-foreground">
            {post.slug}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <BlogStatusBadge status={post.status} />
          <BlogRowActions post={post} />
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-2">
        <BlogCardField
          label={adminBlogCopy.tableCategory}
          value={getBlogCategoryLabel(post.categoryName)}
        />
        <BlogCardField
          label={adminBlogCopy.tablePublished}
          value={formatBlogInstant(post.publishedAt, { dateStyle: "medium" })}
        />
        <BlogCardField
          label={adminBlogCopy.tableCreated}
          value={formatBlogInstant(post.createdAt, { dateStyle: "medium" })}
        />
      </dl>
      <Button asChild className="mt-4 w-full" variant="outline">
        <Link href={getAdminBlogDetailsPath(post.id)}>
          {adminBlogCopy.viewAction}
        </Link>
      </Button>
    </motion.article>
  );
}

interface BlogCardFieldProps {
  label: string;
  value: string;
}

function BlogCardField({ label, value }: BlogCardFieldProps): ReactElement {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="truncate text-body-small text-foreground">{value}</dd>
    </div>
  );
}

interface BlogCardListProps {
  posts: readonly AdminBlogPost[];
}

export function BlogCardList({ posts }: BlogCardListProps): ReactElement {
  return (
    <Card
      className="flex flex-col gap-3 p-3 shadow-none md:hidden"
      data-slot="blog-card-list"
    >
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </Card>
  );
}
