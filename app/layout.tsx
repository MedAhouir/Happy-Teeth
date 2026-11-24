import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Cairo, Mulish } from "next/font/google";
import { SITE } from "@/constants";
import { getI18n } from "@/lib/i18n/server";
import Providers from "@/components/Providers";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Mulish({ subsets: ["latin"], variable: "--font-body", display: "swap" });
// Arabic script: swapped in for both families when the page language is Arabic (see globals.css).
const arabic = Cairo({ subsets: ["arabic", "latin"], variable: "--font-ar", display: "swap" });

const OG_LOCALE = { en: "en_GB", fr: "fr_FR", ar: "ar_MA" } as const;

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  const title = `${SITE.name} | ${dict.meta.tagline}`;
  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: `%s | ${SITE.name}` },
    description: dict.meta.description,
    applicationName: SITE.name,
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: OG_LOCALE[locale],
      title,
      description: dict.meta.description,
      images: [{ url: "/images/smile-editorial.webp", width: 1024, height: 1536, alt: dict.meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: SITE.name, description: dict.meta.description, images: ["/images/smile-editorial.webp"] },
  };
}

export const viewport: Viewport = { themeColor: "#0C2E2A", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { locale, dir, dict } = await getI18n();
  return (
    <html lang={locale} dir={dir} className={`${display.variable} ${body.variable} ${arabic.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-lg bg-spruce px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {dict.a11y.skip}
        </a>
        <Providers locale={locale} dict={dict}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
