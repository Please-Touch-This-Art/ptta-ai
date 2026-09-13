import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ChatMessage } from "./useArtistChat";

interface Props {
  messages: ChatMessage[];
  status: "idle" | "streaming" | "error";
  artistShortName: string;
}

const NEAR_BOTTOM_PX = 40;

function ThinkingDots() {
  return (
    <span aria-label="Thinking" className="inline-flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-black/60"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

/** The conversation: the reader's lines set solid, the painter's on the page. */
export function ChatTranscript({ messages, status, artistShortName }: Props) {
  const reduceMotion = useReducedMotion() ?? false;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUp = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      userScrolledUp.current = el.scrollHeight - el.scrollTop - el.clientHeight >= NEAR_BOTTOM_PX;
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  /* Scroll the log itself, not the page: scrollIntoView walks every ancestor,
     and on an empty log at mount it dragged the whole page down to the panel. */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0 || userScrolledUp.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const lastMessage = messages[messages.length - 1];
  const showThinkingDots =
    status === "streaming" && lastMessage?.role === "assistant" && lastMessage.content.length === 0;

  return (
    <div
      ref={scrollRef}
      id="artist-chat-panel"
      role="log"
      aria-live="polite"
      aria-atomic="false"
      aria-label={`Chat with ${artistShortName}`}
      className="flex-1 overflow-y-auto border border-black/10 px-5 py-5"
      style={{ minHeight: 260, maxHeight: "52vh", background: "var(--prada-band)" }}
    >
      {messages.length === 0 && (
        <div className="flex h-full min-h-[200px] items-center justify-center px-3 text-center">
          <p className="prada-body text-[15px] leading-[1.6] text-black/45">
            Choose a question below, or ask {artistShortName} anything.
          </p>
        </div>
      )}
      <ul className="flex flex-col gap-3">
        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;
          const streamingHere =
            m.role === "assistant" && status === "streaming" && isLast && m.content.length > 0;
          return (
            <motion.li
              key={i}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`prada-body max-w-[82%] whitespace-pre-wrap px-4 py-3 text-[15px] leading-[1.55] ${
                m.role === "user"
                  ? "self-end bg-black text-white"
                  : "self-start border border-black/15 bg-white text-black"
              }`}
            >
              {showThinkingDots && isLast ? (
                <ThinkingDots />
              ) : (
                <>
                  {m.content}
                  {streamingHere && (
                    <motion.span
                      aria-hidden
                      className="ml-0.5 inline-block h-[1em] w-[2px] align-middle bg-black"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </>
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
