import { useCart } from "../../context/CartContext";
import OptimizedImage from "../OptimizedImage";
import "./CardsIndulge.css";

function CardsIndulge({ id, categoria, title, descri, img, alt, price }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({ id, title, price, img });
  };

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price || 0);

  return (
    <article className="indulge-card">
      <div className="card-content">
        <span className="card-tag">{categoria}</span>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{descri}</p>
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
