import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Services from "@/components/site/Services";
import Booking from "@/components/site/Booking";
import FAQ from "@/components/site/FAQ";
import Footer from "@/components/site/Footer";
import { SITE } from "@/constants";
import { getI18n } from "@/lib/i18n/server";

const jsonLd = (description: string, lang: string) => ({
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: SITE.name,
  description,
  inLanguage: lang,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  address: { "@type": "PostalAddress", streetAddress: SITE.address },
  image: `${SITE.url}/images/smile-editorial.webp`,
});

export default async function Home() {
  const { dict, locale } = await getI18n();
  return (
    <div className="luxury-site">
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Booking />
        <FAQ />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(dict.meta.description, locale)) }} />
    </div>
  );
}
