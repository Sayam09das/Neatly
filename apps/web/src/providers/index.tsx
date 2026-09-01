import type { ReactElement, ReactNode } from "react";
import { SmoothScroll } from "@/animations/lenis/smooth-scroll";
import { Toaster } from "@/components/feedback/toaster";
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): ReactElement {
  return (
    <ThemeProvider>
      <SmoothScroll>
        {children}
        <CookieConsentBanner />
        <Toaster />
      </SmoothScroll>
    </ThemeProvider>
  );
}
