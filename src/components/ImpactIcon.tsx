import type { ReactNode } from "react";

type ImpactIconProps = {
  name: string;
  className?: string;
};

const paths: Record<string, ReactNode> = {
  gatherings: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
      <circle cx="19" cy="7" r="2" />
      <circle cx="5" cy="7" r="2" />
    </>
  ),
  circles: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  dialogues: (
    <>
      <path d="M5 6h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    </>
  ),
  retreats: (
    <>
      <path d="M4 18h16" />
      <path d="M6 18V10l6-5 6 5v8" />
      <path d="M10 18v-4h4v4" />
    </>
  ),
  workshops: (
    <>
      <rect x="4" y="5" width="16" height="12" rx="1" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </>
  ),
  research: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4-4" />
    </>
  ),
  podcast: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </>
  ),
  partnerships: (
    <>
      <path d="M8 12h8" />
      <path d="M12 8v8" />
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
};

export function ImpactIcon({ name, className = "" }: ImpactIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name] ?? paths.circles}
    </svg>
  );
}
