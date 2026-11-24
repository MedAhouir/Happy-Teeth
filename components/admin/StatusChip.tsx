"use client";
import type { BookingStatus } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/I18nProvider";

const STYLE: Record<BookingStatus, { chip: string; dot: string }> = {
  Pending: { chip: "bg-amber-soft text-amber-ink", dot: "bg-[#E0A100]" },
  Confirmed: { chip: "bg-enamel text-brand-dark", dot: "bg-brand" },
  Cancelled: { chip: "bg-coral-soft text-coral", dot: "bg-coral" },
};

/** Colour plus a label and dot, so status never depends on colour alone. */
export default function StatusChip({ status, className }: { status: BookingStatus; className?: string }) {
  const { dict } = useI18n();
  const s = STYLE[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold transition-colors duration-200", s.chip, className)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden />
      {dict.admin.status[status]}
    </span>
  );
}
