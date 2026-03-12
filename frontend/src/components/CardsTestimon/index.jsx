import "./CardsTestimon.css";
import user from "../../assets/user.avif";
import { Quote, Star } from "lucide-react";

function CardsTestimon({ descri, name, subTexto }) {
  return (
    <article className="testimonial-card">
      <div className="quote-icon-container">
        <Quote className="quote-lucide" size={32} />
      </div>
      <div className="star-rating">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" className="star-icon" />
        ))}
      </div>
      <p className="quote">{descri}</p>
      <hr className="divider" />
      <div className="author">
        <img src={user} alt={name} />
        <div className="author-info">
          <strong>{name}</strong>
          <span>{subTexto}</span>
        </div>
      </div>
    </article>
  );
}

export default CardsTestimon;
