import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <p className="text-base">Loading</p>
    </main>
  );
}
