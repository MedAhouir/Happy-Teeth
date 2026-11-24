"use client";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import TeethModel from "@/components/TeethModel";
import { Button } from "@/components/ui/button";
import { TOOTHMAP } from "@/constants";
import { useI18n } from "@/components/I18nProvider";
import { bookingSchema } from "@/lib/validation";
import { springSnappy } from "@/lib/motion";
import Reveal from "./Reveal";
import BookingResult, { type BookingOutcome } from "./BookingResult";

type Values = { name: string; email: string; phone: string; date: string; tooth: string; note: string; website: string };
type Errors = Partial<Record<keyof Values, string>>;
const EMPTY: Values = { name: "", email: "", phone: "", date: "", tooth: "", note: "", website: "" };

function validate(values: Values, msg: (e: string) => string): Errors {
  const parsed = bookingSchema.safeParse(values);
  if (parsed.success) return {};
  const out: Errors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof Values;
    if (!out[key]) out[key] = msg(issue.message);
  }
  return out;
}

export default function Booking() {
  const { dict, msg, tooth } = useI18n();
  const b = dict.booking;
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [outcome, setOutcome] = useState<BookingOutcome>(null);
  const [minDate, setMinDate] = useState<string>();

  useEffect(() => setMinDate(new Date().toLocaleDateString("en-CA")), []);

  const set = (key: keyof Values, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const blur = (key: keyof Values) => {
    const found = validate(values, msg)[key];
    setErrors((e) => ({ ...e, [key]: found }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values, msg);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Values)[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setValues(EMPTY);
        setOutcome({ kind: "success", title: b.okTitle, body: b.okBody });
      } else {
        if (data.fields) {
          const fe: Errors = {};
          for (const [k, v] of Object.entries(data.fields as Record<string, string[]>)) fe[k as keyof Values] = msg(v[0]);
          setErrors(fe);
        }
        setOutcome({ kind: "error", title: b.failTitle, body: data.error ? msg(data.error) : b.failBody });
      }
    } catch {
      setOutcome({ kind: "error", title: b.failTitle, body: b.network });
    } finally {
      setSending(false);
    }
  };

  const field = (key: keyof Values) => ({
    id: `${uid}-${key}`,
    name: key,
    value: values[key],
    "aria-invalid": errors[key] ? (true as const) : undefined,
    "aria-describedby": errors[key] ? `${uid}-${key}-err` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set(key, e.target.value),
    onBlur: () => blur(key),
  });
  const err = (key: keyof Values) =>
    errors[key] ? (
      <p id={`${uid}-${key}-err`} className="field-error" role="alert">
        {errors[key]}
      </p>
    ) : null;

  return (
    <section id="book" className="py-20 lg:py-28">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow mb-5"><span className="eyebrow-line" />{dict.nav.book}</p>
          <h2 className="section-title">{b.title}</h2>
        </Reveal>

        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {b.steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-2xl p-1">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-spruce font-display text-sm font-bold text-brand-light">{i + 1}</span>
              <div>
                <h3 className="font-semibold text-spruce">{s.title}</h3>
                <p className="mt-1 text-[15px] leading-snug text-spruce/70">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-14">
          <form ref={formRef} onSubmit={submit} noValidate className="order-2 rounded-[2rem] bg-white p-6 shadow-lift sm:p-9 lg:order-1">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-name`} className="field-label">{b.name}</label>
                <input {...field("name")} type="text" autoComplete="name" placeholder={b.namePh} dir="auto" className="input" />
                {err("name")}
              </div>
              <div>
                <label htmlFor={`${uid}-email`} className="field-label">{b.email}</label>
                <input {...field("email")} type="email" autoComplete="email" inputMode="email" placeholder={b.emailPh} dir="ltr" className="input" />
                {err("email")}
              </div>
              <div>
                <label htmlFor={`${uid}-phone`} className="field-label">{b.phone}</label>
                <input {...field("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder={b.phonePh} dir="ltr" className="input" />
                {err("phone")}
              </div>
              <div>
                <label htmlFor={`${uid}-date`} className="field-label">{b.date}</label>
                <input {...field("date")} type="date" min={minDate} className="input" />
                {err("date")}
              </div>
              <div>
                <label htmlFor={`${uid}-tooth`} className="field-label">{b.tooth}</label>
                <select {...field("tooth")} className="input appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pe-10 rtl:bg-[left_1rem_center]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230c2e2a' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}>
                  <option value="">{b.toothPh}</option>
                  {Object.values(TOOTHMAP).map((name) => (
                    <option key={name} value={name}>{tooth(name)}</option>
                  ))}
                </select>
                {err("tooth")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-note`} className="field-label">
                  {b.note} <span className="font-normal text-spruce-mute">{b.optional}</span>
                </label>
                <textarea {...field("note")} rows={3} maxLength={500} placeholder={b.notePh} dir="auto" className="input h-auto resize-none py-3 leading-relaxed" />
                {err("note")}
              </div>
              {/* Honeypot: hidden from people, tempting to bots */}
              <div aria-hidden className="sr-only">
                <label>Website<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} /></label>
              </div>
            </div>

            <Button type="submit" size="lg" loading={sending} className="mt-8 w-full sm:w-auto">
              {sending ? b.sending : (<>{b.submit} <ArrowRight aria-hidden className="rtl:-scale-x-100" /></>)}
            </Button>
            <p className="mt-4 text-sm text-spruce/60">{b.privacy}</p>
          </form>

          <div className="order-1 lg:order-2">
            <div className="rounded-[2rem] bg-enamel p-6 sm:p-8 lg:sticky lg:top-28">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-spruce">{b.chartTitle}</h3>
              <div className="mt-4 flex justify-center">
                <TeethModel value={values.tooth} onChange={(name) => set("tooth", name)} />
              </div>
              <div className="mt-5 min-h-[3.25rem]" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  {values.tooth ? (
                    <motion.p
                      key={values.tooth}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.08 } }}
                      transition={springSnappy}
                      className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 font-semibold text-spruce shadow-soft"
                    >
                      <span className="grid size-6 place-items-center rounded-full bg-brand-light text-spruce"><Check className="size-4" aria-hidden /></span>
                      {tooth(values.tooth)}
                    </motion.p>
                  ) : (
                    <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.08 } }} className="px-1 py-3 text-spruce/65">
                      {b.none}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingResult outcome={outcome} onClose={() => setOutcome(null)} />
    </section>
  );
}
