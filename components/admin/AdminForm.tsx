"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "./Toaster";
import { useI18n } from "@/components/I18nProvider";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 10) s++;
  if (pw.length >= 14) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 3);
}

/** `setup` creates the very first admin; `team` adds a colleague from inside the dashboard. */
export default function AdminForm({ mode }: { mode: "setup" | "team" }) {
  const uid = useId();
  const { toast } = useToast();
  const { dict, msg } = useI18n();
  const su = dict.admin.setup;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [info, setInfo] = useState<{ needsSetup: boolean; requiresKey: boolean } | null>(null);

  useEffect(() => {
    if (mode === "setup") fetch("/api/create").then((r) => r.json()).then(setInfo).catch(() => setInfo({ needsSetup: false, requiresKey: true }));
  }, [mode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, setupKey: setupKey || undefined }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setEmail("");
        setPassword("");
        setSetupKey("");
        if (mode === "team") toast(dict.admin.toast.teamAdded);
        else setMessage({ ok: true, text: su.created });
        if (mode === "setup") setInfo({ needsSetup: false, requiresKey: true });
      } else setMessage({ ok: false, text: data.message ? msg(data.message) : su.failed });
    } catch {
      setMessage({ ok: false, text: dict.admin.login.network });
    }
    setLoading(false);
  };

  if (mode === "setup" && info && !info.needsSetup) {
    return (
      <div className="space-y-5">
        <p className="rounded-xl bg-enamel px-4 py-3 font-semibold text-brand-dark">{message?.ok ? message.text : su.already}</p>
        <Button asChild size="lg" className="w-full"><Link href="/admin">{su.goSignIn}</Link></Button>
      </div>
    );
  }

  const s = strength(password);
  return (
    <form onSubmit={submit} className="space-y-5">
      {message && !message.ok && <p role="alert" className="rounded-xl bg-coral-soft px-4 py-3 text-[15px] font-semibold text-coral">{message.text}</p>}
      <div>
        <label htmlFor={`${uid}-e`} className="field-label">{dict.admin.login.email}</label>
        <input id={`${uid}-e`} type="email" required autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} className="input" dir="ltr" placeholder={dict.admin.team.emailPh} />
      </div>
      <div>
        <label htmlFor={`${uid}-p`} className="field-label">{dict.admin.login.password}</label>
        <div className="relative">
          <input id={`${uid}-p`} type={show ? "text" : "password"} required minLength={10} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" className="input pe-12" aria-describedby={`${uid}-hint`} />
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? dict.admin.login.hide : dict.admin.login.show} aria-pressed={show} className="absolute end-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-spruce/55 hover:bg-enamel hover:text-spruce">
            {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        </div>
        <div className="mt-2.5 flex items-center gap-3" id={`${uid}-hint`}>
          <div className="flex flex-1 gap-1.5" aria-hidden>
            {[0, 1, 2].map((i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-200", password && i < s ? (s === 1 ? "bg-[#E0A100]" : "bg-brand") : "bg-spruce/10")} />)}
          </div>
          <span className="min-w-16 text-end text-sm font-semibold text-spruce/60">{password ? dict.admin.pw.levels[s] : dict.admin.pw.hint}</span>
        </div>
      </div>
      {mode === "setup" && info?.requiresKey && (
        <div>
          <label htmlFor={`${uid}-k`} className="field-label">{su.key}</label>
          <input id={`${uid}-k`} type="password" required autoComplete="off" value={setupKey} onChange={(e) => setSetupKey(e.target.value)} className="input" />
          <p className="mt-1.5 text-sm text-spruce/60">{su.keyHint}</p>
        </div>
      )}
      <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">{loading ? su.creating : mode === "setup" ? su.create : dict.admin.team.add}</Button>
    </form>
  );
}
