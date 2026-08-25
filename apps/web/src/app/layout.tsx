import { APP_NAME } from "@neatly/config";
import type { Metadata, Viewport } from "next";
import type { ReactElement, ReactNode } from "react";
import { geistMono, geistSans } from "@/app/fonts";
import { getSiteUrl } from "@/lib/site-url";
import { Providers } from "@/providers";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "A clean, high-trust website for professional residential and commercial cleaning services.",
  applicationName: APP_NAME,
  ...(siteUrl === undefined
    ? {}
    : {
        metadataBase: new URL(siteUrl),
      }),
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): ReactElement {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} light`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
