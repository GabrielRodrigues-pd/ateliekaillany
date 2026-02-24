import "./App.css";
import IndulgeSection from "./components/Indulge-section";
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import WhyChoose from "./components/WhyChoose";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Creations from "./components/Creations";

function App() {
  return (
    <main>
      <Hero />
      <IndulgeSection />
      <Testimonials />
      <WhyChoose />
      <Creations />
      <CTA />
      <Footer />
    </main>
  );
}

export default App;
