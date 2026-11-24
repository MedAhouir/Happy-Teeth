"use client";
import { createContext, useContext, useMemo } from "react";
import { DIR, INTL, interpolate, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/en";
import { NAME_TO_ID, TOOTHMAP } from "@/constants";

type Vars = Record<string, string | number>;
type Value = {
  locale: Locale;
  dir: "ltr" | "rtl";
  intl: string;
  dict: Dict;
  /** Look up a string by dotted path, e.g. t("booking.submit"). */
  t: (path: string, vars?: Vars) => string;
  /** Translate a server/validation message that arrives in English. Unknown text passes through. */
  msg: (english: string) => string;
  /** Translated name for a tooth, from its stored canonical name (or chart id). */
  tooth: (nameOrId: string) => string;
};

const Ctx = createContext<Value | null>(null);

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dict; children: React.ReactNode }) {
  const value = useMemo<Value>(() => {
    const t: Value["t"] = (path, vars) => {
      let cur: unknown = dict;
      for (const key of path.split(".")) cur = (cur as Record<string, unknown> | undefined)?.[key];
      return typeof cur === "string" ? interpolate(cur, vars) : path;
    };
    const tooth: Value["tooth"] = (nameOrId) => {
      const id = TOOTHMAP[nameOrId as keyof typeof TOOTHMAP] ? nameOrId : NAME_TO_ID[nameOrId];
      if (!id) return nameOrId;
      const q = dict.tooth.quadrant[id[0] as keyof Dict["tooth"]["quadrant"]];
      const type = dict.tooth.type[id[1] as keyof Dict["tooth"]["type"]];
      return interpolate(dict.tooth.format, { q, t: type });
    };
    return { locale, dir: DIR[locale], intl: INTL[locale], dict, t, tooth, msg: (e) => dict.api[e] ?? e };
  }, [locale, dict]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside <I18nProvider>");
  return v;
}
