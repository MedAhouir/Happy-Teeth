"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Clock, Phone, MousePointerClick, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/constants";
import { useI18n } from "@/components/I18nProvider";
import { easeOut } from "@/lib/motion";

export default function Hero() {
  const { dict } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 30]);
  const entrance = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 24 }, animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : delay, ease: easeOut },
  });
  return (
    <section ref={ref} className="luxury-hero relative overflow-hidden pt-[88px]">
      <div className="container-x grid items-center gap-12 pb-14 pt-12 lg:min-h-[790px] lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:pb-16 lg:pt-16">
        <div className="relative z-10">
          <motion.p {...entrance(0.05)} className="eyebrow mb-7"><span className="eyebrow-line" />{dict.meta.tagline}</motion.p>
          <h1 className="luxury-headline">
            {dict.hero.headline.map((word, i) => (
              <span key={i} className="me-[0.22em] inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
                <motion.span className={i >= dict.hero.headline.length - 2 ? "inline-block italic text-brand-dark" : "inline-block"}
                  initial={{ y: reduce ? 0 : "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 0.12 + i * 0.075, ease: easeOut }}>{word}</motion.span><span className="sr-only"> </span>
              </span>
            ))}
          </h1>
          <motion.p {...entrance(0.5)} className="mt-7 max-w-[30rem] text-lg leading-relaxed text-spruce/70">{dict.hero.lead}</motion.p>
          <motion.div {...entrance(0.65)} className="mt-9 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="luxury-button"><a href="#book">{dict.cta.bookVisit}</a></Button>
            <a href="#services" className="luxury-text-link py-3 text-[15px] font-semibold">{dict.cta.seeServices}</a>
          </motion.div>
          <motion.dl {...entrance(0.8)} className="mt-11 flex flex-wrap gap-x-8 gap-y-5 border-t border-spruce/15 pt-6 text-sm">
            <div className="flex items-center gap-3"><Clock className="size-[18px] text-brand-dark" aria-hidden /><div><dt className="mb-1 text-spruce/55">{dict.hero.hoursLabel}</dt><dd className="font-semibold text-spruce">{dict.hours[0].short}, <span dir="ltr">{dict.hours[0].time}</span></dd></div></div>
            <div className="flex items-center gap-3"><Phone className="size-[18px] text-brand-dark" aria-hidden /><div><dt className="mb-1 text-spruce/55">{dict.hero.phoneLabel}</dt><dd><a className="font-semibold text-spruce underline-offset-4 hover:underline" href={`tel:${SITE.phone.replace(/\s/g, "")}`} dir="ltr">{SITE.phone}</a></dd></div></div>
          </motion.dl>
        </div>
        <motion.div {...entrance(0.2)} className="hero-art relative mx-auto w-full max-w-[530px]">
          <div className="hero-arch relative aspect-[0.91] overflow-hidden">
            <motion.div style={{ y: drift }} className="absolute -inset-8">
              <Image src="/images/smile-editorial.webp" alt={dict.hero.imgAlt} fill priority sizes="(min-width: 1024px) 600px, 100vw" className="hero-portrait object-cover" />
            </motion.div>
          </div>
          <a href="#book" className="hero-booking-card absolute -bottom-5 start-3 end-3 flex items-center gap-4 border border-[#d9ceb9] bg-[#fffdf8]/95 p-5 shadow-lift backdrop-blur sm:start-8 sm:end-8">
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-[#c5ac80] text-spruce"><MousePointerClick className="size-5" strokeWidth={1.4} aria-hidden /></span>
            <span className="text-start leading-tight"><span className="block text-base font-semibold text-spruce">{dict.hero.chipTitle}</span><span className="mt-1.5 block text-sm text-spruce/60">{dict.hero.chipSub}</span></span><span className="ms-auto h-8 w-px bg-[#c5ac80]" aria-hidden />
          </a>
        </motion.div>
      </div>
      <div className="container-x mt-7 flex items-center justify-between gap-5 border-t border-spruce/15 py-6">
        <p className="text-sm text-spruce/60">{dict.about.values[0].title}<span className="mx-3 text-[#a27c43]">✦</span>{dict.about.values[1].title}</p>
        <a href="#about" aria-label={dict.nav.about} className="grid size-11 shrink-0 place-items-center rounded-full border border-spruce/20 text-spruce transition-colors hover:bg-spruce hover:text-white"><MoveDown className="size-4" aria-hidden /></a>
      </div>
    </section>
  );
}
