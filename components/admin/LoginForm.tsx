"use client";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/I18nProvider";

export default function LoginForm() {
  const { dict, msg } = useI18n();
  const l = dict.admin.login;
  const uid = useId();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.replace("/admin/dashboard");
        router.refresh();
        return;
      }
      setError(data.message ? msg(data.message) : l.failed);
    } catch {
      setError(l.network);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p key="err" role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="rounded-xl bg-coral-soft px-4 py-3 text-[15px] font-semibold text-coral">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <div>
        <label htmlFor={`${uid}-e`} className="field-label">{l.email}</label>
        <input id={`${uid}-e`} type="email" autoComplete="username" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={error ? true : undefined} className="input" dir="ltr" placeholder={l.emailPh} />
      </div>
      <div>
        <label htmlFor={`${uid}-p`} className="field-label">{l.password}</label>
        <div className="relative">
          <input id={`${uid}-p`} type={show ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={error ? true : undefined} dir="ltr" className="input pe-12" />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? l.hide : l.show} aria-pressed={show} className="absolute end-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-spruce/55 hover:bg-enamel hover:text-spruce">
            {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        </div>
      </div>
      <Button type="submit" size="lg" loading={loading} className="w-full">{loading ? l.submitting : l.submit}</Button>
    </form>
  );
}
