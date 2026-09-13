import { useLocation } from "wouter";
import { SiteShell } from "@/components/prada/SiteShell";
import { useLanguage } from "@/context/LanguageContext";
import type { HowItWorksStep } from "@/content/copy";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const DEMO_ROUTE = "/demo-hub";

/**
 * The process, one step per row: a plate on one side, the number, title and
 * body on the other, hairlines between. Set like the homepage sets its work.
 */
export default function HowItWorks() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { howItWorks } = t;

  return (
    <SiteShell>
      <section className="pt-14 md:pt-20 px-6 md:px-10" aria-labelledby="how-heading">
        <div className="mx-auto max-w-[1140px]">
          <p className="prada-mono-caps text-[10px] text-black/45">{howItWorks.eyebrow}</p>
          <h1
            id="how-heading"
            className="prada-display mt-3 text-[30px] md:text-[44px] leading-[1.08] max-w-[22ch]"
          >
            {howItWorks.headline}
          </h1>
          {howItWorks.subline && (
            <p className="prada-body mt-5 text-[15px] md:text-[16px] leading-[1.65] text-black/65 max-w-[56ch]">
              {howItWorks.subline}
            </p>
          )}
        </div>
      </section>

      <section className="pt-10 md:pt-14 pb-20 md:pb-28 px-6 md:px-10">
        <div className="mx-auto max-w-[1140px]">
          <ol className="border-t border-black/10">
            {howItWorks.steps.map((step) => (
              <StepRow key={step.num} step={step} />
            ))}
          </ol>
          <div className="mt-12 md:mt-16">
            <button
              type="button"
              onClick={() => navigate(DEMO_ROUTE)}
              className="prada-link-cta"
              aria-label={howItWorks.continueCta}
            >
              {howItWorks.continueCta}
            </button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function StepRow({ step }: { step: HowItWorksStep }) {
  return (
    <li className="grid grid-cols-1 gap-6 border-b border-black/10 py-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 md:py-14">
      <figure className="prada-plate m-0 aspect-[3/2] w-full" aria-label={step.imageSrc ? undefined : step.illoAlt}>
        {step.imageSrc ? (
          <img
            src={`${BASE}/${step.imageSrc}`}
            alt={step.illoAlt}
            loading="lazy"
            decoding="async"
            className="prada-plate__img"
          />
        ) : (
          /* No photograph on file for this step yet: the plate carries the
             number at display size instead of a stand-in picture. */
          <div className="flex h-full w-full items-center justify-center" role="img" aria-label={step.illoAlt}>
            <span className="prada-display text-[64px] leading-none text-black/20">{step.num}</span>
          </div>
        )}
      </figure>
      <div className="flex flex-col justify-center">
        <span className="prada-mono-caps text-[10px] text-black/45">{step.num}</span>
        <h2 className="prada-display mt-3 text-[22px] md:text-[28px] leading-[1.15]">{step.title}</h2>
        {step.body && (
          <p className="prada-body mt-4 max-w-[58ch] text-[15px] md:text-[16px] leading-[1.65] text-black/65">
            {step.body}
          </p>
        )}
      </div>
    </li>
  );
}
