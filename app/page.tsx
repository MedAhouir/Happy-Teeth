import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Rapper from "@/components/Rapper";
import Services from "@/components/Services";


export default function Home() {
  return (
    <Rapper>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Contact />
    </Rapper>
  );
}
