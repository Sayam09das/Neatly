"use client";

import { Card } from "@neatly/ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { motionDuration } from "@/animations/config/durations";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { BlogCardList } from "@/components/admin/blog/blog-card";
import { BlogDesktopTable } from "@/components/admin/blog/blog-desktop-table";
import { BlogPagination } from "@/components/admin/blog/blog-pagination";
import {
  BlogEmptyState,
  BlogError,
  BlogLoading,
  BlogNoMatchesState,
} from "@/components/admin/blog/blog-states";
import { shouldRenderBlogPagination } from "@/lib/admin/blog";
import type {
  AdminBlogPagination,
  AdminBlogPost,
  AdminBlogPresentation,
} from "@/types/admin-blog";

interface BlogTableProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onPageChange?: (page: number) => void;
  pagination?: AdminBlogPagination;
  posts: readonly AdminBlogPost[];
  presentation: AdminBlogPresentation;
}

export function BlogTable({
  hasActiveFilters,
  onClearFilters,
  onPageChange,
  pagination,
  posts,
  presentation,
}: BlogTableProps): ReactElement {
  return (
    <div className="flex flex-col gap-4" data-slot="blog-table">
      <BlogTableBody
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        posts={posts}
        presentation={presentation}
      />
      {presentation.status === "ready" &&
      shouldRenderBlogPagination(pagination, posts.length) &&
      pagination !== undefined ? (
        <BlogPagination onPageChange={onPageChange} pagination={pagination} />
      ) : null}
    </div>
  );
}

interface BlogTableBodyProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  posts: readonly AdminBlogPost[];
  presentation: AdminBlogPresentation;
}

function BlogTableBody({
  hasActiveFilters,
  onClearFilters,
  posts,
  presentation,
}: BlogTableBodyProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <BlogLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <BlogError onRetry={presentation.onRetry} />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <BlogEmptyState />
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="p-6 shadow-none">
        {hasActiveFilters ? (
          <BlogNoMatchesState onClearFilters={onClearFilters} />
        ) : (
          <BlogEmptyState />
        )}
      </Card>
    );
  }

  return (
    <AnimatePresence initial={false}>
      <motion.div
        animate="visible"
        initial={prefersReducedMotion ? false : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: prefersReducedMotion ? 0 : motionDuration.micro,
            },
          },
        }}
      >
        <BlogCardList posts={posts} />
        <BlogDesktopTable posts={posts} />
      </motion.div>
    </AnimatePresence>
  );
}
