"use client";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, CircleX } from "lucide-react";
import { springSnappy } from "@/lib/motion";

type Toast = { id: number; message: string; kind: "success" | "error" };
const Ctx = createContext<{ toast: (message: string, kind?: Toast["kind"]) => void }>({ toast: () => {} });
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const seq = useRef(0);

  const toast = useCallback((message: string, kind: Toast["kind"] = "success") => {
    const id = ++seq.current;
    setItems((t) => [...t.slice(-2), { id, message, kind }]);
    setTimeout(() => setItems((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);
  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-4 bottom-4 z-[90] flex flex-col items-center gap-2 sm:inset-x-auto sm:end-6 sm:items-end">
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout="position"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, transition: { duration: 0.12 } }}
              transition={springSnappy}
              className="pointer-events-auto flex items-center gap-2.5 rounded-xl bg-spruce px-4 py-3 text-[15px] font-semibold text-white shadow-lift"
            >
              {t.kind === "success" ? <CircleCheck className="size-5 text-brand-light" aria-hidden /> : <CircleX className="size-5 text-[#ff9b92]" aria-hidden />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
