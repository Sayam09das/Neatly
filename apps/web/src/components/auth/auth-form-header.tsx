"use client";

import { APP_NAME } from "@neatly/config";
import type { ReactElement } from "react";
import { AuthEntranceItem } from "@/components/auth/auth-entrance";
import { BrandLink } from "@/components/layout/navbar/brand-link";

interface AuthFormHeaderProps {
  description: string;
  heading: string;
  headingId: string;
}

export function AuthFormHeader({
  description,
  heading,
  headingId,
}: AuthFormHeaderProps): ReactElement {
  return (
    <>
      <AuthEntranceItem className="mb-8">
        <BrandLink className="text-foreground focus-visible:ring-offset-background" />
      </AuthEntranceItem>
      <AuthEntranceItem delay="short">
        <h1 className="text-h1 tracking-tight" id={headingId}>
          {heading}
        </h1>
        <p className="mt-3 max-w-prose text-body text-muted-foreground">
          <DescriptionWithBrand text={description} />
        </p>
      </AuthEntranceItem>
    </>
  );
}

interface DescriptionWithBrandProps {
  text: string;
}

function DescriptionWithBrand({
  text,
}: DescriptionWithBrandProps): ReactElement {
  const marker = APP_NAME;
  const index = text.indexOf(marker);

  if (index === -1) {
    return <>{text}</>;
  }

  return (
    <>
      {text.slice(0, index)}
      <span className="font-medium text-foreground">{marker}</span>
      {text.slice(index + marker.length)}
    </>
  );
}
