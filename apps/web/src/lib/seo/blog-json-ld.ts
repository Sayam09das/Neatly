import { APP_NAME } from "@neatly/config";
import type { PublicBlogPostDetailPayload } from "@/lib/validations/public-blog.schema";

export interface BlogPostingJsonLd {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  datePublished?: string;
  description: string;
  headline: string;
  image?: string;
  publisher: {
    "@type": "Organization";
    name: string;
  };
  url?: string;
}

export function buildBlogPostingJsonLd(input: {
  post: PublicBlogPostDetailPayload;
  url: string | undefined;
}): BlogPostingJsonLd {
  const description =
    input.post.seoDescription?.trim() || input.post.excerpt.trim();
  const schema: BlogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    description,
    headline: input.post.seoTitle?.trim() || input.post.title,
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
    },
  };

  if (input.post.publishedAt.trim() !== "") {
    schema.datePublished = input.post.publishedAt;
  }

  if (input.post.coverImageUrl !== null && input.post.coverImageUrl !== "") {
    schema.image = input.post.coverImageUrl;
  }

  if (input.url !== undefined) {
    schema.url = input.url;
  }

  return schema;
}
