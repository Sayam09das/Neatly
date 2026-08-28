"use client";

import { Button, Separator } from "@neatly/ui";
import type { ReactElement } from "react";
import {
  AppleIcon,
  FacebookIcon,
  GoogleIcon,
} from "@/components/auth/auth-icons";
import { authSocialCopy } from "@/config/auth-ui";
import type { AuthSocialProvider } from "@/types/auth-form";

interface AuthSocialActionsProps {
  disabled: boolean;
  notice: string | null;
  onSelect: (provider: AuthSocialProvider) => void;
}

const SOCIAL_PROVIDERS: ReadonlyArray<{
  icon: typeof GoogleIcon;
  id: AuthSocialProvider;
  label: string;
}> = [
  { icon: GoogleIcon, id: "google", label: authSocialCopy.google },
  { icon: AppleIcon, id: "apple", label: authSocialCopy.apple },
  { icon: FacebookIcon, id: "facebook", label: authSocialCopy.facebook },
];

export function AuthSocialActions({
  disabled,
  notice,
  onSelect,
}: AuthSocialActionsProps): ReactElement {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <p className="text-caption text-muted-foreground">
          {authSocialCopy.divider}
        </p>
        <Separator className="flex-1" />
      </div>
      <div className="flex justify-center gap-4">
        {SOCIAL_PROVIDERS.map((provider) => {
          const Icon = provider.icon;

          return (
            <Button
              aria-label={provider.label}
              disabled={disabled}
              key={provider.id}
              onClick={(): void => {
                onSelect(provider.id);
              }}
              size="icon"
              type="button"
              variant="secondary"
            >
              <Icon />
            </Button>
          );
        })}
      </div>
      {notice === null ? null : (
        <p
          aria-live="polite"
          className="text-center text-caption text-muted-foreground"
          role="status"
        >
          {notice}
        </p>
      )}
    </div>
  );
}
