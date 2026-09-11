import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { LanguageSelect } from "@/components/LanguageSelect";
import { siteCopy, type SiteLang } from "@/content/pradaCopy";
import {
  legalCopy,
  PLACEHOLDER_NOTE,
  type LegalDocId,
} from "@/content/legalCopy";

const LEGAL_NAV: { id: LegalDocId; path: string }[] = [
  { id: "impressum", path: "/impressum" },
  { id: "datenschutz", path: "/datenschutz" },
  { id: "accessibility", path: "/accessibility" },
];

/**
 * Shared shell for the three legal documents.
 *
 * They share a layout because they are read the same way — scanned for one
 * clause — so a single measure, one type scale and a consistent position for
 * the cross-links matter more than individuality. Set in the site's own faces
 * rather than as a bare document, since these pages are still the company
 * speaking.
 */
export default function LegalPage({ doc }: { doc: LegalDocId }) {
  const [lang, setLang] = useState<SiteLang>("de");
  const [, navigate] = useLocation();
  const c = siteCopy[lang];
  const content = legalCopy[lang][doc];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [doc]);

  const go = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  const hasPlaceholders = JSON.stringify(content).includes("[");

  return (
    <div className="prada-root min-h-screen bg-white text-black">
      <header className="prada-header sticky top-0 z-50 bg-white border-b border-black/10">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4 px-6 md:px-10 py-3 md:py-4">
          <a
            href="/"
            onClick={go("/")}
            className="text-black leading-none whitespace-nowrap min-w-0"
            aria-label="Please Touch This Art"
          >
            <span className="prada-wordmark prada-wordmark--compact block">
              Please Touch This Art
            </span>
          </a>
          <LanguageSelect lang={lang} onChange={setLang} label={c.menu.language} />
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-6 md:px-10 pt-14 md:pt-20 pb-20 md:pb-28">
        <h1 className="prada-display text-[30px] md:text-[44px] leading-[1.1]">
          {content.title}
        </h1>
        <p className="prada-mono-caps mt-4 text-[9.5px] text-black/45">
          {content.updated}
        </p>

        {/* A page that still carries bracketed fields is not ready to publish,
            so it says so on the page rather than only in a code comment. */}
        {hasPlaceholders && (
          <p className="prada-body mt-8 border-l-2 border-[#FF6A00] pl-4 text-[14px] leading-[1.6] text-black/70">
            {PLACEHOLDER_NOTE[lang]}
          </p>
        )}

        <div className="mt-10 md:mt-14 flex flex-col gap-9 md:gap-11">
          {content.sections.map((section, i) => (
            <section key={section.heading ?? i}>
              {section.heading && (
                <h2 className="prada-display text-[18px] md:text-[21px] leading-[1.25] mb-3">
                  {section.heading}
                </h2>
              )}
              {section.body?.map((para) => (
                <p
                  key={para}
                  /* pre-line: addresses and contact blocks carry their own line
                     breaks and must not be reflowed into a paragraph. */
                  className="prada-body whitespace-pre-line text-[15px] md:text-[16px] leading-[1.7] text-black/70 [&+p]:mt-4"
                >
                  {para}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 flex flex-col gap-2.5">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="prada-body relative pl-5 text-[15px] md:text-[16px] leading-[1.7] text-black/70 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-black/35"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <nav
          className="mt-16 md:mt-20 flex flex-wrap gap-x-6 gap-y-3 border-t border-black/10 pt-6"
          aria-label={content.title}
        >
          {LEGAL_NAV.filter((entry) => entry.id !== doc).map((entry) => (
            <a
              key={entry.id}
              href={entry.path}
              onClick={go(entry.path)}
              className="prada-mono-caps text-[10px] text-black/55 underline underline-offset-4 hover:text-black"
            >
              {legalCopy[lang][entry.id].title}
            </a>
          ))}
          <a
            href="/"
            onClick={go("/")}
            className="prada-mono-caps text-[10px] text-black/55 underline underline-offset-4 hover:text-black"
          >
            {lang === "de" ? "Zur Startseite" : "Back to the site"}
          </a>
        </nav>
      </main>
    </div>
  );
}
