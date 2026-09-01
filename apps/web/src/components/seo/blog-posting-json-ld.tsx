import type { ReactElement } from "react";
import { buildBlogPostingJsonLd } from "@/lib/seo/blog-json-ld";
import type { PublicBlogPostDetailPayload } from "@/lib/validations/public-blog.schema";

interface BlogPostingJsonLdProps {
  post: PublicBlogPostDetailPayload;
  url: string | undefined;
}

export function BlogPostingJsonLd({
  post,
  url,
}: BlogPostingJsonLdProps): ReactElement {
  return (
    <script type="application/ld+json">
      {JSON.stringify(buildBlogPostingJsonLd({ post, url }))}
    </script>
  );
}
