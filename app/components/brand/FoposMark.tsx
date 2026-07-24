import type { SVGProps } from "react";

export function FoposMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden="true" {...props}>
      <circle cx="48" cy="48" r="40" className="mark-ring" />
      <path d="M48 5v8M48 83v8M5 48h8M83 48h8" className="mark-tick" />
      <path d="m48 18 7 24-7 36-7-36 7-24Z" className="mark-needle" />
      <path d="m48 78-7-36 7 7 7-7-7 36Z" className="mark-needle-fill" />
      <path d="M24 59 37 47l8 8 8-10 19 14" className="mark-land" />
      <path d="M29 64h38" className="mark-land" />
      <path d="M42 29h12M44 29l2-7h4l2 7M42 31h12l-2 11h-8l-2-11Z" className="mark-lantern" />
      <path d="M45 34c1-2 5-2 6 0-1 4-5 4-6 0Z" className="mark-flame" />
      <circle cx="48" cy="48" r="3.5" className="mark-center" />
    </svg>
  );
}
