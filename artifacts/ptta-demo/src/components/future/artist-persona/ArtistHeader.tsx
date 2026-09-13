import { motion, useReducedMotion } from "framer-motion";
import type { ArtistMeta } from "@/content/artists";

interface Props {
  artist: ArtistMeta;
}

/** Who is speaking: name, dates, portrait on a plate, and a line in their words. */
export function ArtistHeader({ artist }: Props) {
  const reduceMotion = useReducedMotion() ?? false;
  const src = `${import.meta.env.BASE_URL || "/"}${artist.portrait}`.replace(/\/{2,}/g, "/");

  return (
    <motion.div
      key={artist.id}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <p className="prada-mono-caps text-[10px] text-black/45">Speaking with</p>
      <h2 className="prada-display mt-2 text-[24px] md:text-[28px] leading-[1.12]">{artist.displayName}</h2>
      <p className="prada-body mt-1 text-[14px] text-black/55">
        {artist.lifespan} · {artist.tagline}
      </p>
      <figure className="prada-plate m-0 mt-5 aspect-[4/5] w-full max-w-[220px]">
        <img
          src={src}
          alt={artist.portraitAlt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </figure>
      <blockquote className="mt-5 border-l border-black/20 pl-4">
        <p className="prada-body text-[15px] leading-[1.6] text-black/65">“{artist.quote}”</p>
      </blockquote>
    </motion.div>
  );
}
