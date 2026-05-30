import { useLocation } from "wouter";
import { useLanguage } from "@/context/LanguageContext";

interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
  /** Optional callback. When provided, takes precedence over `backHref`. */
  onBack?: () => void;
  /** Editorial tag shown on the left in Courier label style. Defaults to the site name. */
  tag?: string;
}

export function Header({
  showBack = false,
  backHref = "/",
  onBack,
  tag,
}: HeaderProps) {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  const tagText = tag ?? "PLEASE TOUCH THIS ART";
  const isDefaultTag = tag === undefined;

  return (
    <header
      className="flex items-stretch bg-page border-b border-hairline"
      role="banner"
    >
      {/* Left: back arrow (if present) + Courier editorial label */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 md:px-8 py-2.5 sm:py-3 min-w-0 flex-1">
        {showBack && (
          <button
            type="button"
            onClick={() => (onBack ? onBack() : navigate(backHref))}
            aria-label={t.header.backLabel}
            className="flex shrink-0 items-center justify-center w-11 h-11 -ml-1.5 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        )}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          className="ptta-label text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent text-center sm:text-left block min-w-0 flex-1 text-[7.5pt] sm:text-[11pt] leading-tight sm:leading-none whitespace-normal sm:whitespace-nowrap break-words"
          style={{ fontWeight: 400 }}
          aria-label="Please Touch This Art – home"
        >
          {isDefaultTag ? (
            <>
              PLEASE TOUCH
              <span aria-hidden="true" className="mx-2 text-accent">·</span>
              THIS ART
            </>
          ) : (
            tagText
          )}
        </a>
        {/* Mobile-only spacer to balance the back arrow, so the title truly centers */}
        {showBack && (
          <div className="w-11 shrink-0 sm:hidden" aria-hidden />
        )}
      </div>
    </header>
  );
}
