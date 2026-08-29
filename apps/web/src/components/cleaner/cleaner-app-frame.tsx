import type { ReactElement, ReactNode } from "react";
import { CleanerShell } from "@/components/cleaner/cleaner-shell";
import type { CleanerNavbarIdentity } from "@/lib/cleaner/identity";

interface CleanerAppFrameProps {
  children: ReactNode;
  identity?: CleanerNavbarIdentity;
}

export function CleanerAppFrame({
  children,
  identity,
}: CleanerAppFrameProps): ReactElement {
  return (
    <CleanerShell
      identity={
        identity ?? {
          email: null,
          name: "",
        }
      }
    >
      {children}
    </CleanerShell>
  );
}
