import { useLocation, useParams } from "wouter";
import { SiteShell } from "@/components/prada/SiteShell";
import { useLanguage } from "@/context/LanguageContext";

const HUB_ROUTE = "/demo-hub";

/** Stands in for a demo that is not built yet. */
export default function DemoPlaceholder() {
  const { t } = useLanguage();
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();

  const card = t.demoHub.cards.find((c) => c.slug === params.slug);
  const title = card?.title ?? t.placeholder.notFoundTitle;

  return (
    <SiteShell>
      <section className="pt-14 md:pt-20 pb-24 md:pb-32 px-6 md:px-10" aria-label={title}>
        <div className="mx-auto max-w-[1140px]">
          <p className="prada-mono-caps text-[10px] text-black/45">{t.demoHub.eyebrow}</p>
          <h1 className="prada-display mt-3 text-[30px] md:text-[44px] leading-[1.08] max-w-[22ch]">{title}</h1>
          <p className="prada-body mt-5 text-[15px] md:text-[16px] leading-[1.65] text-black/65">
            {t.placeholder.comingSoon}
          </p>
          <button
            type="button"
            onClick={() => navigate(HUB_ROUTE)}
            className="prada-link-cta mt-10"
            aria-label={t.placeholder.backToHub}
          >
            {t.placeholder.backToHub}
          </button>
        </div>
      </section>
    </SiteShell>
  );
}
