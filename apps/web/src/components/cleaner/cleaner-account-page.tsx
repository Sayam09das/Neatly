import type { ReactElement } from "react";

interface CleanerAccountPageProps {
  description: string;
  heading: string;
}

export function CleanerAccountPage({
  description,
  heading,
}: CleanerAccountPageProps): ReactElement {
  return (
    <header className="max-w-prose">
      <h1 className="text-h1 text-foreground tracking-tight">{heading}</h1>
      <p className="mt-3 text-body text-muted-foreground">{description}</p>
    </header>
  );
}
