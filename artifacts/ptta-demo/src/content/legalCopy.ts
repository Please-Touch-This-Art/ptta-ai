/**
 * Impressum, Datenschutzerklärung and Barrierefreiheitserklärung.
 *
 * Every company-specific fact is left as a bracketed placeholder rather than
 * invented: a legal notice that names a fictional managing director or register
 * number is worse than no page at all, and these are the fields a lawyer or the
 * Handelsregister entry has to supply. Search for "[" to find them all.
 *
 * The third-party services listed under Datenschutz are the ones this site
 * actually contacts — verified against index.html and the runtime imports, not
 * assumed. If a service is added or removed, this list has to follow.
 */

export type LegalDocId = "impressum" | "datenschutz" | "accessibility";

export interface LegalSection {
  heading?: string;
  /** Rendered as paragraphs. */
  body?: string[];
  /** Rendered as a bulleted list under the paragraphs. */
  list?: string[];
}

export interface LegalDoc {
  title: string;
  updated: string;
  sections: LegalSection[];
}

export const PLACEHOLDER_NOTE = {
  en: "Bracketed fields below still need your company's details before this page goes live.",
  de: "Die eingeklammerten Felder müssen vor Veröffentlichung durch Ihre Unternehmensangaben ersetzt werden.",
};

const impressumDe: LegalDoc = {
  title: "Impressum",
  updated: "Stand: September 2026",
  sections: [
    {
      heading: "Angaben gemäß § 5 DDG",
      body: [
        "[Vollständiger Firmenname und Rechtsform]\n[Straße und Hausnummer]\n74072 Heilbronn\nDeutschland",
      ],
    },
    {
      heading: "Vertreten durch",
      body: ["[Name der vertretungsberechtigten Person]"],
    },
    {
      heading: "Kontakt",
      body: ["Telefon: [Telefonnummer]\nE-Mail: contact@ptta.art"],
    },
    {
      heading: "Registereintrag",
      body: [
        "Eintragung im Handelsregister.\nRegistergericht: [Amtsgericht]\nRegisternummer: [HRB-Nummer]",
        "Sofern keine Eintragung besteht, ist dieser Abschnitt zu entfernen.",
      ],
    },
    {
      heading: "Umsatzsteuer-ID",
      body: [
        "Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: [USt-IdNr.]",
      ],
    },
    {
      heading: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
      body: ["[Name]\n[Straße und Hausnummer]\n74072 Heilbronn"],
    },
    {
      heading: "EU-Streitschlichtung",
      body: [
        "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: https://ec.europa.eu/consumers/odr/",
        "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
      ],
    },
    {
      heading: "Bildnachweis",
      body: [
        "Die auf dieser Website gezeigten Fotografien von Modellen, Ausstellungen und Testsitzungen stammen, soweit nicht anders angegeben, von Please Touch This Art. Abgebildete Kunstwerke sind Eigentum der jeweiligen Museen.",
      ],
    },
  ],
};

const impressumEn: LegalDoc = {
  title: "Legal notice",
  updated: "Last updated: September 2026",
  sections: [
    {
      body: [
        "This legal notice follows German law (§ 5 DDG). The German version is the operative one.",
      ],
    },
    {
      heading: "Company details",
      body: [
        "[Full company name and legal form]\n[Street and number]\n74072 Heilbronn\nGermany",
      ],
    },
    { heading: "Represented by", body: ["[Name of authorised representative]"] },
    {
      heading: "Contact",
      body: ["Phone: [phone number]\nEmail: contact@ptta.art"],
    },
    {
      heading: "Register entry",
      body: [
        "Register court: [local court]\nRegistration number: [HRB number]",
        "Remove this section if the company is not entered in a register.",
      ],
    },
    {
      heading: "VAT identification number",
      body: ["VAT ID under § 27 a of the German VAT Act: [VAT ID]"],
    },
    {
      heading: "Responsible for editorial content (§ 18 (2) MStV)",
      body: ["[Name]\n[Street and number]\n74072 Heilbronn"],
    },
    {
      heading: "Online dispute resolution",
      body: [
        "The European Commission provides a platform for online dispute resolution: https://ec.europa.eu/consumers/odr/",
        "We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.",
      ],
    },
    {
      heading: "Image credits",
      body: [
        "Photographs of models, installations and testing sessions are by Please Touch This Art unless stated otherwise. The artworks shown belong to the museums that hold them.",
      ],
    },
  ],
};

const datenschutzDe: LegalDoc = {
  title: "Datenschutzerklärung",
  updated: "Stand: September 2026",
  sections: [
    {
      heading: "Verantwortlicher",
      body: [
        "Verantwortlich für die Datenverarbeitung auf dieser Website ist:\n[Firmenname]\n[Straße und Hausnummer]\n74072 Heilbronn\nE-Mail: contact@ptta.art",
      ],
    },
    {
      heading: "Server-Logfiles",
      body: [
        "Beim Aufruf dieser Website übermittelt Ihr Browser technisch notwendige Daten, die unser Hosting-Anbieter in Logfiles speichert: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, übertragene Datenmenge, Referrer sowie Browser- und Betriebssystemangaben.",
        "Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im sicheren und störungsfreien Betrieb der Website. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.",
      ],
    },
    {
      heading: "Kontaktaufnahme",
      body: [
        "Das Kontaktformular auf dieser Website versendet keine Daten an unseren Server. Es öffnet eine vorbereitete Nachricht in Ihrem eigenen E-Mail-Programm; erst wenn Sie diese dort absenden, erreichen uns Ihre Angaben.",
        "Wenn Sie uns per E-Mail schreiben, verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO. Wir löschen die Daten, sobald sie nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
      ],
    },
    {
      heading: "Lokale Speicherung im Browser",
      body: [
        "Diese Website setzt keine Cookies zu Analyse- oder Werbezwecken. Im lokalen Speicher Ihres Browsers (localStorage) hinterlegen wir ausschließlich Ihre Anzeigeeinstellungen, damit sie beim nächsten Besuch erhalten bleiben:",
      ],
      list: [
        "das gewählte Farbschema (hell oder dunkel)",
        "die gewählte Gestaltungsvariante der Demo",
      ],
    },
    {
      heading: "Eingebundene Dienste Dritter",
      body: [
        "Beim Aufruf der Website werden Inhalte von folgenden Anbietern geladen. Dabei wird Ihre IP-Adresse an den jeweiligen Anbieter übertragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.",
      ],
      list: [
        "Google Fonts (Google Ireland Limited, Irland) – Schriftarten. Datenschutzerklärung: https://policies.google.com/privacy",
        "Fontshare / Indian Type Foundry – Schriftarten. Datenschutzerklärung: https://www.fontshare.com/privacy",
        "unpkg (Cloudflare, Inc.) – Auslieferung einer Programmbibliothek zur Darstellung der 3D-Modelle. Datenschutzerklärung: https://www.cloudflare.com/privacypolicy/",
      ],
    },
    {
      heading: "KI-gestützter Dialog in der Demo",
      body: [
        "In der Demonstration „Artist Persona“ können Sie Nachrichten an eine KI-gestützte Figur senden. Ihre Eingaben werden zur Erzeugung der Antwort an Groq, Inc. (USA) übermittelt und dort verarbeitet. Übertragen wird ausschließlich der Text, den Sie eingeben; wir speichern die Unterhaltung nicht.",
        "Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Bitte geben Sie in dieser Demonstration keine personenbezogenen Daten ein.",
      ],
    },
    {
      heading: "Ihre Rechte",
      body: [
        "Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen die Verarbeitung. Wenden Sie sich dazu an contact@ptta.art.",
        "Ihnen steht ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu. Zuständig ist der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg.",
      ],
    },
  ],
};

const datenschutzEn: LegalDoc = {
  title: "Privacy policy",
  updated: "Last updated: September 2026",
  sections: [
    {
      body: [
        "This policy follows the GDPR. The German version is the operative one.",
      ],
    },
    {
      heading: "Controller",
      body: [
        "[Company name]\n[Street and number]\n74072 Heilbronn, Germany\nEmail: contact@ptta.art",
      ],
    },
    {
      heading: "Server log files",
      body: [
        "When you open this site your browser sends technically necessary data, which our hosting provider stores in log files: IP address, date and time, the page requested, volume transferred, referrer, and browser and operating system details.",
        "The legal basis is Art. 6 (1) (f) GDPR; our legitimate interest is the secure and reliable operation of the site. This data is not combined with other sources.",
      ],
    },
    {
      heading: "Contacting us",
      body: [
        "The contact form on this site does not send anything to our server. It opens a prepared message in your own email application; your details reach us only once you send it from there.",
        "If you email us, we process what you send in order to answer you, under Art. 6 (1) (b) or (f) GDPR, and delete it once it is no longer needed and no retention period applies.",
      ],
    },
    {
      heading: "Local storage in your browser",
      body: [
        "This site sets no analytics or advertising cookies. We store only your display preferences in your browser's local storage so they survive between visits:",
      ],
      list: [
        "the colour scheme you chose (light or dark)",
        "the design variant selected in the demo",
      ],
    },
    {
      heading: "Third-party services",
      body: [
        "Opening the site loads content from the providers below, which transfers your IP address to them. Legal basis: Art. 6 (1) (f) GDPR.",
      ],
      list: [
        "Google Fonts (Google Ireland Limited) – typefaces. https://policies.google.com/privacy",
        "Fontshare / Indian Type Foundry – typefaces. https://www.fontshare.com/privacy",
        "unpkg (Cloudflare, Inc.) – delivers a library used to display the 3D models. https://www.cloudflare.com/privacypolicy/",
      ],
    },
    {
      heading: "AI dialogue in the demo",
      body: [
        "In the Artist Persona demonstration you can send messages to an AI-driven character. Your input is sent to Groq, Inc. (USA) to generate the reply. Only the text you type is transmitted, and we do not store the conversation.",
        "Legal basis: Art. 6 (1) (f) GDPR. Please do not enter personal data in this demonstration.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You have the right to access, rectification, erasure, restriction of processing, data portability and objection at any time. Write to contact@ptta.art.",
        "You may also lodge a complaint with a supervisory authority; ours is the State Commissioner for Data Protection and Freedom of Information of Baden-Württemberg.",
      ],
    },
  ],
};

const accessibilityEn: LegalDoc = {
  title: "Accessibility",
  updated: "Last updated: September 2026",
  sections: [
    {
      body: [
        "This company exists to make museum collections readable by hand. A website that could not be used by the people we build for would contradict the work, so accessibility is treated here as part of the product rather than as a compliance exercise.",
      ],
    },
    {
      heading: "What we aim for",
      body: [
        "We target the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA. We have not yet commissioned an independent audit, so this is a statement of intent and of current practice, not a certified conformance claim.",
      ],
    },
    {
      heading: "What is in place",
      list: [
        "Every image carries descriptive alt text, written to convey what the photograph shows rather than to name a file.",
        "The site is operable by keyboard, and interactive controls show a visible focus outline.",
        "Video is never autoplayed with sound, and the testimonials film carries subtitles.",
        "Motion respects the operating system's reduce-motion setting, with one deliberate exception noted below.",
        "Colour is never the only means of conveying information.",
        "A light and a dark theme are both available, and text contrast is checked in each.",
      ],
    },
    {
      heading: "Known limitations",
      list: [
        "The customer logo strip continues to scroll even when reduce-motion is set. It pauses on hover, and the partner row further down the page does stop. We are reconsidering this.",
        "The 3D model viewer relies on pointer interaction for free rotation; the model also rotates on its own so the content is not gated behind that gesture.",
        "The demonstration modules are prototypes and have had less accessibility testing than the main site.",
        "No independent audit has been carried out yet.",
      ],
    },
    {
      heading: "Tell us where it fails",
      body: [
        "If any part of this site is difficult or impossible for you to use, we want to hear about it, and we will treat it as a defect. Write to contact@ptta.art and describe what you were trying to do, and which assistive technology or browser you were using if you know it.",
        "We aim to respond within five working days.",
      ],
    },
  ],
};

const accessibilityDe: LegalDoc = {
  title: "Barrierefreiheit",
  updated: "Stand: September 2026",
  sections: [
    {
      body: [
        "Unsere Arbeit besteht darin, Museumssammlungen mit den Händen lesbar zu machen. Eine Website, die von den Menschen, für die wir bauen, nicht genutzt werden kann, würde dieser Arbeit widersprechen. Barrierefreiheit ist hier deshalb Teil des Produkts und keine Formsache.",
      ],
    },
    {
      heading: "Unser Anspruch",
      body: [
        "Wir orientieren uns an den Web Content Accessibility Guidelines (WCAG) 2.1, Konformitätsstufe AA. Eine unabhängige Prüfung wurde bislang nicht beauftragt. Diese Erklärung beschreibt daher unseren Anspruch und die derzeitige Praxis, nicht eine bestätigte Konformität.",
      ],
    },
    {
      heading: "Umgesetzt ist",
      list: [
        "Alle Bilder haben beschreibende Alternativtexte, die den Inhalt der Aufnahme wiedergeben.",
        "Die Website ist per Tastatur bedienbar; interaktive Elemente zeigen einen sichtbaren Fokusrahmen.",
        "Videos starten nie automatisch mit Ton; der Film mit Besucherstimmen ist untertitelt.",
        "Bewegung berücksichtigt die Systemeinstellung „Bewegung reduzieren“, mit einer unten genannten Ausnahme.",
        "Farbe ist nie das einzige Mittel, um eine Information zu vermitteln.",
        "Es gibt ein helles und ein dunkles Farbschema; die Textkontraste werden in beiden geprüft.",
      ],
    },
    {
      heading: "Bekannte Einschränkungen",
      list: [
        "Das Logoband der Kundinnen und Kunden läuft auch bei aktivierter Einstellung „Bewegung reduzieren“ weiter. Es hält beim Überfahren an; das Partnerband weiter unten stoppt vollständig. Wir prüfen das erneut.",
        "Die freie Drehung des 3D-Modells setzt eine Zeigergeste voraus. Das Modell dreht sich zusätzlich von selbst, sodass der Inhalt nicht von dieser Geste abhängt.",
        "Die Demonstrationsmodule sind Prototypen und wurden weniger intensiv auf Barrierefreiheit geprüft als die Hauptseite.",
        "Eine unabhängige Prüfung steht noch aus.",
      ],
    },
    {
      heading: "Sagen Sie uns, wo es hakt",
      body: [
        "Wenn ein Teil dieser Website für Sie schwer oder gar nicht nutzbar ist, möchten wir davon erfahren und behandeln das als Fehler. Schreiben Sie an contact@ptta.art und beschreiben Sie, was Sie tun wollten und welche Hilfstechnologie oder welchen Browser Sie verwenden.",
        "Wir antworten in der Regel innerhalb von fünf Werktagen.",
      ],
    },
  ],
};

export const legalCopy: Record<"en" | "de", Record<LegalDocId, LegalDoc>> = {
  en: {
    impressum: impressumEn,
    datenschutz: datenschutzEn,
    accessibility: accessibilityEn,
  },
  de: {
    impressum: impressumDe,
    datenschutz: datenschutzDe,
    accessibility: accessibilityDe,
  },
};
