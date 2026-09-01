import type { Metadata } from "next";
import type { ReactElement } from "react";
import { TestimonialsPage } from "@/components/testimonials-page";
import { testimonialsPageMetadata } from "@/config/testimonials-page";
import { getCurrentUser } from "@/lib/auth/current-user";
import { toCustomerNavbarSession } from "@/lib/customer/navbar";
import { loadPublicReviews } from "@/lib/customer/public-reviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: testimonialsPageMetadata.description,
  openGraph: {
    description: testimonialsPageMetadata.description,
    title: testimonialsPageMetadata.title,
  },
  title: testimonialsPageMetadata.title,
};

export default async function TestimonialsRoute(): Promise<ReactElement> {
  const [user, reviews] = await Promise.all([
    getCurrentUser(),
    loadPublicReviews(),
  ]);

  return (
    <TestimonialsPage
      reviews={{
        items: reviews.items,
        status: reviews.ok ? "success" : "error",
      }}
      session={toCustomerNavbarSession(user)}
    />
  );
}
