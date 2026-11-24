"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";
import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

export default function FAQ() {
  const { dict } = useI18n();
  const ITEMS = dict.faq.items;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="pb-20 lg:pb-28">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow mb-5"><span className="eyebrow-line" />{dict.nav.faq}</p>
          <h2 className="section-title max-w-[14ch]">{dict.faq.title}</h2>
          <p className="mt-5 max-w-sm text-lg text-spruce/70">{dict.faq.help}</p>
        </Reveal>

        <Reveal className="divide-y divide-spruce/10 border-y border-spruce/10" delay={0.06}>
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-start text-xl font-semibold tracking-tight text-spruce transition-colors hover:text-brand-dark"
                  >
                    {item.q}
                    <ChevronDown className={cn("size-5 shrink-0 transition-transform duration-200 ease-out", isOpen && "rotate-180")} aria-hidden />
                  </button>
                </h3>
                <div id={`faq-${i}`} role="region" className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")} inert={!isOpen}>
                  <div className="overflow-hidden">
                    <p className={cn("max-w-[60ch] pb-6 text-[17px] leading-relaxed text-spruce/75 transition-opacity duration-200", isOpen ? "opacity-100" : "opacity-0")}>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
