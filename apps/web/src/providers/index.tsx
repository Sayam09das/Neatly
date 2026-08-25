import type { ReactElement, ReactNode } from "react";
import { SmoothScroll } from "@/animations/lenis/smooth-scroll";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): ReactElement {
  return (
    <ThemeProvider>
      <SmoothScroll>{children}</SmoothScroll>
    </ThemeProvider>
  );
}
