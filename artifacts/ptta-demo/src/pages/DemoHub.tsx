import { useLocation } from "wouter";
import { SiteShell } from "@/components/prada/SiteShell";
import { useLanguage } from "@/context/LanguageContext";
import type { DemoCard } from "@/content/copy";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/* The catalogue of demos, set the way the homepage sets its work: a row of
   plates with the copy beneath, hairlines rather than boxes, the underlined
   mono link as the only call to action. The "future" card was a teaser for a
   page that is no longer part of the site, so it is left out. */
function isLive(card: DemoCard): boolean {
  return card.variant !== "future";
}

function DemoPlate({
  card,
  index,
  openLabel,
  ariaLabel,
  onOpen,
}: {
  card: DemoCard;
  index: number;
  openLabel: string;
  ariaLabel: string;
  onOpen: (route: string) => void;
}) {
  const route = card.route ?? `/demo/${card.slug}`;
  return (
    /* In the two-column rows below lg, an odd card out would sit alone at the
       left edge; it spans the row instead and centres at a single column's
       width, which is half the row less half the gap (--hub-gap on the list). */
    <li className="flex flex-col last:odd:col-span-2 last:odd:justify-self-center last:odd:w-[calc(50%-var(--hub-gap)/2)] lg:last:odd:col-span-1 lg:last:odd:w-auto lg:last:odd:justify-self-stretch">
      <a
        href={route}
        onClick={(e) => {
          e.preventDefault();
          onOpen(route);
        }}
        aria-label={ariaLabel}
        className="group flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        <figure className="prada-plate m-0 aspect-[4/5]">
          {card.imageSrc && (
            <img
              src={`${BASE}/${card.imageSrc}`}
              alt={card.illoAlt}
              loading="lazy"
              decoding="async"
              className="prada-plate__img"
            />
          )}
        </figure>
        {/* Phones set two cards to a row at ~155px each, so the copy steps
            down a size there and the spacing tightens to match. */}
        <div className="mt-3 sm:mt-5 flex flex-1 flex-col border-t border-black/10 pt-3 sm:pt-4">
          <span className="prada-mono-caps text-[10px] text-black/45">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="prada-display mt-2 sm:mt-3 text-[16px] sm:text-[19px] md:text-[21px] leading-[1.2]">
            {card.title}
          </h2>
          <p className="prada-body mt-1.5 sm:mt-2 flex-1 text-[13px] sm:text-[14px] md:text-[15px] leading-[1.5] sm:leading-[1.6] text-black/65">
            {card.description}
          </p>
          <span className="prada-link-cta mt-3 sm:mt-5 self-start group-hover:opacity-65" aria-hidden="true">
            {openLabel}
          </span>
        </div>
      </a>
    </li>
  );
}

export default function DemoHub() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { demoHub } = t;
  const cards = demoHub.cards.filter(isLive);

  return (
    <SiteShell>
      <>
        <section className="pt-10 md:pt-20 px-5 sm:px-6 md:px-10" aria-labelledby="demo-hub-heading">
          <div className="mx-auto max-w-[1140px]">
            <h1
              id="demo-hub-heading"
              className="prada-display text-[30px] md:text-[44px] leading-[1.08] max-w-[22ch]"
            >
              {demoHub.headline}
            </h1>
            {demoHub.subline && (
              <p className="prada-body mt-5 text-[15px] md:text-[16px] leading-[1.65] text-black/65 max-w-[52ch]">
                {demoHub.subline}
              </p>
            )}
          </div>
        </section>

        <section className="pt-8 md:pt-14 pb-16 md:pb-28 px-5 sm:px-6 md:px-10" aria-label={demoHub.eyebrow}>
          <ol className="mx-auto grid max-w-[1140px] grid-cols-2 [--hub-gap:1rem] sm:[--hub-gap:2rem] lg:[--hub-gap:2.5rem] gap-x-[var(--hub-gap)] gap-y-10 sm:gap-y-8 lg:grid-cols-3 lg:gap-y-10">
            {cards.map((card, i) => (
              <DemoPlate
                key={card.slug}
                card={card}
                index={i}
                openLabel={demoHub.openLabel}
                ariaLabel={demoHub.ariaOpenModule(card.title)}
                onOpen={navigate}
              />
            ))}
          </ol>
        </section>
      </>
    </SiteShell>
  );
}
