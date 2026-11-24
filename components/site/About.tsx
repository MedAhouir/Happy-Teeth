import Image from "next/image";
import { HeartHandshake, Armchair, CalendarCheck } from "lucide-react";
import Reveal from "./Reveal";
import { getI18n } from "@/lib/i18n/server";

const ICONS = [HeartHandshake, Armchair, CalendarCheck];

export default async function About() {
  const { dict } = await getI18n();
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <div className="about-portrait relative mx-auto max-w-[520px]">
            <div className="absolute -inset-3 -z-10 rounded-[2.25rem] bg-enamel" aria-hidden />
            <Image
              src="/images/clinic-interior.webp"
              alt={dict.about.imgAlt}
              width={1000}
              height={1250}
              sizes="(min-width: 1024px) 480px, 90vw"
              className="aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-lift"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow mb-5"><span className="eyebrow-line" />{dict.nav.about}</p>
            <h2 className="section-title max-w-[18ch]">{dict.about.title}</h2>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-spruce/75">
              {dict.about.body}
            </p>
          </Reveal>

          <Reveal as="ul" className="mt-10 divide-y divide-spruce/10 border-y border-spruce/10" delay={0.08}>
            {dict.about.values.map(({ title, body }, i) => {
              const Icon = ICONS[i];
              return (
              <li key={title} className="care-value flex items-start gap-5 py-5">
                <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-xl bg-enamel text-brand-dark">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-spruce">{title}</h3>
                  <p className="mt-1 text-spruce/70">{body}</p>
                </div>
              </li>
            );})}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
