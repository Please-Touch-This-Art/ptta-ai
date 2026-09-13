import type { ModelId } from "@/content/models";
import { PiecePicker } from "@/components/prada/PiecePicker";

/** First screen of the fabrication demo. */
export function FabricationPicker({ onSelect }: { onSelect: (id: ModelId) => void }) {
  return (
    <PiecePicker
      heading="Pick a piece to fabricate."
      intro="Choose a painting or a monument and follow its tactile relief into the physical world: built up layer by layer, then finished by hand."
      cta="Fabricate"
      ariaVerb="Fabricate"
      onSelect={onSelect}
    />
  );
}
