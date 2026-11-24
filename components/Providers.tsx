"use client";
import { MotionConfig } from "framer-motion";
import { I18nProvider } from "./I18nProvider";
import type { Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/en";

/** reducedMotion="user" turns transform/layout animations off for people who ask for less motion. */
export default function Providers({ locale, dict, children }: { locale: Locale; dict: Dict; children: React.ReactNode }) {
  return (
    <I18nProvider locale={locale} dict={dict}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </I18nProvider>
  );
}
