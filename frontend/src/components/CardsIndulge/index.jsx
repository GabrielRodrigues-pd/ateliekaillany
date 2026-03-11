import { useState } from "react";
import { useCart } from "../../context/CartContext";
import OptimizedImage from "../OptimizedImage";
import "./CardsIndulge.css";

function CardsIndulge({ id, categoria, title, descri, img, alt, price, prices }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(prices ? "250g" : null);

  const currentPrice = prices ? prices[selectedSize] : price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    const finalId = selectedSize ? `${id}-${selectedSize}` : id;
    const finalTitle = selectedSize ? `${title} (${selectedSize})` : title;
    addToCart({ id: finalId, title: finalTitle, price: currentPrice, img });
  };

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(currentPrice || 0);

  return (
    <article className="indulge-card">
      <div className="card-content">
        <span className="card-tag">{categoria}</span>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{descri}</p>

        {prices && (
          <div className="card-size-selector">
            <span className="size-label">Tamanho:</span>
            <div className="size-options">
              <label className={`size-option ${selectedSize === "250g" ? "active" : ""}`}>
                <input
                  type="radio"
                  name={`size-${id}`}
                  value="250g"
                  checked={selectedSize === "250g"}
                  onChange={() => setSelectedSize("250g")}
                />
                250g
              </label>
              <label className={`size-option ${selectedSize === "350g" ? "active" : ""}`}>
                <input
                  type="radio"
                  name={`size-${id}`}
                  value="350g"
                  checked={selectedSize === "350g"}
                  onChange={() => setSelectedSize("350g")}
                />
                350g
              </label>
            </div>
          </div>
        )}

        <div className="card-footer">
          <span className="card-price" aria-label={`Preço: ${formattedPrice}`}>
            {formattedPrice}
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="add-to-cart-btn"
            aria-label={`Adicionar ${title} ao carrinho`}
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="card-image">
        <OptimizedImage src={img} alt={alt || title} />
      </div>
    </article>
  );
}

export default CardsIndulge;
