import type { ReactElement, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function EyeIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 8s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="8" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function EyeOffIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.2 6.25A2 2 0 0 1 9.7 9.7M3.1 3.15 12.9 12.9M6.74 4.18C7.15 4.06 7.57 4 8 4c3.8 0 6 4 6 4a10.4 10.4 0 0 1-1.48 1.86M4.36 5.2A10.6 10.6 0 0 0 2 8s2.2 4 6 4c.84 0 1.62-.2 2.32-.54"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function MailIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.5 4.25h11a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-.75.75h-11a.75.75 0 0 1-.75-.75V5a.75.75 0 0 1 .75-.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="m2.1 4.7 5.32 3.72a1 1 0 0 0 1.16 0L13.9 4.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function LockIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        height="7.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        width="10"
        x="3"
        y="7.25"
      />
      <path
        d="M5.25 7.25V5.4a2.75 2.75 0 0 1 5.5 0v1.85"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function UserIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="8"
        cy="5.25"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.4 13.1c.7-2.1 2.4-3.35 4.6-3.35s3.9 1.25 4.6 3.35"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function GoogleIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.2 8.18c0-.55-.05-1.08-.14-1.59H8.16v3.01h3.96a3.39 3.39 0 0 1-1.47 2.22v1.84h2.38c1.39-1.28 2.17-3.17 2.17-5.48Z"
        fill="currentColor"
      />
      <path
        d="M8.16 15.2c1.99 0 3.66-.66 4.88-1.79l-2.38-1.84c-.66.44-1.5.7-2.5.7-1.92 0-3.55-1.3-4.13-3.04H1.57v1.9A7.04 7.04 0 0 0 8.16 15.2Z"
        fill="currentColor"
      />
      <path
        d="M4.03 9.23a4.23 4.23 0 0 1 0-2.46V4.87H1.57a7.04 7.04 0 0 0 0 6.26l2.46-1.9Z"
        fill="currentColor"
      />
      <path
        d="M8.16 3.73c1.08 0 2.05.37 2.81 1.1l2.11-2.11C11.81 1.52 10.14.8 8.16.8A7.04 7.04 0 0 0 1.57 4.87l2.46 1.9c.58-1.74 2.21-3.04 4.13-3.04Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FacebookIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9.4 15.2V8.74h2.16l.32-2.5H9.4V4.66c0-.72.2-1.22 1.24-1.22H12V1.22C11.62 1.16 10.7 1.08 9.62 1.08 7.38 1.08 5.86 2.44 5.86 4.96v1.28H3.8v2.5h2.06V15.2H9.4Z" />
    </svg>
  );
}

export function AppleIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11.4 8.16c0-1.9 1.55-2.82 1.62-2.86-.88-1.29-2.25-1.47-2.74-1.49-1.17-.12-2.28.69-2.87.69-.59 0-1.5-.67-2.47-.65-1.27.02-2.44.74-3.1 1.88-1.32 2.29-.34 5.68.94 7.54.63.91 1.38 1.93 2.36 1.89.95-.04 1.31-.61 2.46-.61 1.14 0 1.47.61 2.47.59.96-.02 1.57-.93 2.16-1.85.68-1 .96-1.96.98-2.01-.02 0-1.87-.72-1.87-2.85ZM10.3 3.2c.52-.63.87-1.5.78-2.37-.75.03-1.66.5-2.2 1.13-.48.56-.9 1.45-.79 2.3.84.06 1.69-.43 2.21-1.06Z" />
    </svg>
  );
}

export function CheckIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function AlertIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 5.25v3.25M8 10.75h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function InfoIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 7.25V11M8 5.25h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
