import { useCart } from "../../context/CartContext";
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

  const handleCheckout = () => {
    const phoneNumber = "5583996918173"; // WhatsApp Number
    
    let message = "Olá! Gostaria de fazer o seguinte pedido do Ateliê Kaillany Nunes:\n\n";
    
    // Add items to message
    cartItems.forEach(item => {
      message += `🛒 *${item.quantity}x* ${item.title} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    // Add total to message
    message += `\n💰 *Total do Pedido:* R$ ${cartTotal.toFixed(2)}\n\n`;
    message += "Podem confirmar o pedido e as opções de entrega/retirada para Emas-PB, por favor?";

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open in new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? "open" : ""}`}
        onClick={toggleCart}
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
                >
                  &#128465;
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
            <button className="checkout-btn" onClick={handleCheckout}>
              Pedir no WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
