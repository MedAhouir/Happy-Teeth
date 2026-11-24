"use client";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { useI18n } from "./I18nProvider";

const OPTIONS: { locale: Locale; label: string; name: string }[] = [
  { locale: "en", label: "EN", name: "English" },
  { locale: "fr", label: "FR", name: "Français" },
  { locale: "ar", label: "ع", name: "العربية" },
];

/** Three-way language toggle. Remembers the choice in a cookie and re-renders the page in place. */
export default function LanguageSwitcher({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();

  const choose = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <div role="group" aria-label={t("a11y.language")} dir="ltr" className={cn("inline-flex rounded-full p-1", tone === "light" ? "bg-enamel" : "bg-white/10", className)}>
      {OPTIONS.map((o) => {
        const active = o.locale === locale;
        return (
          <button
            key={o.locale}
            type="button"
            lang={o.locale}
            title={o.name}
            aria-label={o.name}
            aria-pressed={active}
            onClick={() => choose(o.locale)}
            className={cn(
              "h-8 min-w-9 rounded-full px-2.5 text-sm font-bold transition-colors duration-150",
              active
                ? tone === "light" ? "bg-spruce text-white" : "bg-brand-light text-spruce"
                : tone === "light" ? "text-spruce/70 hover:text-spruce" : "text-white/70 hover:text-white"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
