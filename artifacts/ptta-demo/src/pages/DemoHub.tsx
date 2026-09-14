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
    <li className="flex flex-col">
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
        <div className="mt-5 flex flex-1 flex-col border-t border-black/10 pt-4">
          <span className="prada-mono-caps text-[10px] text-black/45">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="prada-display mt-3 text-[19px] md:text-[21px] leading-[1.2]">
            {card.title}
          </h2>
          <p className="prada-body mt-2 flex-1 text-[14px] md:text-[15px] leading-[1.6] text-black/65">
            {card.description}
          </p>
          <span className="prada-link-cta mt-5 self-start group-hover:opacity-65" aria-hidden="true">
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
        <section className="pt-14 md:pt-20 px-6 md:px-10" aria-labelledby="demo-hub-heading">
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

        <section className="pt-10 md:pt-14 pb-20 md:pb-28 px-6 md:px-10" aria-label={demoHub.eyebrow}>
          <ol className="mx-auto grid max-w-[1140px] grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
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
