import type { ReactElement, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function MenuIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function BellIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.75 8.25a5.25 5.25 0 1 1 10.5 0c0 2.4.64 3.7 1.35 4.55.3.36.05.95-.4.95H3.8c-.45 0-.7-.59-.4-.95.71-.85 1.35-2.15 1.35-4.55Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M8 15.5a2 2 0 0 0 4 0"
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
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="10"
        cy="7.25"
        r="2.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4.5 15.75c.85-2.4 2.85-3.75 5.5-3.75s4.65 1.35 5.5 3.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function OverviewIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        height="6"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.5"
        width="6"
        x="3.5"
        y="3.5"
      />
      <rect
        height="6"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.5"
        width="6"
        x="10.5"
        y="3.5"
      />
      <rect
        height="6"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.5"
        width="6"
        x="3.5"
        y="10.5"
      />
      <rect
        height="6"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.5"
        width="6"
        x="10.5"
        y="10.5"
      />
    </svg>
  );
}

export function BookingsIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        height="13"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        width="13"
        x="3.5"
        y="4.5"
      />
      <path
        d="M7 3.5v2.5M13 3.5v2.5M3.5 8.5h13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CustomersIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="7.25"
        cy="7"
        r="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.5 14.75c.7-2.05 2.35-3.25 3.75-3.25s3.05 1.2 3.75 3.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <circle
        cx="13.5"
        cy="7.5"
        r="1.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12.25 14.75c.45-1.45 1.55-2.4 2.75-2.4 1.05 0 1.95.7 2.5 1.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function FilterIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 5.5h12L12 10.5v4l-4 1.5v-5.5L4 5.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function MoreIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="10" cy="5" fill="currentColor" r="1.25" />
      <circle cx="10" cy="10" fill="currentColor" r="1.25" />
      <circle cx="10" cy="15" fill="currentColor" r="1.25" />
    </svg>
  );
}

export function QuotesIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        height="13"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        width="11"
        x="4.5"
        y="3.5"
      />
      <path
        d="M7.5 7.5h5M7.5 10.5h5M7.5 13.5h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ContactsIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        height="12"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        width="14"
        x="3"
        y="4.5"
      />
      <path
        d="m4 6.5 6 4.25L16 6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ServicesIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.5 6V5.25A1.75 1.75 0 0 1 8.25 3.5h3.5A1.75 1.75 0 0 1 13.5 5.25V6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <rect
        height="10.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        width="13"
        x="3.5"
        y="6"
      />
    </svg>
  );
}

export function PortfolioIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        height="12"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        width="14"
        x="3"
        y="4.5"
      />
      <path
        d="m4.5 14.5 3.4-3.4a1 1 0 0 1 1.4 0L12 13.8l1.1-1.1a1 1 0 0 1 1.4 0l1 1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle
        cx="7.25"
        cy="8"
        r="1.1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function TestimonialsIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m10 3.75 1.62 3.28 3.63.53-2.63 2.56.62 3.61L10 12.03 6.76 13.73l.62-3.61-2.63-2.56 3.63-.53L10 3.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function BlogIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 4.5h7.5A2.5 2.5 0 0 1 15 7v8.5H6.5A1.5 1.5 0 0 1 5 14V4.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M5 14a1.5 1.5 0 0 1 1.5-1.5H15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function NewsletterIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.5 6.5h13v8a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3.5 14.5v-8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M3.5 6.5 10 11l6.5-4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function SettingsIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="10"
        cy="10"
        r="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 3.5v1.5M10 15v1.5M3.5 10h1.5M15 10h1.5M5.4 5.4l1.06 1.06M13.54 13.54l1.06 1.06M14.6 5.4l-1.06 1.06M6.46 13.54l-1.06 1.06"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ActivityIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.5 10h3l1.75-4.5L11.5 14.5 13.25 10h3.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps): ReactElement {
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
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function TrendUpIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="12"
      viewBox="0 0 12 12"
      width="12"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.5 8.5 5 5l2 2 3.5-3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.5 3.5h3v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function TrendDownIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="12"
      viewBox="0 0 12 12"
      width="12"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.5 3.5 5 7l2-2 3.5 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.5 8.5h3v-3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function SidebarCollapseIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.5 5.5 7.5 10l4 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function SidebarExpandIcon(props: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.5 5.5 12.5 10l-4 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
