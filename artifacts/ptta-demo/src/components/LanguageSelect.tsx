import { useEffect, useRef, useState } from "react";
import { type SiteLang } from "@/content/pradaCopy";

const OPTIONS: { id: SiteLang; short: string; full: string }[] = [
  { id: "en", short: "EN", full: "English" },
  { id: "de", short: "DE", full: "Deutsch" },
];

interface Props {
  lang: SiteLang;
  onChange: (lang: SiteLang) => void;
  /** Accessible label, localised by the caller. */
  label: string;
}

/**
 * Language menu for the site header. A listbox rather than a two-state toggle,
 * so more languages can be added without changing the interaction.
 */
export function LanguageSelect({ lang, onChange, label }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const current = OPTIONS.find((o) => o.id === lang) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="prada-nav flex items-center gap-1.5 text-[13px] hover:opacity-60 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        {current.short}
        <svg
          width="9"
          height="9"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-full mt-3 min-w-[132px] bg-white border border-black/10 shadow-sm z-50 py-1"
        >
          {OPTIONS.map((o) => (
            <li key={o.id} role="none">
              <button
                type="button"
                role="option"
                aria-selected={o.id === lang}
                onClick={() => {
                  onChange(o.id);
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                className={`prada-body w-full text-left px-4 py-2.5 text-[13.5px] hover:bg-black/[0.04] transition-colors ${
                  o.id === lang ? "text-black" : "text-black/60"
                }`}
              >
                {o.full}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
