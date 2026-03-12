import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { Trash2 } from "lucide-react";
import "./CartSidebar.css";

export default function CartSidebar() {
  const {
    isCartOpen,
    toggleCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    contato: "",
    endereco: "",
    cidade: "Emas - PB", // Default suggestion
  });

  // Load saved customer data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("atelieCustomerData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved customer data", e);
      }
    }
  }, []);

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

  const submitOrder = (e) => {
    e.preventDefault();

    // ---- NEW: Save customer data to localStorage for future orders ----
    localStorage.setItem("atelieCustomerData", JSON.stringify(formData));

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
    
    // Close modal, cart, and open WhatsApp
    setIsCheckoutModalOpen(false);
    toggleCart(); 
    window.open(whatsappUrl, "_blank");
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
          <button className="close-btn" onClick={toggleCart}>
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
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
            <div className="cart-total">
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
                <button type="submit" className="submit-order-btn">
                  Enviar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
