import { cn } from "@neatly/utils";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { authLegalLinks, authPanelCopy } from "@/config/auth-ui";

interface AuthShellImage {
  alt: string;
  height: number;
  objectPosition: string;
  src: string;
  width: number;
}

interface AuthShellProps {
  children: ReactNode;
  image?: AuthShellImage;
  imagePosition?: "start" | "end";
}

export function AuthShell({
  children,
  image,
  imagePosition = "end",
}: AuthShellProps): ReactElement {
  if (image === undefined) {
    return (
      <div className="min-h-dvh bg-background px-gutter py-8 lg:py-10">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col">
          <main className="flex flex-1 flex-col justify-center py-4">
            {children}
          </main>
          <AuthLegalLinks align="center" />
        </div>
      </div>
    );
  }

  const formOrder = imagePosition === "end" ? "lg:order-1" : "lg:order-2";
  const panelOrder = imagePosition === "end" ? "lg:order-2" : "lg:order-1";

  return (
    <div className="min-h-dvh bg-background px-gutter py-8 lg:py-10">
      <div className="mx-auto grid w-full max-w-page gap-10 lg:grid-cols-12 lg:items-stretch">
        <div className={cn("flex min-w-0 flex-col lg:col-span-5", formOrder)}>
          <main className="flex flex-1 flex-col justify-center py-4 lg:py-8">
            <div className="mx-auto w-full max-w-md lg:mx-0">{children}</div>
          </main>
          <AuthLegalLinks align="start" />
        </div>
        <aside
          className={cn("hidden min-w-0 lg:col-span-7 lg:flex", panelOrder)}
        >
          <div className="flex min-h-96 w-full flex-col rounded-xl bg-accent p-8">
            <div className="relative min-h-80 flex-1 overflow-hidden rounded-xl bg-muted">
              <Image
                alt={image.alt}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 0px"
                src={image.src}
                style={{ objectPosition: image.objectPosition }}
              />
            </div>
            <p className="mt-8 max-w-lg text-h3 tracking-tight text-foreground">
              {authPanelCopy.headline}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

interface AuthLegalLinksProps {
  align: "start" | "center";
}

function AuthLegalLinks({ align }: AuthLegalLinksProps): ReactElement {
  return (
    <p
      className={cn(
        "flex gap-4 pb-2 text-caption text-muted-foreground",
        align === "center"
          ? "justify-center"
          : "justify-center lg:justify-start",
      )}
    >
      {authLegalLinks.map((link) => (
        <Link
          className={cn(
            "underline-offset-4 transition-colors duration-normal",
            "ease-standard hover:text-foreground hover:underline",
            "focus-visible:rounded-sm focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring",
          )}
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}
    </p>
  );
}
