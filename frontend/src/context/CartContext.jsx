import { createContext, useState, useContext, useEffect } from "react";
import { setCookie, getCookie, removeCookie } from "../utils/cookies";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize from cookies on first render
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = getCookie("atelie_cart");
    return savedCart ? savedCart : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync strictly back to cookies whenever cartItems change
  useEffect(() => {
    if (cartItems.length > 0) {
      setCookie("atelie_cart", cartItems, 7); // Save for 7 days
    } else {
      removeCookie("atelie_cart"); // Clean up if empty
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    // Optional: Auto open cart when item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartQuantityCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        clearCart,
        cartTotal,
        cartQuantityCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
