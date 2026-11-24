"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import StatusMark from "./StatusMark";
import { useI18n } from "@/components/I18nProvider";

export type BookingOutcome = { kind: "success" | "error"; title: string; body: string } | null;

export default function BookingResult({ outcome, onClose }: { outcome: BookingOutcome; onClose: () => void }) {
  const { dict } = useI18n();
  return (
    <AlertDialog open={outcome !== null} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="max-w-md rounded-[1.75rem] border-0 p-8 text-center shadow-2xl">
        {outcome && (
          <>
            <div className="mx-auto">
              <StatusMark kind={outcome.kind} />
            </div>
            <AlertDialogHeader className="items-center text-center sm:text-center">
              <AlertDialogTitle className="font-display text-2xl font-semibold text-spruce">{outcome.title}</AlertDialogTitle>
              <AlertDialogDescription className="text-base text-spruce/70">{outcome.body}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogAction onClick={onClose} className="h-11 rounded-xl bg-spruce px-8 text-[15px] font-semibold text-white hover:bg-brand-dark">
                {outcome.kind === "success" ? dict.booking.done : dict.booking.retry}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
