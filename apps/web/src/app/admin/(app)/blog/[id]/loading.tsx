import { Card } from "@neatly/ui";
import type { ReactElement } from "react";
import { BlogLoading } from "@/components/admin/blog/blog-states";
import { adminBlogCopy } from "@/config/admin-blog";

export default function AdminBlogDetailsLoading(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page space-y-8">
      <div className="max-w-prose space-y-3">
        <h1 className="text-h1 text-foreground tracking-tight">
          {adminBlogCopy.detailsHeading}
        </h1>
        <p className="text-body text-muted-foreground">
          {adminBlogCopy.detailsDescription}
        </p>
      </div>
      <Card className="p-6 shadow-none">
        <BlogLoading />
      </Card>
    </div>
  );
}
