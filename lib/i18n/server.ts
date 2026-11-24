import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, DIR, LOCALE_COOKIE, fromAcceptLanguage, isLocale, type Locale } from "./config";
import { dictionaries } from "./dictionaries";

/** Cookie first (the visitor's explicit choice), then the browser's language, then English. */
export async function getLocale(): Promise<Locale> {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;
  return fromAcceptLanguage((await headers()).get("accept-language")) ?? DEFAULT_LOCALE;
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, dir: DIR[locale], dict: dictionaries[locale] };
}
