import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="mx-auto max-w-content px-gutter py-section"
    >
      <p className="text-body text-muted-foreground">Loading</p>
    </main>
  );
}
