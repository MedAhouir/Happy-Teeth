import type { Locale } from "./config";
import { en, type Dict } from "./en";
import { fr } from "./fr";
import { ar } from "./ar";

export type { Dict };
export const dictionaries: Record<Locale, Dict> = { en, fr, ar };
