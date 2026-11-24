import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n/server";

export default async function NotFound() {
  const { dict } = await getI18n();
  return (
    <main className="grid min-h-svh place-items-center px-6 text-center">
      <div>
        <Logo className="mb-10" />
        <p className="font-display text-7xl font-bold tracking-tight text-spruce">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-spruce">{dict.notFound.title}</h1>
        <p className="mt-2 text-spruce/70">{dict.notFound.body}</p>
        <Button asChild size="lg" className="mt-8"><Link href="/">{dict.notFound.back}</Link></Button>
      </div>
    </main>
  );
}
