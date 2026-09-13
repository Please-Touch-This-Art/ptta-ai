import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useArtistChat } from "./useArtistChat";
import { ARTISTS, type ArtistId } from "@/content/artists";
import { ArtistPicker } from "./ArtistPicker";
import { ArtistHeader } from "./ArtistHeader";
import { ChatTranscript } from "./ChatTranscript";
import { ChatInput } from "./ChatInput";

const ERROR_COPY: Record<string, (name: string) => string> = {
  rate_limit: (name) => `Too many questions at once. Give ${name} a breath.`,
  upstream: (name) => `${name} is away from the easel. Try again in a moment.`,
  timeout: (name) => `${name} is away from the easel. Try again in a moment.`,
  network: (name) => `Couldn't reach ${name}. Check your connection and try again.`,
  validation: () => "That message is too long. Keep it under 500 characters.",
};

export function ArtistPersona() {
  const chat = useArtistChat("van-gogh");
  const artist = ARTISTS[chat.artistId];
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section className="flex flex-col" aria-label="AI Artist Persona">
      <ArtistPicker selected={chat.artistId} onSelect={(id: ArtistId) => chat.switchArtist(id)} />

      <div className="mt-10 grid grid-cols-1 items-start gap-10 md:grid-cols-[280px_minmax(0,1fr)] md:gap-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={chat.artistId}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ArtistHeader artist={artist} />
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col">
          <ChatTranscript
            messages={chat.messages}
            status={chat.status}
            artistShortName={artist.shortName}
          />

          {chat.status === "error" && chat.error && (
            <div
              role="alert"
              className="mt-4 flex items-center justify-between gap-4 border border-black/15 px-4 py-3"
            >
              <span className="prada-body text-[14px] text-black/75">
                {ERROR_COPY[chat.error.code]?.(artist.shortName) ?? "Something went wrong."}
              </span>
              {chat.error.code !== "validation" && (
                <button type="button" onClick={() => void chat.retry()} className="prada-link-cta shrink-0">
                  Retry
                </button>
              )}
            </div>
          )}

          <ChatInput
            placeholder={artist.placeholder}
            suggested={artist.suggested}
            showSuggested={chat.messages.length === 0 && chat.status !== "streaming"}
            disabled={chat.status === "streaming"}
            onSend={(text) => void chat.send(text)}
          />
        </div>
      </div>
    </section>
  );
}
