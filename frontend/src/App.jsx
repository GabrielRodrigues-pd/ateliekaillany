import "./App.css";
import IndulgeSection from "./components/Indulge-section";
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import WhyChoose from "./components/WhyChoose";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Creations from "./components/Creations";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";

function App() {
  return (
    <CartProvider>
      <main>
        <Hero />
        <IndulgeSection />
        <Testimonials />
        <WhyChoose />
        <Creations />
        <CTA />
        <Footer />
      </main>
      <CartSidebar />
    </CartProvider>
  );
}

export default App;
