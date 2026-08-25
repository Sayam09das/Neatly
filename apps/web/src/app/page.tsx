import { APP_NAME } from "@neatly/config";
import type { ReactElement } from "react";

export default function HomePage(): ReactElement {
  return (
    <main className="mx-auto max-w-content px-gutter py-section">
      <h1 className="text-h1 text-foreground tracking-tight">{APP_NAME}</h1>
      <p className="mt-4 text-body text-muted-foreground">
        Application foundation is ready.
      </p>
    </main>
  );
}
