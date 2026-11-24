"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { BookingRecord } from "@/lib/types";
import type { BookingStatus } from "@/lib/validation";
import { useToast } from "./Toaster";
import { useI18n } from "@/components/I18nProvider";

type Ctx = {
  bookings: BookingRecord[] | null;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
  setStatus: (id: string, status: BookingStatus) => Promise<void>;
  remove: (id: string) => Promise<void>;
  busy: Set<string>;
};
const BookingsCtx = createContext<Ctx | null>(null);
export const useBookings = () => {
  const c = useContext(BookingsCtx);
  if (!c) throw new Error("useBookings must be used inside <BookingsProvider>");
  return c;
};

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { dict } = useI18n();
  const tt = dict.admin.toast;
  const [bookings, setBookings] = useState<BookingRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/bookings", { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/admin";
        return;
      }
      if (!res.ok) throw new Error();
      setBookings(await res.json());
      setError(null);
    } catch {
      setError(dict.admin.loadFailed);
    } finally {
      setRefreshing(false);
    }
  }, [dict.admin.loadFailed]);

  useEffect(() => {
    refresh();
    const onFocus = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", onFocus);
    return () => document.removeEventListener("visibilitychange", onFocus);
  }, [refresh]);

  const mark = (id: string, on: boolean) =>
    setBusy((s) => {
      const n = new Set(s);
      if (on) n.add(id);
      else n.delete(id);
      return n;
    });

  const setStatus = useCallback(
    async (id: string, status: BookingStatus) => {
      const prev = bookings;
      setBookings((list) => list?.map((b) => (b._id === id ? { ...b, status } : b)) ?? list);
      mark(id, true);
      try {
        const res = await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
        if (res.status === 401) return void (window.location.href = "/admin");
        if (!res.ok) throw new Error();
        toast({ Confirmed: tt.confirmed, Cancelled: tt.declined, Pending: tt.reopened }[status]);
      } catch {
        setBookings(prev);
        toast(tt.updateFailed, "error");
      } finally {
        mark(id, false);
      }
    },
    [bookings, toast, tt]
  );

  const remove = useCallback(
    async (id: string) => {
      const prev = bookings;
      setBookings((list) => list?.filter((b) => b._id !== id) ?? list);
      mark(id, true);
      try {
        const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        toast(tt.deleted);
      } catch {
        setBookings(prev);
        toast(tt.deleteFailed, "error");
      } finally {
        mark(id, false);
      }
    },
    [bookings, toast, tt]
  );

  const value = useMemo(() => ({ bookings, error, refreshing, refresh, setStatus, remove, busy }), [bookings, error, refreshing, refresh, setStatus, remove, busy]);
  return <BookingsCtx.Provider value={value}>{children}</BookingsCtx.Provider>;
}
