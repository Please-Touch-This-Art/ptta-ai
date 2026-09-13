import {
  PAINTINGS,
  MONUMENTS,
  type ModelEntry,
  type ModelId,
} from "@/content/models";
import { cn } from "@/lib/utils";

interface Props {
  heading: string;
  intro: string;
  /** The underlined link under each piece: "Fabricate", "Listen". */
  cta: string;
  /** Verb for the card's accessible name: `${ariaVerb} ${title} by ${artist}`. */
  ariaVerb: string;
  onSelect: (id: ModelId) => void;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * First screen of a demo that works on one of the pieces: the collection as
 * rows of plates under hairlines, in two groups with their counts, set the
 * way the demo hub and the homepage set theirs.
 */
export function PiecePicker({ heading, intro, cta, ariaVerb, onSelect }: Props) {
  return (
    <>
      <section className="pt-14 md:pt-20 px-6 md:px-10" aria-labelledby="piece-picker-heading">
        <div className="mx-auto max-w-[1140px]">
          <h1
            id="piece-picker-heading"
            className="prada-display text-[30px] md:text-[44px] leading-[1.08] max-w-[22ch]"
          >
            {heading}
          </h1>
          <p className="prada-body mt-5 text-[15px] md:text-[16px] leading-[1.65] text-black/65 max-w-[56ch]">
            {intro}
          </p>
        </div>
      </section>

      <section className="pt-10 md:pt-14 pb-20 md:pb-28 px-6 md:px-10">
        <div className="mx-auto flex max-w-[1140px] flex-col gap-14 md:gap-16">
          <PieceGroup title="Paintings" models={PAINTINGS} indexOffset={0} cta={cta} ariaVerb={ariaVerb} onSelect={onSelect} />
          <PieceGroup
            title="Monuments"
            models={MONUMENTS}
            indexOffset={PAINTINGS.length}
            cta={cta}
            ariaVerb={ariaVerb}
            onSelect={onSelect}
          />
        </div>
      </section>
    </>
  );
}

interface GroupProps {
  title: string;
  models: ModelEntry[];
  indexOffset: number;
  cta: string;
  ariaVerb: string;
  onSelect: (id: ModelId) => void;
}

function PieceGroup({ title, models, indexOffset, cta, ariaVerb, onSelect }: GroupProps) {
  const available = models.filter((m) => m.available).length;
  return (
    <section aria-label={title}>
      <div className="flex items-baseline justify-between border-b border-black/10 pb-3">
        <h2 className="prada-mono-caps text-[10px] text-black">{title}</h2>
        <span className="prada-mono-caps text-[10px] text-black/45">{pad2(available)} available</span>
      </div>
      <ol className="mt-8 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-10">
        {models.map((m, i) => (
          <PieceCard key={m.id} model={m} index={indexOffset + i} cta={cta} ariaVerb={ariaVerb} onSelect={onSelect} />
        ))}
      </ol>
    </section>
  );
}

interface CardProps {
  model: ModelEntry;
  index: number;
  cta: string;
  ariaVerb: string;
  onSelect: (id: ModelId) => void;
}

function PieceCard({ model, index, cta, ariaVerb, onSelect }: CardProps) {
  const disabled = !model.available;
  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect(model.id)}
        aria-label={
          disabled ? `${model.title} — coming soon` : `${ariaVerb} ${model.title} by ${model.artist}`
        }
        className="group flex w-full flex-col text-left disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        <figure className={cn("prada-plate m-0 aspect-[3/4] w-full", disabled && "opacity-50")}>
          <img
            src={model.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="prada-plate__img"
          />
        </figure>
        <div className="mt-4 w-full border-t border-black/10 pt-3">
          <div className="flex items-baseline justify-between">
            <span className="prada-mono-caps text-[10px] text-black/45">{pad2(index + 1)}</span>
            {disabled && <span className="prada-mono-caps text-[10px] text-black/45">Soon</span>}
          </div>
          <h3 className="prada-display mt-2 text-[16px] md:text-[18px] leading-[1.25]">{model.title}</h3>
          <p className="prada-body mt-1 text-[13px] text-black/55">
            {model.artist} · {model.year}
          </p>
          {!disabled && (
            <span className="prada-link-cta mt-4 group-hover:opacity-65" aria-hidden="true">
              {cta}
            </span>
          )}
        </div>
      </button>
    </li>
  );
}
