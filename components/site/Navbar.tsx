"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE } from "@/constants";
import { useI18n } from "@/components/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion";

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.6] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export default function Navbar() {
  const { t, dir } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const reduce = useReducedMotion();
  const active = useActiveSection(NAV_LINKS.map((l) => l.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-200",
        scrolled ? "bg-porcelain/85 shadow-[0_1px_0_rgba(12,46,42,.07)] backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <motion.div aria-hidden className="reading-progress" style={{ scaleX: reduce ? scrollYProgress : progress }} />
      <div className="container-x flex h-[88px] items-center justify-between">
        <Logo />

        <nav aria-label={t("nav.main")} className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              aria-current={active === link.id ? "true" : undefined}
              className="relative rounded-full px-4 py-2 text-[15px] font-semibold text-spruce/80 transition-colors hover:text-spruce aria-[current=true]:text-spruce"
            >
              {active === link.id && (
                <motion.span
                  layoutId="nav-pill"
                  transition={springSnappy}
                  className="absolute inset-0 -z-10 rounded-full bg-enamel"
                />
              )}
              {t(`nav.${link.id}`)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hidden items-center gap-2 text-[15px] font-semibold text-spruce/80 transition-colors hover:text-spruce xl:flex">
            <Phone className="size-4" aria-hidden /> <span dir="ltr">{SITE.phone}</span>
          </a>
          <Button asChild>
            <a href="#book">{t("cta.bookVisit")}</a>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("nav.openMenu")}
          aria-expanded={open}
          className="grid size-11 place-items-center rounded-xl text-spruce transition-colors hover:bg-enamel lg:hidden"
        >
          <Menu className="size-6" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 z-[60] bg-spruce/40 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label={t("nav.menu")}
              className="fixed inset-y-0 end-0 z-[70] flex w-[min(88vw,360px)] flex-col bg-porcelain p-6 shadow-2xl lg:hidden"
              initial={{ x: dir === "rtl" ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: dir === "rtl" ? "-100%" : "100%" }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button type="button" onClick={() => setOpen(false)} aria-label={t("nav.closeMenu")} className="grid size-11 place-items-center rounded-xl text-spruce hover:bg-enamel">
                  <X className="size-6" />
                </button>
              </div>
              <nav aria-label={t("nav.mobile")} className="mt-10 flex flex-col">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-spruce/10 py-4 font-display text-3xl font-semibold tracking-tight text-spruce"
                  >
                    {t(`nav.${link.id}`)}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <LanguageSwitcher className="self-start" />
                <Button asChild size="lg">
                  <a href="#book" onClick={() => setOpen(false)}>
                    {t("cta.bookVisit")}
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>
                    <Phone aria-hidden /> {t("nav.callClinic")}
                  </a>
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
