import type { Theme } from "@/context/ThemeContext";

interface Props {
  theme: Theme;
  onToggle: () => void;
}

/**
 * Light/dark switch for the site header. Shows the mode it would switch to:
 * a moon in light mode, a sun in dark. From lg up the button collapses to
 * the bare 17px icon, which is below the 24px minimum target, so a
 * pseudo-element grows the hit area without moving anything around it.
 */
export function ThemeToggle({ theme, onToggle }: Props) {
  const toDark = theme === "light";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={toDark ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={!toDark}
      className="relative flex items-center justify-center min-h-11 min-w-11 lg:min-h-0 lg:min-w-0 -mr-2 lg:mr-0 lg:ml-1 [touch-action:manipulation] lg:before:absolute lg:before:content-[''] lg:before:-inset-x-1.5 lg:before:-inset-y-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
    >
      {toDark ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
          <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
          <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
        </svg>
      )}
    </button>
  );
}
