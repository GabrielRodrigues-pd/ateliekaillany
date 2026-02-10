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
      <Hero></Hero>
      <IndulgeSection></IndulgeSection>
      <Testimonials></Testimonials>
      <WhyChoose></WhyChoose>
      <Creations></Creations>
      <CTA></CTA>
      <Footer></Footer>
    </main>
  );
}

export default App;
