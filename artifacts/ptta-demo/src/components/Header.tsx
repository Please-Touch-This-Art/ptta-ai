import { useLocation } from "wouter";
import { useLanguage } from "@/context/LanguageContext";

interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
  /** Editorial tag shown on the left in Courier label style. Defaults to the site name. */
  tag?: string;
}

export function Header({ showBack = false, backHref = "/", tag }: HeaderProps) {
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
      <div className="flex items-center gap-3 px-5 md:px-8 py-3 min-w-0">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(backHref)}
            aria-label={t.header.backLabel}
            className="flex items-center justify-center w-9 h-9 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg
              width="20"
              height="20"
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
          href={backHref}
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          className="ptta-label text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent text-left whitespace-nowrap inline-block text-[8pt] sm:text-[11pt] leading-none"
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
      </div>

    </header>
  );
}
