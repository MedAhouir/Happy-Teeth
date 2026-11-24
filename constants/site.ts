/**
 * Everything a clinic owner is likely to change lives here (contact details, nav, icons).
 * All visible wording (services, FAQ, hours labels, headlines) lives in lib/i18n/{en,fr,ar}.ts.
 */
export const SITE = {
  name: "Happy Teeth",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // ⚠ Placeholder contact details: replace before going live.
  phone: "+212 500 000 000",
  email: "hello@happyteeth.example",
  address: "12 Avenue des Fleurs, Casablanca, Morocco",
  mapsQuery: "12 Avenue des Fleurs, Casablanca",
} as const;

export const NAV_LINKS = [
  { href: "#about", id: "about" },
  { href: "#services", id: "services" },
  { href: "#book", id: "book" },
  { href: "#faq", id: "faq" },
  { href: "#visit", id: "visit" },
] as const;

export type IconKey =
  | "stethoscope" | "shield" | "sparkles" | "wrench" | "smile" | "baby"
  | "heart" | "activity" | "scissors" | "crown" | "syringe";

/** Same order as `services.items` in the dictionaries. */
export const SERVICE_ICONS: IconKey[] = [
  "stethoscope", "shield", "sparkles", "wrench", "smile", "baby", "heart", "activity", "scissors", "crown", "syringe",
];
