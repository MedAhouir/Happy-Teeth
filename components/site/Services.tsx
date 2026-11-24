"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { Activity, Baby, Crown, HeartPulse, Scissors, ShieldCheck, Smile, Sparkles, Stethoscope, Syringe, Wrench, type LucideIcon } from "lucide-react";
import { SERVICE_ICONS, type IconKey } from "@/constants";
import { useI18n } from "@/components/I18nProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { springSnappy, springSoft } from "@/lib/motion";
import Reveal from "./Reveal";

const ICONS: Record<IconKey, LucideIcon> = {
  stethoscope: Stethoscope,
  shield: ShieldCheck,
  sparkles: Sparkles,
  wrench: Wrench,
  smile: Smile,
  baby: Baby,
  heart: HeartPulse,
  activity: Activity,
  scissors: Scissors,
  crown: Crown,
  syringe: Syringe,
};

export default function Services() {
  const { dict, dir } = useI18n();
  const SERVICES = dict.services.items;
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = SERVICES[index];
  const Icon = ICONS[SERVICE_ICONS[index]];

  const move = (next: number) => {
    const i = (next + SERVICES.length) % SERVICES.length;
    setIndex(i);
    tabs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const fwd = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    const next: Record<string, number> = {
      ArrowDown: index + 1,
      [fwd]: index + 1,
      ArrowUp: index - 1,
      [back]: index - 1,
      Home: 0,
      End: SERVICES.length - 1,
    };
    if (e.key in next) {
      e.preventDefault();
      move(next[e.key]);
    }
  };

  return (
    <section id="services" className="bg-spruce py-20 text-white lg:py-28">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-6 text-[#d6bc8e]"><span className="eyebrow-line" />{dict.nav.services}</p>
          <h2 className="section-title">{dict.services.title}</h2>
          <p className="mt-5 text-lg text-white/70">{dict.services.intro}</p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-14">
          <div
            role="tablist"
            aria-label={dict.services.tablist}
                        onKeyDown={onKey}
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {SERVICES.map((s, i) => {
              const active = i === index;
              return (
                <button
                  key={s.category}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`svc-tab-${i}`}
                  aria-selected={active}
                  aria-controls="svc-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "relative shrink-0 rounded-full px-4 py-2.5 text-start text-[15px] font-semibold transition-colors duration-150 lg:rounded-xl lg:px-4 lg:py-3",
                    active ? "text-spruce" : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {active && (
                    <motion.span layoutId="svc-pill" transition={springSnappy} className="absolute inset-0 -z-0 rounded-full bg-brand-light lg:rounded-xl" />
                  )}
                  <span className="relative">{s.category}</span>
                </button>
              );
            })}
          </div>

          <div id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${index}`} className="min-h-[360px] rounded-[2rem] bg-white/[0.06] p-7 ring-1 ring-white/10 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: springSoft }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-brand-light text-spruce">
                  <Icon className="size-7" aria-hidden />
                </span>
                <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{current.category}</h3>
                <p className="mt-3 max-w-xl text-lg text-white/70">{current.summary}</p>

                <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {current.services.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[17px]">
                      <Check className="mt-1 size-5 shrink-0 text-brand-light" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button asChild variant="brand" size="lg" className="mt-9">
                  <a href="#book">
                    {dict.cta.bookTreatment}
                  </a>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
