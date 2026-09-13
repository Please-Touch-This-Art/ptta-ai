import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  placeholder: string;
  suggested: [string, string];
  showSuggested: boolean;
  disabled: boolean;
  onSend: (text: string) => void;
}

const MAX_CHARS = 500;
const COUNTER_FROM = 400;

/** A question for the painter: two openers as links, then a hairline field. */
export function ChatInput({ placeholder, suggested, showSuggested, disabled, onSend }: Props) {
  const [text, setText] = useState("");
  const reduceMotion = useReducedMotion() ?? false;

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_CHARS) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <div className="mt-5 flex flex-col gap-4">
      {showSuggested && (
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {suggested.map((s, i) => (
            <motion.button
              key={s}
              type="button"
              onClick={() => onSend(s)}
              disabled={disabled}
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="prada-link-cta text-left normal-case tracking-normal disabled:opacity-40"
              style={{ fontFamily: "var(--prada-futura)", fontSize: 14 }}
            >
              {s}
            </motion.button>
          ))}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-center gap-4 border-b border-black/25 transition-colors focus-within:border-black"
      >
        <label htmlFor="artist-chat-input" className="sr-only">
          Your message
        </label>
        <input
          id="artist-chat-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder={placeholder}
          disabled={disabled}
          className="prada-body flex-1 bg-transparent py-3 text-[15px] text-black outline-none placeholder:text-black/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || text.trim().length === 0}
          aria-label="Send message"
          className="prada-link-cta shrink-0 disabled:opacity-30"
        >
          Send
        </button>
      </form>
      {text.length >= COUNTER_FROM && (
        <p className="prada-mono-caps -mt-1 self-end text-[10px] text-black/45">
          {text.length} / {MAX_CHARS}
        </p>
      )}
    </div>
  );
}
