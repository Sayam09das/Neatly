import { APP_NAME } from "@neatly/config";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import type { ReactElement, ReactNode } from "react";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
});

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
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): ReactElement {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
