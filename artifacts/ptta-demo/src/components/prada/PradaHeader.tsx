import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSelect } from "@/components/LanguageSelect";
import { siteCopy, type SiteLang } from "@/content/pradaCopy";
import { useSiteGo } from "@/components/prada/useSiteGo";
import { useTheme } from "@/context/ThemeContext";
import { ThemeToggle } from "@/components/prada/ThemeToggle";

interface Props {
  lang: SiteLang;
  onLangChange: (lang: SiteLang) => void;
}

/**
 * The site header: the one the homepage wears, shared so every page in the
 * Prada design carries the same wordmark, navigation and language menu.
 * Section links resolve against the homepage from anywhere (see useSiteGo).
 */
export function PradaHeader({ lang, onLangChange }: Props) {
  const c = siteCopy[lang];
  const setLang = onLangChange;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const go = useSiteGo(() => setMenuOpen(false));
  const { theme, toggle } = useTheme();

  /* The drawer is the only navigation on a phone, so it has to be operable from
     the keyboard: Escape closes it and focus returns to the button that opened it. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    menuPanelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const navLinks = [
    /* The impact band is archived, so #impact resolves to nothing. Impact points
       at the portfolio section for now. */
    { label: c.nav.impact, href: "#portfolio" },
    /* Hidden until Portfolio gets its own page. */
    // { label: c.nav.portfolio, href: "#portfolio" },
    { label: c.nav.partners, href: "#partners" },
    { label: c.nav.contact, href: "#contact" },
  ];

  return (
    <>
    {/* HEADER — language menu left on desktop, hamburger left on a phone. The
        wordmark is centred from md up and left-aligned beside the menu below it. */}
    <header
      className="prada-header sticky top-0 left-0 right-0 z-50 bg-white border-b border-black/10"
      role="banner"
    >
      <div className="flex lg:grid lg:grid-cols-3 items-center gap-3 px-5 md:px-10 py-3 md:py-4">
        <div className="flex items-center text-black">
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={c.menu.open}
            aria-expanded={menuOpen}
            aria-controls="prada-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden flex items-center justify-center min-h-11 min-w-11 -ml-2"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block">
            <LanguageSelect lang={lang} onChange={setLang} label={c.menu.language} />
          </div>
        </div>

        {/* Wordmark — Fraunces, borrowed from the Aesop variant. */}
        <a
          href="/"
          onClick={go("/")}
          className="flex-1 lg:text-center text-black leading-none whitespace-nowrap min-w-0"
          aria-label="Please Touch This Art"
        >
          <span className="prada-wordmark prada-wordmark--compact block">
            Please Touch This Art
          </span>
        </a>

        <div className="flex items-center justify-end gap-3.5 text-black">
          {/* Measured: the four labels run 210px, and with the icon buttons
              the row needs ~293px against a centre-third that is only 315px
              at lg. So the wide gap waits for xl, where the third grows to
              400px. Below lg the row does not fit at all and the drawer
              takes over instead, which is why this is lg: and not md:. */}
          <nav
            className="hidden lg:flex items-center gap-4 xl:gap-8 xl:mr-3"
            aria-label="Sections"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={go(link.href)}
                className="prada-nav text-[13px] hover:opacity-60 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <ThemeToggle theme={theme} onToggle={toggle} />
        </div>
      </div>

      {/* MENU DRAWER — the whole navigation on a phone. */}
      {menuOpen && (
        <div
          id="prada-menu"
          ref={menuPanelRef}
          className="absolute inset-x-0 top-full bg-white border-b border-black/10 shadow-sm"
        >
          <nav className="flex flex-col px-5 py-2" aria-label="Main">
            {[
              ...navLinks,
              { label: c.menu.experience, href: "/demo-hub" },
              { label: c.menu.howItWorks, href: "/how-it-works" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={go(link.href)}
                className="prada-body text-[16px] py-3.5 border-b border-black/5"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-between px-5 py-4">
            <LanguageSelect lang={lang} onChange={setLang} label={c.menu.language} />
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
              }}
              className="flex items-center gap-2 prada-mono-caps text-[11px] text-black/60"
            >
              <X className="w-3.5 h-3.5" /> {c.menu.close}
            </button>
          </div>
        </div>
      )}
    </header>
    </>
  );
}
