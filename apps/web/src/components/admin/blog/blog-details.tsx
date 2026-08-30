"use client";

import { Button, Card } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { BlogIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { BlogLoading } from "@/components/admin/blog/blog-states";
import { BlogStatusBadge } from "@/components/admin/blog/blog-status-badge";
import { adminBlogCopy } from "@/config/admin-blog";
import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  formatBlogInstant,
  getBlogCategoryLabel,
  getBlogTagsLabel,
  getBlogTitle,
} from "@/lib/admin/blog";
import type {
  AdminBlogDetailsPresentation,
  AdminBlogPost,
} from "@/types/admin-blog";

interface AdminBlogDetailsProps {
  postId: string;
  presentation?: AdminBlogDetailsPresentation;
}

export function AdminBlogDetails({
  postId,
  presentation,
}: AdminBlogDetailsProps): ReactElement {
  return (
    <BlogDetails
      postId={postId}
      presentation={presentation ?? { status: "empty" }}
    />
  );
}

interface BlogDetailsProps {
  postId: string;
  presentation: AdminBlogDetailsPresentation;
}

export function BlogDetails({
  postId,
  presentation,
}: BlogDetailsProps): ReactElement {
  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-blog-details"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <p className="text-caption text-muted-foreground">{postId}</p>
            <h1 className="mt-2 text-h1 text-foreground tracking-tight">
              {adminBlogCopy.detailsHeading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminBlogCopy.detailsDescription}
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href={ADMIN_PATHS.blog}>{adminBlogCopy.backToBlog}</Link>
            </Button>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <BlogDetailsBody presentation={presentation} />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

interface BlogDetailsBodyProps {
  presentation: AdminBlogDetailsPresentation;
}

function BlogDetailsBody({ presentation }: BlogDetailsBodyProps): ReactElement {
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
        <AdminRetryState
          actionLabel={adminBlogCopy.retryLabel}
          description={adminBlogCopy.errorDescription}
          onRetry={presentation.onRetry}
          title={adminBlogCopy.errorTitle}
        />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <AdminEmptyState
          description={adminBlogCopy.detailsNotFoundDescription}
          icon={BlogIcon}
          title={adminBlogCopy.detailsNotFoundTitle}
        />
      </Card>
    );
  }

  return <BlogDetailsContent post={presentation.post} />;
}

interface BlogDetailsContentProps {
  post: AdminBlogPost;
}

function BlogDetailsContent({ post }: BlogDetailsContentProps): ReactElement {
  const showUpdated = post.updatedAt !== post.createdAt;
  const seoTitle =
    post.seoTitle === null || post.seoTitle.trim() === ""
      ? adminBlogCopy.emptyValue
      : post.seoTitle;
  const seoDescription =
    post.seoDescription === null || post.seoDescription.trim() === ""
      ? adminBlogCopy.emptyValue
      : post.seoDescription;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-6 shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-h3 text-foreground tracking-tight">
              {getBlogTitle(post.title)}
            </h2>
            <p className="mt-1 text-caption text-muted-foreground">
              {post.slug}
            </p>
          </div>
          <BlogStatusBadge status={post.status} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button disabled type="button" variant="outline">
            {adminBlogCopy.editAction}
          </Button>
        </div>
        <p className="mt-2 text-caption text-muted-foreground">
          {adminBlogCopy.createUnavailable}
        </p>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminBlogCopy.postSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminBlogCopy.tableTitle,
              value: getBlogTitle(post.title),
            },
            {
              label: adminBlogCopy.slugLabel,
              value: post.slug,
            },
            {
              label: adminBlogCopy.categoryLabel,
              value: getBlogCategoryLabel(post.categoryName),
            },
            {
              label: adminBlogCopy.tagsLabel,
              value: getBlogTagsLabel(post.tags),
            },
            {
              label: adminBlogCopy.excerptLabel,
              value: post.excerpt,
            },
            {
              label: adminBlogCopy.publishedLabel,
              value: formatBlogInstant(post.publishedAt, {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            },
          ]}
        />
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminBlogCopy.contentSection}
        </h2>
        <p className="mt-4 whitespace-pre-wrap text-body-small text-foreground">
          {post.content}
        </p>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminBlogCopy.seoSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminBlogCopy.seoTitleLabel,
              value: seoTitle,
            },
            {
              label: adminBlogCopy.seoDescriptionLabel,
              value: seoDescription,
            },
          ]}
        />
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminBlogCopy.statusSection}
        </h2>
        <div className="mt-4">
          <BlogStatusBadge status={post.status} />
        </div>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminBlogCopy.timelineSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminBlogCopy.timelineCreated,
              value: formatBlogInstant(post.createdAt, {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            },
            ...(showUpdated
              ? [
                  {
                    label: adminBlogCopy.timelineUpdated,
                    value: formatBlogInstant(post.updatedAt, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }),
                  },
                ]
              : []),
          ]}
        />
      </Card>
    </div>
  );
}

interface DetailListProps {
  items: readonly { label: string; value: string }[];
}

function DetailList({ items }: DetailListProps): ReactElement {
  return (
    <dl className="mt-4 grid gap-3">
      {items.map((item) => (
        <div
          className="grid gap-1 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4"
          key={item.label}
        >
          <dt className="text-caption text-muted-foreground">{item.label}</dt>
          <dd className="whitespace-pre-wrap text-body-small text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
