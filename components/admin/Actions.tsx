"use client";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookingRecord } from "@/lib/types";
import { useBookings } from "./bookings-context";
import { useI18n } from "@/components/I18nProvider";

/** The one set of status actions used everywhere, so the verbs never drift. */
export default function Actions({ booking }: { booking: BookingRecord }) {
  const { setStatus, busy } = useBookings();
  const { dict } = useI18n();
  const a = dict.admin.actions;
  const disabled = busy.has(booking._id);
  const { status } = booking;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== "Confirmed" && status === "Pending" && (
        <Button size="sm" variant="brand" disabled={disabled} onClick={() => setStatus(booking._id, "Confirmed")}>
          <Check aria-hidden /> {a.confirm}
        </Button>
      )}
      {status !== "Cancelled" && (
        <Button size="sm" variant="danger" disabled={disabled} onClick={() => setStatus(booking._id, "Cancelled")}>
          <X aria-hidden /> {status === "Pending" ? a.decline : a.cancel}
        </Button>
      )}
      {status === "Cancelled" && (
        <Button size="sm" variant="secondary" disabled={disabled} onClick={() => setStatus(booking._id, "Pending")}>
          <RotateCcw aria-hidden /> {a.reopen}
        </Button>
      )}
    </div>
  );
}
