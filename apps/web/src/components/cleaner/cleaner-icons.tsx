import type { ComponentType, ReactElement, SVGProps } from "react";
import type { CleanerNavIconName } from "@/config/cleaner-nav";

type IconProps = SVGProps<SVGSVGElement>;

export function CleanerMenuIcon(props: IconProps): ReactElement {
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

export function CleanerDashboardIcon(props: IconProps): ReactElement {
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

export function CleanerJobsIcon(props: IconProps): ReactElement {
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
        width="11"
        x="4.5"
        y="4.5"
      />
      <path
        d="M7.5 4.5V3.75A1.25 1.25 0 0 1 8.75 2.5h2.5A1.25 1.25 0 0 1 12.5 3.75V4.5M7.5 9h5M7.5 12h3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CleanerScheduleIcon(props: IconProps): ReactElement {
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

export function CleanerAvailabilityIcon(props: IconProps): ReactElement {
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
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6.75V10l2.25 1.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CleanerProfileIcon(props: IconProps): ReactElement {
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

export function CleanerSettingsIcon(props: IconProps): ReactElement {
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
        d="M10 3.5v1.25M10 15.25V16.5M4.9 5.4l.9.9M14.2 13.7l.9.9M3.5 10H4.75M15.25 10H16.5M4.9 14.6l.9-.9M14.2 6.3l.9-.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CleanerHelpIcon(props: IconProps): ReactElement {
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
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.25 7.75A1.75 1.75 0 1 1 10.6 9.1C10 9.6 10 10.1 10 10.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="13.25" fill="currentColor" r="0.75" />
    </svg>
  );
}

export function CleanerLogoutIcon(props: IconProps): ReactElement {
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
        d="M8.5 4.5H5.75A1.25 1.25 0 0 0 4.5 5.75v8.5c0 .69.56 1.25 1.25 1.25H8.5M8.5 10h7M13 7.5 15.5 10 13 12.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CleanerSidebarCollapseIcon(props: IconProps): ReactElement {
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

export function CleanerSidebarExpandIcon(props: IconProps): ReactElement {
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

export function CleanerBellIcon(props: IconProps): ReactElement {
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

export const cleanerNavIcons: Record<
  CleanerNavIconName,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  availability: CleanerAvailabilityIcon,
  dashboard: CleanerDashboardIcon,
  help: CleanerHelpIcon,
  jobs: CleanerJobsIcon,
  notifications: CleanerBellIcon,
  profile: CleanerProfileIcon,
  schedule: CleanerScheduleIcon,
  settings: CleanerSettingsIcon,
};
