import { useCallback, useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { MODELS, type ModelId } from "@/content/models";
import { SiteShell } from "@/components/prada/SiteShell";
import { STAGE_FADE } from "@/components/prada/stageFade";
import { FabricationPicker } from "@/components/fabrication/FabricationPicker";
import { FabricateStage } from "@/components/fabrication/FabricateStage";
import { PolishStage } from "@/components/fabrication/PolishStage";
import { RevealStage } from "@/components/fabrication/RevealStage";

type Stage =
  | { stage: "picker" }
  | { stage: "fabricate"; modelId: ModelId }
  | { stage: "polish"; modelId: ModelId }
  | { stage: "reveal"; modelId: ModelId };


export default function Fabrication() {
  const [, navigate] = useLocation();
  const [state, setState] = useState<Stage>({ stage: "picker" });

  const handleSelect = useCallback((id: ModelId) => {
    setState({ stage: "fabricate", modelId: id });
  }, []);

  const toPolish = useCallback(() => {
    setState((prev) =>
      prev.stage === "fabricate" ? { stage: "polish", modelId: prev.modelId } : prev,
    );
  }, []);

  const toReveal = useCallback(() => {
    setState((prev) =>
      prev.stage === "polish" ? { stage: "reveal", modelId: prev.modelId } : prev,
    );
  }, []);

  const toPicker = useCallback(() => setState({ stage: "picker" }), []);
  const toHub = useCallback(() => navigate("/demo-hub"), [navigate]);

  const model =
    state.stage === "picker" ? undefined : MODELS.find((m) => m.id === state.modelId);

  /* The header and footer stay put; only the stage between them crossfades. */
  return (
    <SiteShell>
      <AnimatePresence mode="wait">
        {(!model || state.stage === "picker") && (
          <motion.div key="picker" {...STAGE_FADE}>
            <FabricationPicker onSelect={handleSelect} />
          </motion.div>
        )}
        {model && state.stage === "fabricate" && (
          <motion.div key="fabricate" {...STAGE_FADE}>
            <FabricateStage key={model.id} model={model} onDone={toPolish} onBack={toPicker} onSwap={handleSelect} />
          </motion.div>
        )}
        {model && state.stage === "polish" && (
          <motion.div key="polish" {...STAGE_FADE}>
            <PolishStage key={model.id} model={model} onDone={toReveal} onBack={toPicker} onSwap={handleSelect} />
          </motion.div>
        )}
        {model && state.stage === "reveal" && (
          <motion.div key="reveal" {...STAGE_FADE}>
            <RevealStage
              key={model.id}
              model={model}
              onBack={toHub}
              onPickAnother={toPicker}
              onSwap={handleSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SiteShell>
  );
}
