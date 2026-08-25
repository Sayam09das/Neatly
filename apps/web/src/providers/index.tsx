import type { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): ReactElement {
  return <ThemeProvider>{children}</ThemeProvider>;
}
