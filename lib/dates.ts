/**
 * Booking dates are stored as ISO `YYYY-MM-DD`. Records created by the first
 * version of the site used `DD/MM/YYYY`; we read both so nothing breaks.
 */
export function parseBookingDate(value: string): Date | null {
  if (!value) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (iso) return new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
  const legacy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (legacy) return new Date(Date.UTC(+legacy[3], +legacy[2] - 1, +legacy[1]));
  return null;
}

export function formatBookingDate(value: string, intl = "en-GB", opts?: Intl.DateTimeFormatOptions) {
  const d = parseBookingDate(value);
  if (!d) return value;
  return new Intl.DateTimeFormat(intl, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
    ...opts,
  }).format(d);
}

export function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

/** "5 min ago" in the active language. `justNow` is translated by the caller. */
export function relativeTime(iso: string | Date | null | undefined, intl = "en-GB", justNow = "just now") {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const min = Math.round((Date.now() - then) / 60000);
  if (min < 1) return justNow;
  const rtf = new Intl.RelativeTimeFormat(intl, { numeric: "auto" });
  if (min < 60) return rtf.format(-min, "minute");
  const hr = Math.round(min / 60);
  if (hr < 24) return rtf.format(-hr, "hour");
  const day = Math.round(hr / 24);
  if (day < 30) return rtf.format(-day, "day");
  return new Intl.DateTimeFormat(intl, { day: "numeric", month: "short" }).format(new Date(then));
}
