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
import DeliveryModal from "./components/DeliveryModal";

function App() {
  return (
    <CartProvider>
      <main>
        <Hero />
        <WhyChoose />
        <IndulgeSection />
        <Creations />
        <Testimonials />
        <CTA />
        <Footer />
      </main>
      <CartSidebar />
      <DeliveryModal />
    </CartProvider>
  );
}

export default App;
