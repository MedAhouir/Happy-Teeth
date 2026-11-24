import { ArrowUpRight, Clock, Mail, MapPin } from "lucide-react";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE } from "@/constants";
import { getI18n } from "@/lib/i18n/server";

export default async function Footer() {
  const { dict } = await getI18n();
  const tel = SITE.phone.replace(/\s/g, "");
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;
  return (
    <footer id="visit" className="bg-spruce text-white">
      <div className="container-x py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <h2 className="section-title max-w-[16ch]">{dict.footer.title}</h2>
            <a href={`tel:${tel}`} dir="ltr" className="mt-8 inline-block font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-brand-light underline-offset-8 hover:underline">
              {SITE.phone}
            </a>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="lg"><a href="#book">{dict.cta.bookVisit}</a></Button>
              <Button asChild size="lg" className="bg-white/10 hover:bg-white/20">
                <a href={maps} target="_blank" rel="noreferrer">{dict.cta.directions} <ArrowUpRight aria-hidden className="rtl:-scale-x-100" /></a>
              </Button>
            </div>
          </div>

          <dl className="grid gap-8 sm:grid-cols-2">
            <div>
              <dt className="flex items-center gap-2 font-semibold text-white/60"><MapPin className="size-4" aria-hidden /> {dict.footer.find}</dt>
              <dd className="mt-2 text-lg leading-snug" dir="ltr" style={{ unicodeBidi: "plaintext" }}>{SITE.address}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 font-semibold text-white/60"><Mail className="size-4" aria-hidden /> {dict.footer.write}</dt>
              <dd className="mt-2 text-lg"><a href={`mailto:${SITE.email}`} dir="ltr" className="underline-offset-4 hover:underline">{SITE.email}</a></dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="flex items-center gap-2 font-semibold text-white/60"><Clock className="size-4" aria-hidden /> {dict.footer.hours}</dt>
              <dd className="mt-3 divide-y divide-white/10 border-y border-white/10">
                {dict.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4 py-2.5 text-[17px]">
                    <span className="text-white/75">{h.days}</span>
                    <span className="font-semibold tabular-nums" dir="ltr">{h.time}</span>
                  </div>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center">
          <Logo light />
          <nav aria-label={dict.nav.footer} className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-white/70">
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={l.href} className="transition-colors hover:text-white">{dict.nav[l.id]}</a>
            ))}
            <a href="/admin" className="transition-colors hover:text-white">{dict.nav.staff}</a>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher tone="dark" />
            <p className="text-sm text-white/50">© {new Date().getFullYear()} {SITE.name}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
