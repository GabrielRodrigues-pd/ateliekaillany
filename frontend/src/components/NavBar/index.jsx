import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Package, LogOut, User as UserIcon } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import "./style.css";

function NavBar() {
  const { cartQuantityCount, toggleCart } = useCart();
  const { user, loginWithGoogle, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLoginSuccess = (credentialResponse) => {
    loginWithGoogle(credentialResponse.credential);
  };

  return (
    <nav className="navbar">
      <div className="bar container">
        <div className="logo">
          <Link to="/">Kaillany®</Link>
        </div>
        
        <button 
          className="hamburger-btn" 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

        <nav id="mobile-nav" className={`nav ${isMobileMenuOpen ? "open" : ""}`}>
          <a href="/#home" onClick={closeMobileMenu}>Home</a>
          <a href="/#produtos" onClick={closeMobileMenu}>Produtos</a>
          
          {user && (
            <Link to="/meus-pedidos" onClick={closeMobileMenu} className="nav-highlight">
              <Package size={18} style={{marginRight: '5px', verticalAlign: 'middle'}} />
              Meus Pedidos
            </Link>
          )}

          <a href="/#avaliacoes" onClick={closeMobileMenu}>Avaliações</a>
          <a href="/#sobre-nos" onClick={closeMobileMenu}>Sobre nós</a>
          <a href="/#contato" onClick={closeMobileMenu}>Contato</a>
        </nav>
        
        <div className="nav-actions">
          {user ? (
            <div className="user-profile">
              <button 
                className="user-btn" 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                title={user.name}
                aria-label="Abrir menu do usuário"
                aria-expanded={isUserMenuOpen}
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="user-avatar" />
                ) : (
                  <UserIcon color="white" />
                )}
              </button>
              
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <hr />
                  <button onClick={logout} className="logout-btn" aria-label="Sair da conta">
                    <LogOut size={16} /> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log('Login Failed')}
                useOneTap
                shape="pill"
                size="medium"
                text="signin"
              />
            </div>
          )}

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
