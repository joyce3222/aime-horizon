import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import FocusSectors from "@/components/FocusSectors";
import CrossBorderExpertise from "@/components/CrossBorderExpertise";
import Leadership from "@/components/Leadership";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <FocusSectors />
      <CrossBorderExpertise />
      <Leadership />
      <Contact />
      <Footer />
    </main>
  );
}
