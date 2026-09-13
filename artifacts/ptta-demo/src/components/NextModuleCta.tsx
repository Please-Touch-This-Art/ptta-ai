import { useLocation } from "wouter";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  fromSlug: string;
}

/** The link on to the next demo in the tour, or nothing if this is the last. */
export function NextModuleCta({ fromSlug }: Props) {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  const current = t.demoHub.cards.find((c) => c.slug === fromSlug);
  const nextSlug = current?.nextModule;
  const next = nextSlug ? t.demoHub.cards.find((c) => c.slug === nextSlug) : undefined;

  if (!next) return null;

  const destination = next.route ?? `/demo/${next.slug}`;

  return (
    <button
      type="button"
      onClick={() => navigate(destination)}
      className="prada-link-cta"
      aria-label={`Continue to ${next.title}`}
    >
      Next: {next.title}
    </button>
  );
}
