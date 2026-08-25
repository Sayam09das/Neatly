import { APP_NAME } from "@neatly/config";
import type { ReactElement } from "react";

export default function HomePage(): ReactElement {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">{APP_NAME}</h1>
      <p className="mt-4 text-base">Application foundation is ready.</p>
    </main>
  );
}
