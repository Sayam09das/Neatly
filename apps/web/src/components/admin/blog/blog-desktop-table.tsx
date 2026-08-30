"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fade } from "@/animations/motion/variants";
import { BlogRowActions } from "@/components/admin/blog/blog-row-actions";
import { BlogStatusBadge } from "@/components/admin/blog/blog-status-badge";
import { adminBlogCopy } from "@/config/admin-blog";
import {
  formatBlogInstant,
  getBlogCategoryLabel,
  getBlogTitle,
} from "@/lib/admin/blog";
import type { AdminBlogPost } from "@/types/admin-blog";

interface BlogDesktopTableProps {
  posts: readonly AdminBlogPost[];
}

export function BlogDesktopTable({
  posts,
}: BlogDesktopTableProps): ReactElement {
  return (
    <Card className="hidden overflow-x-auto shadow-none md:block">
      <table className="w-full min-w-0 border-collapse text-left">
        <caption className="sr-only">{adminBlogCopy.tableLabel}</caption>
        <thead className="border-b border-border">
          <tr className="text-caption text-muted-foreground">
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBlogCopy.tableTitle}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBlogCopy.tableStatus}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBlogCopy.tableCategory}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBlogCopy.tablePublished}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBlogCopy.tableCreated}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminBlogCopy.tableActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <BlogTableRow key={post.id} post={post} />
          ))}
        </tbody>
      </table>
    </Card>
  );
}

interface BlogTableRowProps {
  post: AdminBlogPost;
}

function BlogTableRow({ post }: BlogTableRowProps): ReactElement {
  return (
    <motion.tr
      className="border-b border-border last:border-b-0"
      data-slot="blog-table-row"
      variants={fade}
    >
      <td className="px-4 py-3">
        <p className="truncate text-body-small text-foreground">
          {getBlogTitle(post.title)}
        </p>
        <p className="truncate text-caption text-muted-foreground">
          {post.slug}
        </p>
      </td>
      <td className="px-4 py-3">
        <BlogStatusBadge status={post.status} />
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {getBlogCategoryLabel(post.categoryName)}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {formatBlogInstant(post.publishedAt, { dateStyle: "medium" })}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {formatBlogInstant(post.createdAt, { dateStyle: "medium" })}
      </td>
      <td className="px-4 py-3">
        <BlogRowActions post={post} />
      </td>
    </motion.tr>
  );
}
