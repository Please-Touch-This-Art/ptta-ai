import type { ModelId } from "@/content/models";
import { PiecePicker } from "@/components/prada/PiecePicker";

/** First screen of the model demo. */
export function ModelPicker({ onSelect }: { onSelect: (id: ModelId) => void }) {
  return (
    <PiecePicker
      heading="Pick a piece to touch."
      intro="Choose a painting or a monument and watch it read for depth, stroke by stroke, until it stands as a relief you can turn in your hands."
      cta="Open"
      ariaVerb="Open"
      onSelect={onSelect}
    />
  );
}
