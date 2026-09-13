import {
  PAINTINGS,
  MONUMENTS,
  type ModelEntry,
  type ModelId,
} from "@/content/models";
import { cn } from "@/lib/utils";

interface Props {
  onSelect: (id: ModelId) => void;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * First screen of the fabrication demo: the pieces on offer, as rows of
 * plates under a hairline, the way the demo hub and the homepage set theirs.
 */
export function FabricationPicker({ onSelect }: Props) {
  return (
    <>
      <section className="pt-14 md:pt-20 px-6 md:px-10" aria-labelledby="fabrication-heading">
        <div className="mx-auto max-w-[1140px]">
          <h1
            id="fabrication-heading"
            className="prada-display text-[30px] md:text-[44px] leading-[1.08] max-w-[22ch]"
          >
            Pick a piece to fabricate.
          </h1>
          <p className="prada-body mt-5 text-[15px] md:text-[16px] leading-[1.65] text-black/65 max-w-[56ch]">
            Choose a painting or a monument and follow its tactile relief into the
            physical world: built up layer by layer, then finished by hand.
          </p>
        </div>
      </section>

      <section className="pt-10 md:pt-14 pb-20 md:pb-28 px-6 md:px-10">
        <div className="mx-auto flex max-w-[1140px] flex-col gap-14 md:gap-16">
          <PieceGroup title="Paintings" models={PAINTINGS} indexOffset={0} onSelect={onSelect} />
          <PieceGroup
            title="Monuments"
            models={MONUMENTS}
            indexOffset={PAINTINGS.length}
            onSelect={onSelect}
          />
        </div>
      </section>
    </>
  );
}

function PieceGroup({
  title,
  models,
  indexOffset,
  onSelect,
}: {
  title: string;
  models: ModelEntry[];
  indexOffset: number;
  onSelect: (id: ModelId) => void;
}) {
  const available = models.filter((m) => m.available).length;
  return (
    <section aria-label={title}>
      <div className="flex items-baseline justify-between border-b border-black/10 pb-3">
        <h2 className="prada-mono-caps text-[10px] text-black">{title}</h2>
        <span className="prada-mono-caps text-[10px] text-black/45">{pad2(available)} available</span>
      </div>
      <ol className="mt-8 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-10">
        {models.map((m, i) => (
          <PieceCard key={m.id} model={m} index={indexOffset + i} onSelect={onSelect} />
        ))}
      </ol>
    </section>
  );
}

function PieceCard({
  model,
  index,
  onSelect,
}: {
  model: ModelEntry;
  index: number;
  onSelect: (id: ModelId) => void;
}) {
  const disabled = !model.available;
  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect(model.id)}
        aria-label={
          disabled
            ? `${model.title} — coming soon`
            : `Fabricate ${model.title} by ${model.artist}`
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
              Fabricate
            </span>
          )}
        </div>
      </button>
    </li>
  );
}
