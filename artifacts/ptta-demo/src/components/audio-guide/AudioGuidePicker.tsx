import type { ModelId } from "@/content/models";
import { PiecePicker } from "@/components/prada/PiecePicker";

/** First screen of the audio guide demo. */
export function AudioGuidePicker({ onSelect }: { onSelect: (id: ModelId) => void }) {
  return (
    <PiecePicker
      heading="Pick a piece to listen to."
      intro="Choose a painting or a monument and hear how its audio guide comes together: the work read, its history gathered, a narrative written, then given a voice."
      cta="Listen"
      ariaVerb="Listen to"
      onSelect={onSelect}
    />
  );
}
