"use client";

import { Input } from "@neatly/ui";
import Image from "next/image";
import {
  type ChangeEvent,
  type ReactElement,
  useEffect,
  useId,
  useState,
} from "react";
import { AdminFormField } from "@/components/admin/admin-mutation-dialogs";
import { adminServiceCopy } from "@/config/admin-services";

interface ServiceThumbnailFieldsProps {
  coverImageUrl: string;
  currentPreviewUrl?: string | null;
  file: File | null;
  fileError?: string;
  linkError?: string;
  onCoverImageUrlChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
}

export function ServiceThumbnailFields({
  coverImageUrl,
  currentPreviewUrl = null,
  file,
  fileError,
  linkError,
  onCoverImageUrlChange,
  onFileChange,
}: ServiceThumbnailFieldsProps): ReactElement {
  const fileId = useId();
  const linkId = useId();
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file === null) {
      setObjectUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setObjectUrl(nextUrl);
    return (): void => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [file]);

  const previewUrl =
    objectUrl ?? nonemptyUrl(coverImageUrl) ?? currentPreviewUrl;

  return (
    <div className="space-y-4">
      <AdminFormField
        error={fileError}
        htmlFor={fileId}
        label={adminServiceCopy.thumbnailFileLabel}
      >
        <Input
          accept="image/jpeg,image/png,image/webp"
          className="min-h-touch cursor-pointer py-2"
          id={fileId}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => {
            onFileChange(event.target.files?.[0] ?? null);
          }}
          type="file"
        />
        <p className="mt-2 text-caption text-muted-foreground">
          {adminServiceCopy.thumbnailFileHint}
        </p>
      </AdminFormField>
      <AdminFormField
        error={linkError}
        htmlFor={linkId}
        label={adminServiceCopy.thumbnailLinkLabel}
      >
        <Input
          id={linkId}
          inputMode="url"
          onChange={(event): void => {
            onCoverImageUrlChange(event.target.value);
          }}
          placeholder="https://"
          type="url"
          value={coverImageUrl}
        />
        <p className="mt-2 text-caption text-muted-foreground">
          {adminServiceCopy.thumbnailLinkHint}
        </p>
      </AdminFormField>
      {previewUrl !== null ? (
        <div>
          <p className="mb-2 text-caption text-muted-foreground">
            {adminServiceCopy.thumbnailPreviewLabel}
          </p>
          <span className="relative block size-20 overflow-hidden rounded-md border border-border bg-muted">
            <Image
              alt=""
              className="object-cover"
              fill
              sizes="80px"
              src={previewUrl}
              unoptimized
            />
          </span>
        </div>
      ) : null}
    </div>
  );
}

function nonemptyUrl(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
