import { useCallback, useEffect } from "react";
import type { MouseEvent } from "react";
import { useLocation } from "wouter";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const HOME_PATH = "/";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/* "instant", not "auto": `auto` defers to the CSS `scroll-behavior: smooth`
   on <html>, so it would animate for exactly the people who asked not to be
   animated at — and never arrive at all if the frames were not running. */
function scrollToHash(hash: string, reduceMotion: boolean): boolean {
  const el = document.querySelector(hash);
  if (!el) return false;
  el.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "start" });
  return true;
}

/**
 * The link handler behind the site header and footer, so every page in the
 * Prada design navigates the same way. Section anchors (`#portfolio`) belong to
 * the homepage: on the homepage they scroll; anywhere else they go home carrying
 * the hash, and the homepage scrolls on arrival (see useScrollToHashOnMount).
 * Anything else is a route. `onNavigate` runs first, for closing a menu.
 */
export function useSiteGo(onNavigate?: () => void) {
  const [path, navigate] = useLocation();
  const reduceMotion = useMediaQuery(REDUCED_MOTION);

  return useCallback(
    (href: string) => (e?: MouseEvent) => {
      e?.preventDefault();
      onNavigate?.();
      if (href.startsWith("#")) {
        if (path === HOME_PATH && scrollToHash(href, reduceMotion)) return;
        navigate(`${HOME_PATH}${href}`);
        return;
      }
      navigate(href);
    },
    [path, navigate, reduceMotion, onNavigate],
  );
}

/**
 * For the homepage: scroll to the section the URL hash names once the page has
 * rendered, which is how a section link in another page's header or footer
 * lands. Runs once on mount, on purpose.
 */
export function useScrollToHashOnMount() {
  const reduceMotion = useMediaQuery(REDUCED_MOTION);
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const frame = requestAnimationFrame(() => scrollToHash(hash, reduceMotion));
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
