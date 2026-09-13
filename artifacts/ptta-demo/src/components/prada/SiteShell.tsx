import type { ReactNode } from "react";
import { PradaHeader } from "@/components/prada/PradaHeader";
import { PradaFooter } from "@/components/prada/PradaFooter";
import { useLanguage } from "@/context/LanguageContext";

/** The site's header and footer around a page's content. */
export function SiteShell({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLanguage();
  return (
    <div className="prada-root min-h-screen bg-white text-black">
      <PradaHeader lang={lang} onLangChange={setLang} />
      <main>{children}</main>
      <PradaFooter lang={lang} />
    </div>
  );
}
