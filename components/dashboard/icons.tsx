import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function OverviewIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </IconBase>
  );
}

export function ContentIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M13.5 3.5H7c-.8 0-1.5.7-1.5 1.5v14c0 .8.7 1.5 1.5 1.5h10c.8 0 1.5-.7 1.5-1.5V8l-5-4.5Z" />
      <path d="M13.5 3.5V8H18.5" />
      <path d="M8.75 12.5h6.5M8.75 16h6.5" />
    </IconBase>
  );
}

export function ProjectsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7.3c0-1 .8-1.8 1.8-1.8h3.5l2 2.3h6.9c1 0 1.8.8 1.8 1.8v7.6c0 1-.8 1.8-1.8 1.8H5.8c-1 0-1.8-.8-1.8-1.8V7.3Z" />
    </IconBase>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </IconBase>
  );
}

export function AnalyticsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 20.5h16" />
      <path d="M7 20.5v-6M12 20.5v-11M17 20.5v-8" />
    </IconBase>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 8h9M18 8h2M4 16h1.5M10 16h10" />
      <circle cx="15.5" cy="8" r="2" />
      <circle cx="7.5" cy="16" r="2" />
    </IconBase>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconBase>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  );
}