/**
 * Copy for the public site (Prada direction), in English and German.
 *
 * Kept separate from `copy.ts` so the shared PageCopy shape used by the demo
 * modules does not have to change. German is the working language of the
 * museums this site sells into, so the language switch has to resolve to real
 * strings rather than falling back to English.
 *
 * House style: no em dashes anywhere in visitor-facing copy.
 */

export type SiteLang = "en" | "de";

export interface SiteCopy {
  langName: string;
  nav: { product: string; impact: string; portfolio: string; partners: string; contact: string };
  menu: { open: string; close: string; experience: string; howItWorks: string; language: string };
  hero: {
    headLead: string;
    headEm: string;
    headTail: string;
    subLead: string;
    subEm: string;
    subTail: string;
    cta: string;
    play: string;
    pause: string;
  };
  /**
   * The product section. These are photographs of artworks already hanging in
   * a museum, each shown with the tactile model we made of it, so the section
   * reads as a display of the work rather than a catalogue of goods for sale.
   *
   * `meta` only names an artist where the museum's own wall label in the
   * photograph confirms it; the rest describe the installation instead of
   * attributing work we cannot read.
   */
  product: {
    eyebrow: string;
    heading: string;
    /** The three pinned steps, walked through as the page scrolls past. */
    steps: { title: string; body: string }[];
    /** Heading over the collage of installed work. */
    settingsHeading: string;
    settingsBody: string;
    /** The collage runs uncaptioned, so these carry alt text only. */
    plates: { alt: string }[];
    cta: string;
  };
  /**
   * Before/after comparison. The two images are registered: the relief render
   * is cropped to its slab and scaled onto the painting's frame, so wiping
   * between them shows the same composition rather than two loose photographs.
   */
  compare: {
    beforeLabel: string;
    afterLabel: string;
    beforeAlt: string;
    afterAlt: string;
    caption: string;
    sliderLabel: string;
    view3d: string;
    modelAlt: string;
    modelMeta: string;
    close: string;
    loading: string;
    loadError: string;
  };
  stats: { value: string; label: string }[];
  voices: { heading: string; meta: string };
  /** Attributed quotes. `org` is split out so it can carry its own weight. */
  testimonials: { quote: string; name: string; role: string; org: string }[];
  partners: { eyebrow: string; heading: string };
  museums: { heading: string };
  portfolio: {
    eyebrow: string;
    heading: string;
    body: string;
    /** The collage runs uncaptioned, so these carry alt text only. */
    tiles: { alt: string }[];
  };
  impact: {
    eyebrow: string;
    heading: string;
    lead: string;
    bigStat: string;
    bigStatLabel: string;
    dotNote: string;
    ofWhich: string;
    subStat: string;
    subStatLabel: string;
    source: string;
    solutionHeading: string;
    solutionBody: string;
    solutionCta: string;
  };
  slogan: { lead: string; em: string; tail: string; caption: string };
  contact: {
    heading: string;
    email: string;
    form: {
      name: string;
      email: string;
      institution: string;
      institutionOptional: string;
      message: string;
      /** Subject line on the composed mail — it lands in an inbox, so it says
          where the message came from rather than repeating the heading. */
      subject: string;
      send: string;
      required: string;
      invalidEmail: string;
      /** Shown once the draft has been handed to the visitor's mail client. */
      handoff: string;
    };
  };
  footer: {
    tagline: string;
    explore: string;
    company: string;
    contact: string;
    links: {
      portfolio: string;
      voices: string;
      experience: string;
      howItWorks: string;
      impact: string;
      partners: string;
      next: string;
      place: string;
    };
    legal: string;
    stamp: string;
  };
}

const en: SiteCopy = {
    "langName": "English",
    "nav": {
      "product": "The models",
      "impact": "Impact",
      "portfolio": "Portfolio",
      "partners": "Partners",
      "contact": "Contact"
    },
    "menu": {
      "open": "Menu",
      "close": "Close",
      "experience": "Experience",
      "howItWorks": "How it works",
      "language": "Language"
    },
    "hero": {
      "headLead": "Art, you can ",
      "headEm": "touch",
      "headTail": ".",
      "subLead": "Tactile 3D models of museum artworks, for ",
      "subEm": "blind and partially sighted",
      "subTail": " visitors.",
      "cta": "See it in action",
      "play": "Play background video",
      "pause": "Pause background video"
    },
    "product": {
      "eyebrow": "Our product",
      "heading": "Tactile artworks for inclusive museum experiences.",
      "steps": [
        {
          "title": "Reading depth with AI",
          "body": "Brushwork read stroke by stroke to infer depth."
        },
        {
          "title": "Painting and relief",
          "body": "The artwork as it hangs, and the relief made from it."
        },
        {
          "title": "The finished model",
          "body": "Printed, mounted on its plinth, read by hand."
        }
      ],
      "plates": [
        {
          "alt": "A tactile relief mounted in a dark frame on a gallery wall, lit from above."
        },
        {
          "alt": "A large framed landscape of a country road lined with birches, with a white tactile relief of the same scene on a dark plinth beside it."
        },
        {
          "alt": "A gold-framed Van Gogh still life of daffodils lit on a gallery wall, with its white tactile relief on a plinth below, labelled Please Touch This Art in print and braille."
        },
        {
          "alt": "A framed painting of people crossing on a ferry, with a white tactile relief of the same scene on a plinth below it."
        }
      ],
      "cta": "See our portfolio",
      "settingsHeading": "Four museums, and counting",
      "settingsBody": "Our models stand in four museums and galleries today, each one beside the work it was made from. Several more are in progress with institutions across Germany and beyond."
    },
    "compare": {
      "beforeLabel": "Painting",
      "afterLabel": "Tactile relief",
      "beforeAlt": "Van Gogh's self-portrait in a grey felt hat against a halo of blue brushstrokes, the original flat painting.",
      "afterAlt": "The same self-portrait as a coloured tactile relief, the brushstrokes raised into ridges that catch the light.",
      "caption": "Vincent van Gogh · Self-Portrait with Grey Felt Hat, 1887",
      "sliderLabel": "Compare the painting with the tactile relief",
      "view3d": "Preview in 3D",
      "modelAlt": "Rotatable 3D model of the tactile relief of Van Gogh's Self-Portrait with Grey Felt Hat.",
      "modelMeta": "Drag to rotate · Scroll to zoom",
      "close": "Close 3D preview",
      "loading": "Loading model",
      "loadError": "The model could not be loaded"
    },
    "stats": [
      {
        "value": "27+",
        "label": "Model installations"
      },
      {
        "value": "5,680+",
        "label": "Visitors reached"
      },
      {
        "value": "80%",
        "label": "More visitor interaction"
      }
    ],
    "voices": {
      "heading": "Hear what they have to say",
      "meta": "2 min · English subtitles"
    },
    "partners": {
      "eyebrow": "Our partners",
      "heading": "Creating inclusive access together"
    },
    "museums": {
      "heading": "Our customers"
    },
    "portfolio": {
      "eyebrow": "The work",
      "heading": "Built with blind and partially sighted people",
      "body": "Not just for them, with them. Every model is read by blind collaborators before it reaches a gallery.",
      "tiles": [
        {
          "alt": "Four people gathered around a table, their hands resting on a white tactile model of the St. Nikolai church spire."
        },
        {
          "alt": "A woman wearing headphones in a gallery, reading a framed tactile relief mounted on a stand beside the paintings."
        },
        {
          "alt": "Close view of a woman's hands moving across the raised surface of a white tactile model."
        },
        {
          "alt": "A woman seated at a table, both hands reading a white tactile relief in its frame."
        }
      ]
    },
    "impact": {
      "eyebrow": "Why it matters",
      "heading": "Most museums say do not touch. For some visitors, that leaves nothing.",
      "lead": "Where our models are installed, museums report 80% more interaction. By 2027 we aim to reach over 10,000 blind and partially sighted visitors a year.",
      "bigStat": "300M",
      "bigStatLabel": "people worldwide live with vision impairment.",
      "dotNote": "Each dot ≈ 10M people",
      "ofWhich": "Of which",
      "subStat": "43M",
      "subStatLabel": "fully blind",
      "source": "Source · WHO, 2023",
      "solutionHeading": "Our solution",
      "solutionBody": "Tactile 3D models paired with custom audio. Each one ships with its plinth, a braille plaque and a described track.",
      "solutionCta": "The full process"
    },
    "slogan": {
      "lead": "Museums say do not touch. ",
      "em": "We’re changing that",
      "tail": ".",
      "caption": "Barrier-free · Inclusive · Accessible to all"
    },
    "contact": {
      "heading": "Get in touch",
      "email": "contact@ptta.art",
      "form": {
        "name": "Name",
        "email": "Email",
        "institution": "Museum or institution",
        "institutionOptional": "optional",
        "message": "Message",
        "subject": "Website enquiry",
        "send": "Send",
        "required": "Please fill this in.",
        "invalidEmail": "Please check this email address.",
        "handoff": "Your message is ready in your email app. Send it there and we will come back to you."
      }
    },
    "footer": {
      "tagline": "Tactile 3D models of museum artworks, made for hands.",
      "explore": "Explore",
      "company": "Company",
      "contact": "Contact",
      "links": {
        "portfolio": "Portfolio",
        "voices": "In their words",
        "experience": "Experience",
        "howItWorks": "How it works",
        "impact": "Impact",
        "partners": "Partners",
        "next": "What’s next",
        "place": "Heilbronn, Germany"
      },
      "legal": "Impressum · Datenschutz · Accessibility",
      "stamp": "Heilbronn · 2026"
    },
    "testimonials": [
      {
        "quote": "The tactile models are a wonderful enrichment for our exhibition: an invitation for blind and visually impaired people to experience art, and a chance for everyone to discover it with all their senses.",
        "name": "Dr. Katja Pourshirazi",
        "role": "Museum Director, ",
        "org": "Overbeck-Museum"
      },
      {
        "quote": "The first time I could feel the brushstrokes, I finally understood what everyone had been describing to me for years.",
        "name": "Hela Michalski",
        "role": "Germany’s accessibility expert",
        "org": ""
      }
    ]
  };

const de: SiteCopy = {
    "langName": "Deutsch",
    "nav": {
      "product": "Die Modelle",
      "impact": "Wirkung",
      "portfolio": "Portfolio",
      "partners": "Partner",
      "contact": "Kontakt"
    },
    "menu": {
      "open": "Menü",
      "close": "Schließen",
      "experience": "Erleben",
      "howItWorks": "So entsteht es",
      "language": "Sprache"
    },
    "hero": {
      "headLead": "Kunst zum ",
      "headEm": "Anfassen",
      "headTail": ".",
      "subLead": "Tastmodelle von Museumswerken, für ",
      "subEm": "blinde und sehbehinderte",
      "subTail": " Besucherinnen und Besucher.",
      "cta": "In Aktion sehen",
      "play": "Hintergrundvideo abspielen",
      "pause": "Hintergrundvideo pausieren"
    },
    "product": {
      "eyebrow": "Unser Produkt",
      "heading": "Taktile Kunstwerke für inklusive Museumserlebnisse.",
      "steps": [
        {
          "title": "Tiefe per KI lesen",
          "body": "Pinselstrich für Pinselstrich gelesen, um Tiefe abzuleiten."
        },
        {
          "title": "Gemälde und Relief",
          "body": "Das Werk, wie es hängt, und das Relief daraus."
        },
        {
          "title": "Das fertige Modell",
          "body": "Gedruckt, auf dem Sockel, zum Ertasten."
        }
      ],
      "plates": [
        {
          "alt": "Ein Tastrelief in dunklem Rahmen an einer Museumswand, von oben beleuchtet."
        },
        {
          "alt": "Ein großes gerahmtes Landschaftsgemälde mit einem von Birken gesäumten Landweg, daneben auf einem dunklen Sockel das weiße Tastrelief derselben Szene."
        },
        {
          "alt": "Ein goldgerahmtes Van-Gogh-Stillleben mit Narzissen an einer beleuchteten Museumswand, darunter auf einem Sockel das weiße Tastrelief mit dem Schild Please Touch This Art in Schrift und Braille."
        },
        {
          "alt": "Ein gerahmtes Gemälde von Menschen auf einer Fähre, darunter auf einem Sockel das weiße Tastrelief derselben Szene."
        }
      ],
      "cta": "Unser Portfolio ansehen",
      "settingsHeading": "Vier Museen, Tendenz steigend",
      "settingsBody": "Unsere Modelle stehen heute in vier Museen und Galerien, jedes neben dem Werk, aus dem es entstanden ist. Weitere entstehen gerade mit Häusern in Deutschland und darüber hinaus."
    },
    "compare": {
      "beforeLabel": "Gemälde",
      "afterLabel": "Tastrelief",
      "beforeAlt": "Van Goghs Selbstporträt mit grauem Filzhut vor einem Kranz blauer Pinselstriche, das flache Original.",
      "afterAlt": "Dasselbe Selbstporträt als farbiges Tastrelief, in dem die Pinselstriche zu Graten erhoben sind, die das Licht fangen.",
      "caption": "Vincent van Gogh · Selbstbildnis mit grauem Filzhut, 1887",
      "sliderLabel": "Gemälde und Tastrelief vergleichen",
      "view3d": "In 3D ansehen",
      "modelAlt": "Drehbares 3D-Modell des Tastreliefs von Van Goghs Selbstbildnis mit grauem Filzhut.",
      "modelMeta": "Ziehen zum Drehen · Scrollen zum Zoomen",
      "close": "3D-Ansicht schließen",
      "loading": "Modell wird geladen",
      "loadError": "Das Modell konnte nicht geladen werden"
    },
    "stats": [
      {
        "value": "27+",
        "label": "Modell-Installationen"
      },
      {
        "value": "5.680+",
        "label": "Besucherinnen und Besucher"
      },
      {
        "value": "80%",
        "label": "mehr Besucherinteraktion"
      }
    ],
    "voices": {
      "heading": "Hören Sie, was sie sagen",
      "meta": "2 Min. · Englische Untertitel"
    },
    "partners": {
      "eyebrow": "Unsere Partner",
      "heading": "Gemeinsam inklusiven Zugang schaffen"
    },
    "museums": {
      "heading": "Unsere Kunden"
    },
    "portfolio": {
      "eyebrow": "Die Arbeit",
      "heading": "Mit blinden und sehbehinderten Menschen entwickelt",
      "body": "Nicht nur für sie, sondern mit ihnen. Jedes Modell wird von blinden Mitwirkenden geprüft, bevor es ins Museum kommt.",
      "tiles": [
        {
          "alt": "Vier Menschen um einen Tisch, die Hände auf einem weißen Tastmodell der Turmspitze von St. Nikolai."
        },
        {
          "alt": "Eine Frau mit Kopfhörern in einer Galerie ertastet ein gerahmtes Tastrelief auf einem Ständer neben den Gemälden."
        },
        {
          "alt": "Nahaufnahme der Hände einer Frau auf der erhabenen Oberfläche eines weißen Tastmodells."
        },
        {
          "alt": "Eine Frau am Tisch liest mit beiden Händen ein weißes Tastrelief in seinem Rahmen."
        }
      ]
    },
    "impact": {
      "eyebrow": "Warum es zählt",
      "heading": "Die meisten Museen sagen: nicht berühren. Für manche Besucher bleibt dann nichts.",
      "lead": "Wo unsere Modelle stehen, berichten Museen von 80% mehr Interaktion. Bis 2027 wollen wir jährlich über 10.000 blinde und sehbehinderte Besucher erreichen.",
      "bigStat": "300 Mio.",
      "bigStatLabel": "Menschen weltweit leben mit einer Sehbehinderung.",
      "dotNote": "Ein Punkt ≈ 10 Mio. Menschen",
      "ofWhich": "Davon",
      "subStat": "43 Mio.",
      "subStatLabel": "vollblind",
      "source": "Quelle · WHO, 2023",
      "solutionHeading": "Unsere Lösung",
      "solutionBody": "Tastmodelle mit eigener Audiobeschreibung. Jedes kommt mit Sockel, Braille-Schild und beschreibender Tonspur.",
      "solutionCta": "Der ganze Prozess"
    },
    "slogan": {
      "lead": "Museen sagen: nicht berühren. ",
      "em": "Wir ändern das",
      "tail": ".",
      "caption": "Barrierefrei · Inklusiv · Für alle zugänglich"
    },
    "contact": {
      "heading": "Kontakt aufnehmen",
      "email": "contact@ptta.art",
      "form": {
        "name": "Name",
        "email": "E-Mail",
        "institution": "Museum oder Institution",
        "institutionOptional": "optional",
        "message": "Nachricht",
        "subject": "Anfrage über die Website",
        "send": "Schicken",
        "required": "Bitte ausfüllen.",
        "invalidEmail": "Bitte prüfen Sie diese E-Mail-Adresse.",
        "handoff": "Ihre Nachricht liegt in Ihrem E-Mail-Programm bereit. Schicken Sie sie ab, wir melden uns."
      }
    },
    "footer": {
      "tagline": "Tastmodelle von Museumswerken, gemacht für Hände.",
      "explore": "Entdecken",
      "company": "Unternehmen",
      "contact": "Kontakt",
      "links": {
        "portfolio": "Portfolio",
        "voices": "Stimmen",
        "experience": "Erleben",
        "howItWorks": "So entsteht es",
        "impact": "Wirkung",
        "partners": "Partner",
        "next": "Ausblick",
        "place": "Heilbronn, Deutschland"
      },
      "legal": "Impressum · Datenschutz · Barrierefreiheit",
      "stamp": "Heilbronn · 2026"
    },
    "testimonials": [
      {
        "quote": "Die Tastmodelle sind eine wunderbare Bereicherung für unsere Ausstellung: eine Einladung an blinde und sehbehinderte Menschen, Kunst zu erleben, und für alle anderen die Möglichkeit, sie mit allen Sinnen zu entdecken.",
        "name": "Dr. Katja Pourshirazi",
        "role": "Museumsdirektorin, ",
        "org": "Overbeck-Museum"
      },
      {
        "quote": "Als ich zum ersten Mal die Pinselstriche spüren konnte, habe ich endlich verstanden, was mir alle seit Jahren beschrieben haben.",
        "name": "Hela Michalski",
        "role": "Deutschlands Expertin für Barrierefreiheit",
        "org": ""
      }
    ]
  };

export const siteCopy: Record<SiteLang, SiteCopy> = { en, de };
