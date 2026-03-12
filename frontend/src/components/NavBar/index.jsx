import { useState } from "react";
import { ShoppingCart} from "lucide-react"
import { useCart } from "../../context/CartContext";
import "./style.css";

function NavBar() {
  const { cartQuantityCount, toggleCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="bar container">
        <div className="logo">
          <a href="">Kaillany®</a>
        </div>
        
        <button 
          className="hamburger-btn" 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

        <nav className={`nav ${isMobileMenuOpen ? "open" : ""}`}>
          <a href="#home" onClick={closeMobileMenu}>Home</a>
          <a href="#produtos" onClick={closeMobileMenu}>Produtos</a>
          <a href="#avaliacoes" onClick={closeMobileMenu}>Avaliações</a>
          <a href="#criacoes" onClick={closeMobileMenu}>Criações</a>
          <a href="#sobre-nos" onClick={closeMobileMenu}>Sobre nós</a>
          <a href="#contato" onClick={closeMobileMenu}>Contato</a>
        </nav>
        
        <div className="nav-actions">
          <button
            className="cart-btn"
            onClick={toggleCart}
            aria-label="Open cart"
          >
            <ShoppingCart color="white"/>

            {cartQuantityCount > 0 && (
              <span className="cart-badge">{cartQuantityCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
