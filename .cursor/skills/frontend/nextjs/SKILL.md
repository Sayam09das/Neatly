# Next.js App Router Skill — Neatly

This skill provides technical guidelines for leveraging Next.js App Router features, Server Components, Route Handlers, and image/font optimization in **Neatly**.

---

## 1. Server Components by Default

Every page and layout in `app/` MUST be a React Server Component (RSC) by default.
* **Why RSC:** RSCs execute strictly on the server, fetching data directly from the Service layer without sending unnecessary JavaScript bundles to the browser.
* **When to Add `"use client"`:** Restrict `"use client"` *only* to leaf components requiring interactive state (`useState`), event listeners (`onClick`), browser APIs (`window`), animation hooks (`useGSAP`), or form hooks (`useForm`).

---

## 2. Dynamic Route & Metadata Generation

Every dynamic route (`/services/[slug]`, `/blog/[slug]`) MUST export a `generateMetadata()` function:

```tsx
import type { Metadata } from "next";
import { BlogService } from "@/services/blog.service";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await BlogService.getPostBySlug(params.slug);

  if (!post) {
    return { title: "Post Not Found | Neatly" };
  }

  return {
    title: `${post.title} | Neatly Cleaning`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImageUrl],
    },
  };
}
```

---

## 3. Caching & Tag-Based Revalidation

* **Public Pages:** Use Next.js Data Caching with tag-based revalidation (`revalidateTag('services')`, `revalidateTag('blog')`).
* **Private Admin Routes:** Quotes, contact messages, and admin metrics MUST NEVER be cached (`cache: 'no-store'`).
* **On-Demand Cache Invalidation:** Admin CMS mutations MUST invoke `revalidateTag()` or `revalidatePath()` to update public static content instantly.

---

## 4. Route Handlers & Thin Controllers

Route Handlers (`app/api/*/route.ts`) act strictly as thin HTTP controllers:
1. Extract request payload.
2. Validate payload via Zod schema.
3. Authenticate/authorize session via middleware or auth service.
4. Invoke Service method (e.g., `QuoteService.createQuoteRequest()`).
5. Return standardized JSON payload.
