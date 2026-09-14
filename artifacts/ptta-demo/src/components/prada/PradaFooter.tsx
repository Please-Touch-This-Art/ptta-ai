import { siteCopy, type SiteLang } from "@/content/pradaCopy";
import { useSiteGo } from "@/components/prada/useSiteGo";

/**
 * The site footer, shared with the homepage for the same reason as the header.
 */
export function PradaFooter({ lang }: { lang: SiteLang }) {
  const c = siteCopy[lang];
  const go = useSiteGo();

  return (
    <>
    {/* FOOTER */}
    <footer
      className="border-t border-black/10 py-14 md:py-20 px-6 md:px-10 bg-white"
      role="contentinfo"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-left mb-14">
          <div className="col-span-2 md:col-span-1">
            <p className="prada-wordmark mb-3" style={{ fontSize: 22 }}>
              Please Touch This Art
            </p>
            <p className="prada-body text-[13px] text-black/60 max-w-[28ch]">
              {c.footer.tagline}
            </p>
          </div>
          {[
            {
              title: c.footer.explore,
              links: [
                { label: c.nav.product, href: "#product" },
                /* Hidden until Portfolio gets its own page, as in the header. */
                // { label: c.footer.links.portfolio, href: "#portfolio" },
                { label: c.footer.links.voices, href: "#voices" },
                { label: c.footer.links.experience, href: "/demo-hub" },
                { label: c.footer.links.howItWorks, href: "/how-it-works" },
              ],
            },
            {
              title: c.footer.company,
              links: [
                { label: c.footer.links.impact, href: "#portfolio" },
                { label: c.footer.links.partners, href: "#partners" },
              ],
            },
            {
              title: c.footer.contact,
              links: [
                { label: c.contact.email, href: `mailto:${c.contact.email}` },
                { label: c.footer.links.place, href: "#contact" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="prada-mono-caps text-[10px] text-black/45 mb-4">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={l.href.startsWith("mailto:") ? undefined : go(l.href)}
                      className="prada-body text-[13.5px] text-black/70 hover:text-black transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-black/10 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="prada-mono-caps text-[10px] text-black/50">{c.footer.stamp}</p>
          <nav className="flex items-center gap-4" aria-label={c.footer.legal}>
            {[
              { href: "/impressum", label: "Impressum" },
              { href: "/datenschutz", label: "Datenschutz" },
              { href: "/accessibility", label: lang === "de" ? "Barrierefreiheit" : "Accessibility" },
            ].map((entry) => (
              <a
                key={entry.href}
                href={entry.href}
                onClick={go(entry.href)}
                className="prada-mono-caps text-[10px] text-black/50 underline underline-offset-4 hover:text-black"
              >
                {entry.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
    </>
  );
}
