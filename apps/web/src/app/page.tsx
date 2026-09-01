import type { Metadata } from "next";
import type { ReactElement } from "react";
import { LandingPage } from "@/components/landing-page";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-json-ld";
import { landingMetadata } from "@/config/landing";
import { getCurrentUser } from "@/lib/auth/current-user";
import { toCustomerNavbarSession } from "@/lib/customer/navbar";
import { loadPublicBlogHighlights } from "@/lib/customer/public-blog";
import { loadPublicReviews } from "@/lib/customer/public-reviews";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  description: landingMetadata.description,
  openGraph: {
    description: landingMetadata.description,
    images: [
      {
        alt: landingMetadata.openGraphImage.alt,
        height: landingMetadata.openGraphImage.height,
        url: landingMetadata.openGraphImage.src,
        width: landingMetadata.openGraphImage.width,
      },
    ],
    title: landingMetadata.title,
    type: "website",
    ...(siteUrl === undefined ? {} : { url: siteUrl }),
  },
  robots: {
    follow: true,
    index: true,
  },
  title: {
    absolute: landingMetadata.title,
  },
  ...(siteUrl === undefined
    ? {}
    : {
        alternates: {
          canonical: siteUrl,
        },
      }),
};

export default async function HomePage(): Promise<ReactElement> {
  const session = toCustomerNavbarSession(await getCurrentUser());
  const [reviews, journal] = await Promise.all([
    loadPublicReviews(),
    loadPublicBlogHighlights(),
  ]);

  return (
    <>
      <LocalBusinessJsonLd />
      <LandingPage
        journal={{
          items: journal.items,
          status: journal.ok ? "success" : "error",
        }}
        reviews={{
          items: reviews.items,
          status: reviews.ok ? "success" : "error",
        }}
        session={session}
      />
    </>
  );
}
