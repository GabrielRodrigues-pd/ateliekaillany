import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Trash2, CheckCircle } from "lucide-react";
import api from "../../services/api";
import "./CartSidebar.css";

export default function CartSidebar() {
  const {
    isCartOpen,
    toggleCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const { user } = useAuth();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    contato: "",
    endereco: "",
    cidade: "Emas - PB", // Default suggestion
  });

  // Load saved customer data on mount
  useEffect(() => {
    // Priority: Logged in user info
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.name || prev.nome,
        // We might not have phone from Google Auth usually
      }));
    }

    const savedData = localStorage.getItem("atelieCustomerData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved customer data", e);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckoutClick = () => {
    setIsCheckoutModalOpen(true);
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };

  const submitOrder = async (e) => {
    e.preventDefault();

    // ---- NEW: Save customer data to localStorage for future orders ----
    localStorage.setItem("atelieCustomerData", JSON.stringify(formData));

    // ---- NEW: Send order to the backend API ----
    try {
      const productString = cartItems.map(item => `${item.quantity}x ${item.title}`).join(', ');
      const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      
      await api.post('/orders', {
        customerName: formData.nome,
        phone: formData.contato,
        product: productString,
        quantity: totalQuantity,
        city: formData.cidade,
        totalPrice: cartTotal,
        userId: user ? (user.id || user._id) : null // Link order to user if logged in (safely)
      });
      console.log('Pedido salvo com sucesso para o usuário:', user ? (user.id || user._id) : 'Visitante');
    } catch (err) {
      console.error("Erro ao salvar pedido no painel admin:", err);
      // We still proceed with the WhatsApp flow even if API fails
    }

    const phoneNumber = "5583996918173"; // Ateliê WhatsApp Number
    
    // 1. Build Customer Data Header
    let message = `*NOVO PEDIDO - ATELIÊ KAILLANY NUNES*\n\n`;
    message += `👤 *Nome:* ${formData.nome}\n`;
    message += `📞 *Contato:* ${formData.contato}\n`;
    message += `📍 *Endereço:* ${formData.endereco}\n`;
    message += `🏙️ *Cidade:* ${formData.cidade}\n\n`;
    message += `---------------------------------\n`;
    message += `*ITENS DO PEDIDO:*\n\n`;

    // 2. Add Cart Items
    cartItems.forEach(item => {
      message += `🛒 *${item.quantity}x* ${item.title} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    // 3. Add Total
    message += `\n💰 *Total do Pedido:* R$ ${cartTotal.toFixed(2)}\n`;
    message += `---------------------------------\n`;
    message += `Por favor, confirmem o recebimento do pedido!`;

    // Encode message and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Finalize process
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsCheckoutModalOpen(false);
      setIsSubmitting(false);
      setShowSuccessModal(true); // Exibe o modal de sucesso
      
      // Limpa após um tempo e abre o WhatsApp
      setTimeout(() => {
        clearCart();
        setShowSuccessModal(false);
        window.open(whatsappUrl, "_blank");
      }, 3000); // 3 segundos para ver a mensagem de sucesso
    }, 1000);
  };

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? "open" : ""}`}
        onClick={() => {
          if (!isCheckoutModalOpen) toggleCart();
        }}
      />
      <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Seu Carrinho</h2>
          <button className="close-btn" onClick={toggleCart} aria-label="Fechar carrinho">
            &times;
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Seu carrinho está vazio.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.img} alt={item.title} className="cart-item-img" />
                <div className="cart-item-details">
                  <h4>{item.title}</h4>
                  <p className="cart-item-price">R$ {item.price.toFixed(2)}</p>
                  
                  <div className="cart-item-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={`Diminuir quantidade de ${item.title}`}
                      title="Diminuir quantidade"
                    >
                      -
                    </button>
                    <span aria-live="polite" aria-atomic="true">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Aumentar quantidade de ${item.title}`}
                      title="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  title="Remover item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total" aria-live="polite">
              <span>Total</span>
              <span>R$ {cartTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckoutClick}>
              Pedir no WhatsApp
            </button>
          </div>
        )}
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckoutModalOpen && (
        <div className="checkout-modal-overlay">
          <div className="checkout-modal">
            <h3>Detalhes da Entrega</h3>
            <p className="checkout-modal-desc">
              Precisamos de algumas informações para enviar seu pedido via WhatsApp.
            </p>
            
            <form onSubmit={submitOrder} className="checkout-form">
              <div className="form-group">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Seu nome"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="contato">Número ou WhatsApp *</label>
                <input
                  type="tel"
                  id="contato"
                  name="contato"
                  required
                  value={formData.contato}
                  onChange={handleInputChange}
                  placeholder="(83) 90000-0000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endereco">Endereço de Entrega *</label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  required
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Rua, Número, Bairro"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cidade">Cidade *</label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  required
                  value={formData.cidade}
                  onChange={handleInputChange}
                  placeholder="Ex: Emas - PB"
                />
              </div>

              <div className="checkout-modal-actions">
                <button type="button" className="cancel-btn" onClick={closeCheckoutModal}>
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`submit-order-btn ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processando...' : 'Enviar Pedido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon-wrapper">
              <CheckCircle className="success-icon" />
            </div>
            <h3>Pedido Recebido!</h3>
            <p>
              Obrigado, <strong>{formData.nome}</strong>! <br />
              Estamos te redirecionando para o WhatsApp para finalizar os detalhes.
            </p>
            <div className="success-loader-bar">
              <div className="loader-progress"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
