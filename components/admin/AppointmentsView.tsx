"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Inbox, RefreshCw, Search, Trash2, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatBookingDate, parseBookingDate, relativeTime } from "@/lib/dates";
import type { BookingRecord } from "@/lib/types";
import { STATUSES, type BookingStatus } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion";
import Actions from "./Actions";
import StatusChip from "./StatusChip";
import { useBookings } from "./bookings-context";
import { ErrorState } from "./Overview";
import { useI18n } from "@/components/I18nProvider";

type Filter = "All" | BookingStatus;
type Sort = "newest" | "date" | "name";

const csvCell = (v: string) => {
  // Neutralise spreadsheet formulas (CSV injection) before quoting.
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
};

function exportCsv(rows: BookingRecord[]) {
  const head = ["Name", "Email", "Phone", "Appointment date", "Tooth", "Status", "Note", "Requested at"];
  const lines = rows.map((b) =>
    [b.name, b.email, b.phone, parseBookingDate(b.date)?.toISOString().slice(0, 10) ?? b.date, b.tooth, b.status, b.note ?? "", new Date(b.createdAt).toISOString()].map(csvCell).join(",")
  );
  const blob = new Blob(["\uFEFF" + [head.map(csvCell).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `appointments-${new Date().toISOString().slice(0, 10)}.csv` });
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function AppointmentsView() {
  const { bookings, error, refresh, refreshing, remove } = useBookings();
  const { dict, t, intl, tooth } = useI18n();
  const a = dict.admin.appts;
  const TAB_LABEL = a.tabs;
  const when = (iso: string) => relativeTime(iso, intl, dict.admin.time.now);
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<Sort>("newest");
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState<BookingRecord | null>(null);
  const search = useRef<HTMLInputElement>(null);

  // "/" jumps to search, like most dashboards. Keyboard actions never animate.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) {
        e.preventDefault();
        search.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { All: bookings?.length ?? 0, Pending: 0, Confirmed: 0, Cancelled: 0 };
    bookings?.forEach((b) => c[b.status]++);
    return c;
  }, [bookings]);

  const rows = useMemo(() => {
    if (!bookings) return [];
    const q = query.trim().toLowerCase();
    const list = bookings.filter((b) => (filter === "All" || b.status === filter) && (!q || [b.name, b.email, b.phone, b.tooth, tooth(b.tooth)].some((f) => f.toLowerCase().includes(q))));
    const ts = (b: BookingRecord) => parseBookingDate(b.date)?.getTime() ?? 0;
    return [...list].sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "date" ? ts(a) - ts(b) : +new Date(b.createdAt) - +new Date(a.createdAt)));
  }, [bookings, filter, sort, query, tooth]);

  if (error && !bookings) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-spruce sm:text-4xl">{a.title}</h1>
          <p className="mt-2 text-spruce/70">{a.intro}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refresh} disabled={refreshing} aria-label={a.refresh}><RefreshCw className={cn(refreshing && "animate-spin")} aria-hidden /> {a.refresh}</Button>
          <Button variant="outline" onClick={() => exportCsv(rows)} disabled={!rows.length}><Download aria-hidden /> {a.export}</Button>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label={a.filterLabel} className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(["All", ...STATUSES] as Filter[]).map((f) => {
            const active = filter === f;
            return (
              <button key={f} role="tab" aria-selected={active} onClick={() => setFilter(f)} className={cn("relative shrink-0 rounded-full px-4 py-2 text-[15px] font-semibold transition-colors duration-150", active ? "text-white" : "text-spruce/70 hover:bg-enamel hover:text-spruce")}>
                {active && <motion.span layoutId="filter-pill" transition={springSnappy} className="absolute inset-0 rounded-full bg-spruce" />}
                <span className="relative">{TAB_LABEL[f]} <span className={cn("tabular-nums", active ? "text-white/60" : "text-spruce/45")}>{counts[f]}</span></span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 lg:w-72 lg:flex-none">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 size-[18px] -translate-y-1/2 text-spruce/45" aria-hidden />
            <input ref={search} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`${a.searchPh}  /`} aria-label={a.searchLabel} className="input h-11 ps-10 pe-9" />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label={a.clearSearch} className="absolute end-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-spruce/50 hover:bg-enamel"><X className="size-4" /></button>
            )}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label={a.sortLabel} className="input h-11 w-auto pe-3">
            <option value="newest">{a.sort.newest}</option>
            <option value="date">{a.sort.date}</option>
            <option value="name">{a.sort.name}</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        {!bookings ? (
          <div className="space-y-3" aria-busy="true" aria-label={dict.admin.loading}>{[0, 1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-[68px] !rounded-2xl" />)}</div>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-soft">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-enamel text-brand-dark"><Inbox className="size-7" aria-hidden /></span>
            <h2 className="mt-5 font-display text-2xl font-semibold text-spruce">{bookings.length === 0 ? a.emptyTitle : a.noMatch}</h2>
            <p className="mx-auto mt-2 max-w-md text-spruce/70">
              {bookings.length === 0 ? a.emptyBody : query ? t("admin.appts.noResults", { q: query }) : t("admin.appts.noStatus", { status: TAB_LABEL[filter] })}
            </p>
            {bookings.length > 0 && <Button variant="secondary" className="mt-6" onClick={() => { setQuery(""); setFilter("All"); }}>{a.clearFilters}</Button>}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-3xl bg-white shadow-soft md:block">
              <table className="w-full text-start text-[15px]">
                <thead className="border-b border-spruce/10 bg-muted/60 text-sm text-spruce/65">
                  <tr>
                    {[a.cols.patient, a.cols.appointment, a.cols.tooth, a.cols.status, ""].map((h, i) => <th key={i} scope="col" className="px-5 py-3.5 font-semibold">{h}{i === 4 && <span className="sr-only">{a.cols.actions}</span>}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-spruce/[0.07]">
                  {rows.map((b) => (
                    <tr key={b._id} className="align-top transition-colors hover:bg-porcelain/70">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-spruce">{b.name}</p>
                        <p className="text-sm text-spruce/65"><a href={`mailto:${b.email}`} dir="ltr" className="hover:underline">{b.email}</a></p>
                        <p className="text-sm text-spruce/65"><a href={`tel:${b.phone}`} dir="ltr" className="hover:underline">{b.phone}</a></p>
                        {b.note && <p className="mt-1.5 max-w-xs rounded-lg bg-muted px-2.5 py-1.5 text-sm text-spruce/75">{b.note}</p>}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4"><p className="font-semibold text-spruce">{formatBookingDate(b.date, intl)}</p><p className="text-sm text-spruce/55">{t("admin.appts.requested", { when: when(b.createdAt) })}</p></td>
                      <td className="px-5 py-4 text-spruce/80">{tooth(b.tooth)}</td>
                      <td className="px-5 py-4"><StatusChip status={b.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Actions booking={b} />
                          <Button size="icon" variant="ghost" className="size-9 text-spruce/50 hover:text-coral" aria-label={t("admin.actions.deleteFor", { name: b.name })} onClick={() => setToDelete(b)}><Trash2 aria-hidden /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="space-y-3 md:hidden">
              {rows.map((b) => (
                <li key={b._id} className="rounded-2xl bg-white p-4 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><p className="truncate font-semibold text-spruce">{b.name}</p><p className="text-sm text-spruce/65">{formatBookingDate(b.date, intl)}</p></div>
                    <StatusChip status={b.status} />
                  </div>
                  <p className="mt-2 text-sm text-spruce/75">{tooth(b.tooth)}</p>
                  <p className="mt-1 text-sm text-spruce/65"><a href={`tel:${b.phone}`} dir="ltr" className="font-semibold text-brand-dark">{b.phone}</a> · <span dir="ltr">{b.email}</span></p>
                  {b.note && <p className="mt-2 rounded-lg bg-muted px-2.5 py-1.5 text-sm text-spruce/75">{b.note}</p>}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Actions booking={b} />
                    <Button size="icon" variant="ghost" className="size-9 text-spruce/50 hover:text-coral" aria-label={t("admin.actions.deleteFor", { name: b.name })} onClick={() => setToDelete(b)}><Trash2 aria-hidden /></Button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-spruce/55" aria-live="polite">{t("admin.appts.showing", { n: rows.length, total: bookings.length })}</p>
          </>
        )}
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border-0 p-7">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl text-spruce">{a.delTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-spruce/70">
              {toDelete ? t("admin.appts.delBody", { name: toDelete.name, date: formatBookingDate(toDelete.date, intl) }) : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11 rounded-xl border-input px-5 font-semibold">{a.keep}</AlertDialogCancel>
            <AlertDialogAction className="h-11 rounded-xl bg-coral px-5 font-semibold text-white hover:bg-[#b93a31]" onClick={() => toDelete && remove(toDelete._id)}>{a.delConfirm}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
