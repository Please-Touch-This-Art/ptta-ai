import { motion } from "framer-motion";
import type { ModelEntry } from "@/content/models";
import { fabricationImage } from "@/content/fabrication-images";

interface Props {
  model: ModelEntry;
  onBack: () => void;
}

export function RevealStage({ model }: Props) {
  const src = fabricationImage(model.id);

  return (
    <div className="fixed inset-0 bg-stone-950 text-cream overflow-hidden">
      {/* Image area — padded so the full photo always fits between the
          top and bottom overlays, preserving aspect ratio on any screen. */}
      <div
        className="absolute inset-0 flex items-center justify-center px-4"
        style={{
          paddingTop: "calc(max(5.5rem, env(safe-area-inset-top) + 4.5rem))",
          paddingBottom:
            "calc(max(11rem, env(safe-area-inset-bottom) + 10rem))",
        }}
      >
        {src ? (
          <motion.img
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={src}
            alt={`Finished tactile relief of ${model.title} by ${model.artist}`}
            className="max-w-full max-h-full object-contain"
            style={{
              width: "auto",
              height: "auto",
            }}
          />
        ) : (
          <p className="text-white/60 text-sm">Finished piece not on file yet.</p>
        )}
      </div>

      {/* Bottom caption + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 z-10 px-5 pt-20 pb-[max(6.5rem,env(safe-area-inset-bottom)+5.5rem)]"
        style={{
          background:
            "linear-gradient(to top, rgba(10,8,6,0.92) 40%, rgba(10,8,6,0))",
        }}
      >
        <div className="mx-auto w-full max-w-[440px] text-center">
          <p
            className="ptta-label text-accent mb-2"
            style={{ fontSize: "10pt" }}
          >
            This is how it looks in your hands
          </p>
          {model.commissionedBy && (
            <p
              className="ptta-label text-white/60 mb-3"
              style={{ fontSize: "9pt" }}
            >
              {model.commissionedBy}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
