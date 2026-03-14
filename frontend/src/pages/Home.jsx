import Hero from "../components/Hero";
import WhyChoose from "../components/WhyChoose";
import IndulgeSection from "../components/Indulge-section";
import Creations from "../components/Creations";
import OrderGuide from "../components/OrderGuide";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <IndulgeSection />
      <Creations />
      <OrderGuide />
      <Testimonials />
      <WhyChoose />
      <CTA />
      <Footer />
    </>
  );
}
