"use client";

import { Input } from "@neatly/ui";
import { cn } from "@neatly/utils";
import {
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  useState,
} from "react";
import { AuthControl, AuthField } from "@/components/auth/auth-field";
import { EyeIcon, EyeOffIcon } from "@/components/auth/auth-icons";
import { AUTH_PILL_INPUT_CLASS_NAME } from "@/config/auth-ui";

interface AuthPasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  error: string | undefined;
  errorId: string;
  hideLabel: string;
  htmlFor: string;
  label: string;
  labelAction?: ReactNode;
  leading?: ReactNode;
  showLabel: string;
  visuallyHideLabel?: boolean;
}

export function AuthPasswordField({
  error,
  errorId,
  hideLabel,
  htmlFor,
  id,
  label,
  labelAction,
  leading,
  showLabel,
  visuallyHideLabel = false,
  className,
  ...props
}: AuthPasswordFieldProps): ReactElement {
  const [isVisible, setIsVisible] = useState(false);
  const toggleLabel = isVisible ? hideLabel : showLabel;

  return (
    <AuthField
      error={error}
      errorId={errorId}
      hideLabel={visuallyHideLabel}
      htmlFor={htmlFor}
      label={label}
      labelAction={labelAction}
    >
      <AuthControl leading={leading}>
        <Input
          {...props}
          aria-invalid={error !== undefined}
          className={cn(
            AUTH_PILL_INPUT_CLASS_NAME,
            "pr-12",
            leading === undefined ? undefined : "pl-11",
            className,
          )}
          id={id}
          type={isVisible ? "text" : "password"}
        />
        <button
          aria-controls={id}
          aria-label={toggleLabel}
          aria-pressed={isVisible}
          className={cn(
            "absolute top-1/2 right-1 flex min-h-touch min-w-touch",
            "-translate-y-1/2 items-center justify-center rounded-full",
            "text-muted-foreground transition-colors duration-normal",
            "ease-standard hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2",
            "focus-visible:ring-offset-background",
          )}
          disabled={props.disabled}
          onClick={(): void => {
            setIsVisible((current) => !current);
          }}
          type="button"
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </AuthControl>
    </AuthField>
  );
}
