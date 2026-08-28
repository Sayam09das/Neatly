import type { ReactElement, ReactNode } from "react";

interface AdminSectionProps {
  children: ReactNode;
  description?: string;
  title: string;
}

export function AdminSection({
  children,
  description,
  title,
}: AdminSectionProps): ReactElement {
  return (
    <section className="flex flex-col gap-4">
      <div className="max-w-prose">
        <h2 className="text-h3 text-foreground tracking-tight">{title}</h2>
        {description === undefined ? null : (
          <p className="mt-1 text-body-small text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
