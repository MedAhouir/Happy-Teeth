"use client";
import Link from "next/link";
import { SITE } from "@/constants";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/I18nProvider";

export function ToothMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-6", className)} fill="currentColor">
      <path d="M7.2 2.6C4.7 2.6 3 4.6 3 7.2c0 1.7.6 2.8 1 4.3.5 1.8.7 4.2 1.3 6.5.3 1.5 1 3.7 2.4 3.7 1.5 0 1.6-2.5 2.1-4.4.3-1.2.8-1.9 2.2-1.9s1.9.7 2.2 1.9c.5 1.9.6 4.4 2.1 4.4 1.4 0 2.1-2.2 2.4-3.7.6-2.3.8-4.7 1.3-6.5.4-1.5 1-2.6 1-4.3 0-2.6-1.7-4.6-4.2-4.6-1.7 0-2.7.7-4.8.7S8.9 2.6 7.2 2.6Z" />
    </svg>
  );
}

export default function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  const { t } = useI18n();
  return (
    <Link
      href="/"
      aria-label={t("a11y.home", { name: SITE.name })}
      className={cn("inline-flex items-center gap-2 font-display text-[1.35rem] font-bold tracking-tight", light ? "text-white" : "text-spruce", className)}
    >
      <span className={cn("grid size-9 place-items-center rounded-xl", light ? "bg-brand-light text-spruce" : "bg-spruce text-brand-light")}>
        <ToothMark className="size-5" />
      </span>
      {SITE.name}
    </Link>
  );
}
