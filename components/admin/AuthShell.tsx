import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getI18n } from "@/lib/i18n/server";

/** Split layout shared by sign-in and first-time setup. */
export default async function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const { dict } = await getI18n();
  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <main id="main" className="flex flex-col px-6 py-8 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/" className="hidden items-center gap-1.5 text-[15px] font-semibold text-spruce/70 transition-colors hover:text-spruce sm:flex"><ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden /> {dict.a11y.website}</Link>
          </div>
        </div>
        <div className="my-auto w-full max-w-[420px] py-12">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-spruce sm:text-5xl">{title}</h1>
          <p className="mt-3 text-lg text-spruce/70">{subtitle}</p>
          <div className="mt-9">{children}</div>
        </div>
      </main>
      <div className="relative hidden lg:block">
        <Image src="/login.jpeg" alt="" fill priority sizes="45vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-spruce/70 via-spruce/10 to-transparent" />
        <p className="absolute inset-x-10 bottom-10 max-w-sm font-display text-3xl font-semibold leading-tight tracking-tight text-white">{dict.admin.login.tagline}</p>
      </div>
    </div>
  );
}
