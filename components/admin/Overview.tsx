"use client";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CalendarClock, Hourglass, Inbox } from "lucide-react";
import { formatBookingDate, isoToday, parseBookingDate, relativeTime } from "@/lib/dates";
import type { BookingRecord } from "@/lib/types";
import { cn } from "@/lib/utils";
import Actions from "./Actions";
import { useBookings } from "./bookings-context";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/I18nProvider";

function Stat({ label, value, hint, icon: Icon, tone }: { label: string; value: number | string; hint: string; icon: typeof Inbox; tone: "amber" | "green" | "ink" | "plain" }) {
  const tones = { amber: "bg-amber-soft text-amber-ink", green: "bg-enamel text-brand-dark", ink: "bg-spruce text-brand-light", plain: "bg-muted text-spruce" };
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-semibold text-spruce/70">{label}</p>
        <span className={cn("grid size-9 place-items-center rounded-xl", tones[tone])}><Icon className="size-[18px]" aria-hidden /></span>
      </div>
      <p className="mt-3 font-display text-4xl font-semibold tabular-nums tracking-tight text-spruce">{value}</p>
      <p className="mt-1 text-sm text-spruce/60">{hint}</p>
    </div>
  );
}

function Row({ b, children }: { b: BookingRecord; children?: React.ReactNode }) {
  const { intl, tooth, t, dict } = useI18n();
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate font-semibold text-spruce">{b.name}</p>
        <p className="truncate text-sm text-spruce/65">{tooth(b.tooth)} · {formatBookingDate(b.date, intl)}</p>
        <p className="text-sm text-spruce/50">{t("admin.overview.requested", { when: relativeTime(b.createdAt, intl, dict.admin.time.now) })}</p>
      </div>
      {children}
    </li>
  );
}

export default function Overview() {
  const { bookings, error, refresh } = useBookings();
  const { dict, intl, tooth } = useI18n();
  const o = dict.admin.overview;

  if (error) return <ErrorState message={error} onRetry={refresh} />;
  if (!bookings) return <OverviewSkeleton />;

  const today = isoToday();
  const dateKey = (b: BookingRecord) => parseBookingDate(b.date)?.toISOString().slice(0, 10) ?? "";
  const pending = bookings.filter((b) => b.status === "Pending").sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  const confirmed = bookings.filter((b) => b.status === "Confirmed");
  const upcoming = confirmed.filter((b) => dateKey(b) >= today).sort((a, b) => dateKey(a).localeCompare(dateKey(b)));
  const total = bookings.length;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-spruce sm:text-4xl">{o.title}</h1>
      <p className="mt-2 text-spruce/70">{new Intl.DateTimeFormat(intl, { dateStyle: "full" }).format(new Date())}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label={o.needReply} value={pending.length} hint={o.hintPending} icon={Hourglass} tone="amber" />
        <Stat label={o.comingUp} value={upcoming.length} hint={o.hintUpcoming} icon={CalendarClock} tone="green" />
        <Stat label={o.confirmed} value={confirmed.length} hint={o.hintAll} icon={CalendarCheck} tone="ink" />
        <Stat label={o.requests} value={total} hint={o.hintAll} icon={Inbox} tone="plain" />
      </div>

      {total === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-soft">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-enamel text-brand-dark"><Inbox className="size-7" aria-hidden /></span>
          <h2 className="mt-5 font-display text-2xl font-semibold text-spruce">{o.emptyTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-spruce/70">{o.emptyBody}</p>
          <Button asChild className="mt-6"><a href="/#book" target="_blank" rel="noreferrer">{o.openForm}</a></Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-soft" aria-labelledby="ov-pending">
            <div className="flex items-center justify-between">
              <h2 id="ov-pending" className="font-display text-xl font-semibold text-spruce">{o.needsTitle}</h2>
              <Link href="/admin/dashboard/appointments" className="flex items-center gap-1 text-sm font-semibold text-brand-dark hover:underline">{o.viewAll} <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden /></Link>
            </div>
            {pending.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-enamel/60 p-5 text-spruce/75">{o.caughtUp}</p>
            ) : (
              <ul className="mt-2 divide-y divide-spruce/10">
                {pending.slice(0, 5).map((b) => (
                  <Row key={b._id} b={b}><Actions booking={b} /></Row>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-soft" aria-labelledby="ov-upcoming">
            <h2 id="ov-upcoming" className="font-display text-xl font-semibold text-spruce">{o.upcomingTitle}</h2>
            {upcoming.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-muted p-5 text-spruce/70">{o.noUpcoming}</p>
            ) : (
              <ul className="mt-2 divide-y divide-spruce/10">
                {upcoming.slice(0, 6).map((b) => (
                  <li key={b._id} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-spruce">{b.name}</p>
                      <p className="truncate text-sm text-spruce/65">{tooth(b.tooth)}</p>
                    </div>
                    <p className="shrink-0 rounded-lg bg-enamel px-3 py-1.5 text-sm font-semibold text-brand-dark">{formatBookingDate(b.date, intl, { weekday: "short", day: "numeric", month: "short", year: undefined })}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { dict } = useI18n();
  return (
    <div className="rounded-3xl bg-white p-10 text-center shadow-soft" role="alert">
      <h2 className="font-display text-2xl font-semibold text-spruce">{dict.admin.errorTitle}</h2>
      <p className="mx-auto mt-2 max-w-md text-spruce/70">{message}</p>
      <Button className="mt-6" onClick={onRetry}>{dict.admin.retry}</Button>
    </div>
  );
}

function OverviewSkeleton() {
  const { dict } = useI18n();
  return (
    <div aria-busy="true" aria-label={dict.admin.loading}>
      <div className="skeleton h-10 w-48" />
      <div className="skeleton mt-3 h-5 w-64" />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-[132px] !rounded-2xl" />)}</div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2"><div className="skeleton h-80 !rounded-3xl" /><div className="skeleton h-80 !rounded-3xl" /></div>
    </div>
  );
}
