import localFont from "next/font/local";

export const geistSans = localFont({
  src: [
    {
      path: "../../public/fonts/geist/Geist[wght].woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../../public/fonts/geist/Geist-Italic[wght].woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  variable: "--font-neatly-sans",
});

export const geistMono = localFont({
  src: [
    {
      path: "../../public/fonts/geist-mono/GeistMono[wght].woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../../public/fonts/geist-mono/GeistMono-Italic[wght].woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
  preload: false,
  variable: "--font-neatly-mono",
});
