"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ExternalLink, LayoutDashboard, LogOut, Menu, Users, X } from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion";
import { ToastProvider } from "./Toaster";
import { useI18n } from "@/components/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { BookingsProvider, useBookings } from "./bookings-context";

const NAV = [
  { href: "/admin/dashboard", key: "overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/dashboard/appointments", key: "appointments", icon: CalendarDays, exact: false },
  { href: "/admin/dashboard/team", key: "team", icon: Users, exact: false },
] as const;

function SidebarContent({ email, prefix, onNavigate }: { email: string; prefix: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { bookings } = useBookings();
  const { dict, t } = useI18n();
  const n = dict.admin.nav;
  const pending = bookings?.filter((b) => b.status === "Pending").length ?? 0;
  const [leaving, setLeaving] = useState(false);

  const signOut = async () => {
    setLeaving(true);
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin");
    router.refresh();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="px-3 pb-6 pt-1"><Logo light /></div>

      <nav aria-label={n.label} className="flex flex-col gap-1">
        {NAV.map(({ href, key, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn("relative flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold transition-colors duration-150", active ? "text-spruce" : "text-white/70 hover:bg-white/[0.07] hover:text-white")}
            >
              {active && <motion.span layoutId={`${prefix}-nav`} transition={springSnappy} className="absolute inset-0 rounded-xl bg-brand-light" />}
              <Icon className="relative size-[18px]" aria-hidden />
              <span className="relative">{n[key]}</span>
              {key === "appointments" && pending > 0 && (
                <span className={cn("relative ml-auto rounded-full px-2 py-0.5 text-xs font-bold tabular-nums", active ? "bg-spruce text-brand-light" : "bg-[#E0A100] text-spruce")} aria-label={t("admin.nav.pending", { n: pending })}>
                  {pending}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-4">
        <a href="/" target="_blank" rel="noreferrer" className="flex h-10 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white">
          <ExternalLink className="size-[18px]" aria-hidden /> {n.viewSite}
        </a>
        <button type="button" onClick={signOut} disabled={leaving} className="flex h-10 items-center gap-3 rounded-xl px-3 text-start text-[15px] font-semibold text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white disabled:opacity-60">
          <LogOut className="size-[18px]" aria-hidden /> {leaving ? n.signingOut : n.signOut}
        </button>
        <LanguageSwitcher tone="dark" className="mx-3 mb-1 mt-2 self-start" />
        <p className="truncate px-3 pt-1 text-sm text-white/45" dir="ltr" title={email} style={{ textAlign: "start" }}>{email}</p>
      </div>
    </div>
  );
}

function Shell({ email, children }: { email: string; children: React.ReactNode }) {
  const { dict, dir } = useI18n();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-svh bg-porcelain lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-svh bg-spruce p-4 lg:block">
        <SidebarContent email={email} prefix="d" />
      </aside>

      <div className="flex items-center justify-between bg-spruce px-4 py-3 lg:hidden">
        <Logo light />
        <button type="button" onClick={() => setOpen(true)} aria-label={dict.nav.openMenu} className="grid size-11 place-items-center rounded-xl text-white hover:bg-white/10"><Menu className="size-6" /></button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div key="s" className="fixed inset-0 z-40 bg-spruce/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={() => setOpen(false)} />
            <motion.aside key="d" role="dialog" aria-modal="true" aria-label={dict.nav.menu} className="fixed inset-y-0 start-0 z-50 w-[280px] bg-spruce p-4 lg:hidden" initial={{ x: dir === "rtl" ? "100%" : "-100%" }} animate={{ x: 0 }} exit={{ x: dir === "rtl" ? "100%" : "-100%" }} transition={{ type: "spring", duration: 0.35, bounce: 0 }}>
              <button type="button" onClick={() => setOpen(false)} aria-label={dict.nav.closeMenu} className="absolute end-3 top-3 grid size-10 place-items-center rounded-xl text-white hover:bg-white/10"><X className="size-5" /></button>
              <SidebarContent email={email} prefix="m" onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main id="main" className="min-w-0 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-[1100px]">{children}</div>
      </main>
    </div>
  );
}

export default function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  return (
    <ToastProvider>
      <BookingsProvider>
        <Shell email={email}>{children}</Shell>
      </BookingsProvider>
    </ToastProvider>
  );
}
