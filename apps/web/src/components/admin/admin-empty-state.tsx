import type { ComponentType, ReactElement, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface AdminEmptyStateProps {
  description: string;
  icon: IconComponent;
  title: string;
}

export function AdminEmptyState({
  description,
  icon: Icon,
  title,
}: AdminEmptyStateProps): ReactElement {
  return (
    <div
      className="flex flex-col items-start gap-3"
      data-slot="admin-empty-state"
    >
      <span className="flex size-10 items-center justify-center rounded-md bg-muted text-foreground">
        <Icon className="size-5" />
      </span>
      <div className="max-w-prose">
        <p className="text-body-small font-medium text-foreground">{title}</p>
        <p className="mt-1 text-body-small text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
